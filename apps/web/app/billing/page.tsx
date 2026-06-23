import { Receipt } from "lucide-react";
import { BillingPanel } from "../../components/billing-panel.js";

export const metadata = { title: "Facturation" };

export default function BillingPage() {
  return (
    <div className="animate-fade-up mx-auto max-w-2xl">
      <header className="mb-8">
        <p className="eyebrow mb-2">Compte</p>
        <h1 className="display text-3xl font-semibold text-ink">Facturation</h1>
        <p className="mt-2 text-muted">Votre abonnement StudioOne et son historique, au même endroit.</p>
      </header>

      <div className="space-y-6">
        <BillingPanel />

        <section className="card overflow-hidden">
          <div className="border-b border-hairline px-6 py-4">
            <span className="eyebrow">Historique de facturation</span>
          </div>
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-elevated text-faint">
              <Receipt size={18} />
            </span>
            <p className="text-sm font-medium text-ink">Aucune facture pour l'instant</p>
            <p className="mt-1 max-w-xs text-sm text-muted">
              Vos reçus apparaîtront ici une fois le paiement activé.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
