import crypto from "node:crypto";

/**
 * SecretVault abstraction. The MVP ships a local AES-256-GCM vault. In prod,
 * swap the implementation for Doppler / Infisical / AWS Secrets Manager / Vault
 * behind this same interface — callers only ever see opaque refs.
 */
export interface SecretVault {
  readonly name: string;
  /** Store a secret, return an opaque ref. The plaintext must NEVER be logged. */
  store(plaintext: string): Promise<string>;
  /** Resolve a ref back to plaintext (used only inside the capture worker). */
  resolve(ref: string): Promise<string>;
  /** Permanently delete the secret behind a ref. */
  destroy(ref: string): Promise<void>;
}

function key32(): Buffer {
  const raw = process.env.LOCAL_SECRET_ENCRYPTION_KEY ?? "";
  // Accept base64 or raw; always derive a stable 32-byte key.
  const buf = Buffer.from(raw, raw.length === 44 ? "base64" : "utf-8");
  return crypto.createHash("sha256").update(buf).digest();
}

/**
 * Local encrypted vault. The "ref" is the self-contained ciphertext envelope
 * (iv:tag:ciphertext, base64). In a real deployment you'd persist envelopes in a
 * dedicated table or a managed secrets store; here the ref carries the payload so
 * the worker can decrypt without a network call, and nothing sensitive hits logs.
 */
export class LocalEncryptedVault implements SecretVault {
  readonly name = "local";

  async store(plaintext: string): Promise<string> {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", key32(), iv);
    const enc = Buffer.concat([cipher.update(plaintext, "utf-8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `local:${iv.toString("base64")}:${tag.toString("base64")}:${enc.toString("base64")}`;
  }

  async resolve(ref: string): Promise<string> {
    const [scheme, ivB64, tagB64, dataB64] = ref.split(":");
    if (scheme !== "local" || !ivB64 || !tagB64 || !dataB64) {
      throw new Error("LocalEncryptedVault: malformed ref");
    }
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      key32(),
      Buffer.from(ivB64, "base64"),
    );
    decipher.setAuthTag(Buffer.from(tagB64, "base64"));
    return Buffer.concat([
      decipher.update(Buffer.from(dataB64, "base64")),
      decipher.final(),
    ]).toString("utf-8");
  }

  async destroy(_ref: string): Promise<void> {
    // No-op for the self-contained local envelope. A table-backed vault would
    // delete the row here. Provided so the interface is honored end-to-end.
  }
}

let _vault: SecretVault | null = null;
export function getVault(): SecretVault {
  if (!_vault) _vault = new LocalEncryptedVault();
  return _vault;
}

/** Mask an email for safe display/audit (j•••@acme.io). */
export function maskEmail(email?: string): string | undefined {
  if (!email) return undefined;
  const [user, domain] = email.split("@");
  if (!user || !domain) return "•••";
  return `${user[0]}•••@${domain}`;
}
