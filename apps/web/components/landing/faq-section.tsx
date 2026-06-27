import { Reveal } from "../motion/reveal.js";
import { FAQItem } from "../ui/faq-item.js";

const FAQ = [
  { q: "Est-ce que mes vidéos ressemblent à de l'IA ?", a: "Non. Studio One assemble vos vrais écrans, des plans soignés et un montage rythmé. Le résultat ressemble à une vidéo produite par un studio, pas à une génération automatique." },
  { q: "Combien de vidéos puis-je créer ?", a: "10 vidéos de présentation par mois sont incluses dans l'abonnement à 39,99 €. Vous gardez l'accès à tout votre historique de projets." },
  { q: "Quels formats sont disponibles ?", a: "16:9 pour le web et les sales decks, 9:16 pour TikTok, Reels et Shorts, 1:1 pour le feed. Une même vidéo peut être déclinée en plusieurs formats." },
  { q: "Dois-je fournir mes accès ?", a: "Vous pouvez coller une URL publique, importer des captures, ou donner un accès démo dédié. Studio One s'adapte à ce que vous avez sous la main." },
  { q: "Puis-je ajouter une voix off ?", a: "Oui. Voix off premium générée, ou script prêt à enregistrer avec votre propre voix. Les sous-titres sont synchronisés automatiquement." },
  { q: "Combien de temps pour recevoir ma vidéo ?", a: "Le storyboard est prêt en quelques minutes. La vidéo finale suit, et vous validez chaque étape avant l'export." },
];

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-28 sm:px-8 sm:py-32">
      <Reveal className="text-center">
        <p className="eyebrow justify-center">FAQ</p>
        <h2 className="text-display mt-4 text-[clamp(1.9rem,3.6vw,2.8rem)] text-ink">Questions fréquentes</h2>
      </Reveal>
      <Reveal className="mt-12 block border-t border-hairline">
        {FAQ.map((f, i) => (
          <FAQItem key={f.q} question={f.q} answer={f.a} defaultOpen={i === 0} />
        ))}
      </Reveal>
    </section>
  );
}
