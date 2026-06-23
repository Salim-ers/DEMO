"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  MoreVertical,
  ExternalLink,
  Pencil,
  Copy,
  Archive,
  ArchiveRestore,
  Trash2,
  Gauge,
  Download,
} from "lucide-react";
import { DropdownMenu, DropdownItem, DropdownSeparator } from "./ui/dropdown-menu.js";
import { Dialog } from "./ui/dialog.js";
import { Button } from "./ui/button.js";
import { useToast } from "./ui/toast.js";
import { deleteProject, renameProject, duplicateProject, setArchived } from "../lib/actions/projects.js";

export function ProjectActionsMenu({
  id,
  name,
  archived = false,
  align = "end",
  triggerClassName,
}: {
  id: string;
  name: string;
  archived?: boolean;
  align?: "start" | "end";
  triggerClassName?: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(name);

  const doDelete = () =>
    startTransition(async () => {
      const r = await deleteProject(id);
      if (r.ok) {
        toast({ title: "Projet supprimé", description: `« ${name} » a été définitivement supprimé.`, variant: "success" });
        setConfirmDelete(false);
      } else {
        toast({ title: "Suppression impossible", description: r.error, variant: "error" });
      }
    });

  const doRename = () =>
    startTransition(async () => {
      const r = await renameProject(id, newName);
      if (r.ok) {
        toast({ title: "Projet renommé", variant: "success" });
        setRenaming(false);
      } else {
        toast({ title: "Renommage impossible", description: r.error, variant: "error" });
      }
    });

  const doDuplicate = () =>
    startTransition(async () => {
      const r = await duplicateProject(id);
      if (r.ok) {
        toast({
          title: "Projet dupliqué",
          description: "Une copie en brouillon a été créée.",
          variant: "success",
          action: r.id ? { label: "Ouvrir la copie", onClick: () => router.push(`/projects/${r.id}`) } : undefined,
        });
      } else {
        toast({ title: "Duplication impossible", description: r.error, variant: "error" });
      }
    });

  const doArchive = () =>
    startTransition(async () => {
      const r = await setArchived(id, !archived);
      if (r.ok) {
        toast({
          title: archived ? "Projet désarchivé" : "Projet archivé",
          description: archived ? "Il réapparaît dans vos projets." : "Vous le retrouverez dans le filtre Archivés.",
          variant: "success",
        });
      } else {
        toast({ title: "Action impossible", description: r.error, variant: "error" });
      }
    });

  return (
    <>
      <DropdownMenu
        align={align}
        label="Actions du projet"
        triggerClassName={
          triggerClassName ??
          "flex h-8 w-8 items-center justify-center rounded-lg text-faint transition-colors hover:bg-elevated hover:text-ink"
        }
        trigger={<MoreVertical size={16} />}
      >
        <DropdownItem icon={ExternalLink} onSelect={() => router.push(`/projects/${id}`)}>
          Ouvrir
        </DropdownItem>
        <DropdownItem icon={Pencil} onSelect={() => { setNewName(name); setRenaming(true); }}>
          Renommer
        </DropdownItem>
        <DropdownItem icon={Copy} onSelect={doDuplicate}>
          Dupliquer
        </DropdownItem>
        <DropdownItem icon={archived ? ArchiveRestore : Archive} onSelect={doArchive}>
          {archived ? "Désarchiver" : "Archiver"}
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem icon={Gauge} onSelect={() => router.push(`/projects/${id}#quality`)}>
          Voir le rapport qualité
        </DropdownItem>
        <DropdownItem icon={Download} onSelect={() => router.push("/exports")}>
          Historique d'export
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem icon={Trash2} danger onSelect={() => setConfirmDelete(true)}>
          Supprimer
        </DropdownItem>
      </DropdownMenu>

      {/* Delete confirmation */}
      <Dialog
        open={confirmDelete}
        onClose={() => !pending && setConfirmDelete(false)}
        title="Supprimer ce projet ?"
        description={
          <>
            Le projet <span className="font-semibold text-ink">« {name} »</span> et tous ses fichiers (captures,
            storyboard, rendus, exports) seront définitivement supprimés. Cette action est irréversible.
          </>
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(false)} disabled={pending}>
              Annuler
            </Button>
            <Button variant="danger" onClick={doDelete} disabled={pending}>
              {pending ? "Suppression…" : "Supprimer définitivement"}
            </Button>
          </>
        }
      />

      {/* Rename */}
      <Dialog
        open={renaming}
        onClose={() => !pending && setRenaming(false)}
        title="Renommer le projet"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRenaming(false)} disabled={pending}>
              Annuler
            </Button>
            <Button variant="primary" onClick={doRename} disabled={pending || newName.trim().length < 2}>
              {pending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </>
        }
      >
        <input
          autoFocus
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newName.trim().length >= 2) doRename();
          }}
          className="mt-4 w-full rounded-xl border border-hairline bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-accent/50"
          placeholder="Nom du projet"
        />
      </Dialog>
    </>
  );
}
