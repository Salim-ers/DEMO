/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  ArrowRight, Check, Globe, KeyRound, PenLine, Clapperboard, Download,
  Clock, MessageSquare, MonitorCheck, Users, Eye, ListOrdered, Mic,
  ShieldCheck, Rocket, Briefcase, Building2, Megaphone, Code2, Play,
} from "lucide-react";
import { LogoMark } from "../brand/logo.js";
import { AnimatedDots } from "../ui/animated-dots.js";
import { EditorTimeline } from "./editor-timeline.js";
import { SectionHeader } from "../ui/section-header.js";
import { FeatureCard } from "../ui/feature-card.js";
import { StepCard } from "../ui/step-card.js";
import { TemplateCard } from "../ui/template-card.js";
import { ScenarioCard } from "../ui/scenario-card.js";
import { PricingCard } from "../ui/pricing-card.js";
import { FAQItem } from "../ui/faq-item.js";
import { BeforeAfter } from "../ui/before-after.js";
import { CTASection } from "../ui/cta-section.js";
import { Reveal, RevealGroup, RevealItem, HeroStagger, HeroItem } from "./motion.js";

const PAPER = "#f7f1e6";

const HERO_POINTS = [
  "Capture réelle de votre application",
  "Script voix off prêt à enregistrer",
  "Export vidéo pour vos prospects",
];

const POURQUOI = [
  { icon: Clock, title: "Gagner du temps", text: "Préparez une vidéo de démo sans passer par un montage manuel complet." },
  { icon: MessageSquare, title: "Garder un discours clair", text: "Structurez votre démonstration autour des bons bénéfices produit." },
  { icon: MonitorCheck, title: "Montrer le vrai produit", text: "Les vidéos sont construites à partir de vraies captures, pas d’interfaces inventées." },
  { icon: Users, title: "Aider vos commerciaux", text: "Fournissez à votre équipe des supports propres à envoyer avant ou après un appel." },
];

const STEPS = [
  { icon: Globe, title: "Ajoutez votre produit", text: "Indiquez le nom du SaaS, l’URL, l’audience cible et la promesse principale." },
  { icon: KeyRound, title: "Ajoutez un accès démo", text: "Studio One utilise un compte de démonstration pour capturer les bons écrans." },
  { icon: PenLine, title: "Décrivez le scénario", text: "Expliquez ce que la vidéo doit montrer : dashboard, création, analytics, bénéfices, conclusion." },
  { icon: Clapperboard, title: "Studio One prépare la vidéo", text: "L’outil organise les captures, le storyboard, le script voix off et les sous-titres." },
  { icon: Download, title: "Téléchargez vos fichiers", text: "Récupérez la vidéo, le script, les sous-titres et les assets associés." },
];

const MODELES = [
  { title: "Démo commerciale SaaS", desc: "Pour présenter rapidement votre produit à des prospects.", duration: "60 à 90 secondes", ideal: "prospection, relance, page de vente" },
  { title: "Démo onboarding", desc: "Pour montrer à un nouvel utilisateur comment prendre en main votre outil.", duration: "2 à 3 minutes", ideal: "formation client, support, centre d’aide" },
  { title: "Démo fonctionnalité", desc: "Pour expliquer une fonctionnalité précise sans refaire toute la présentation produit.", duration: "45 à 75 secondes", ideal: "annonces produit, emails clients, tutoriels courts" },
  { title: "Démo avant / après", desc: "Pour montrer le problème avant votre solution, puis le gain apporté.", duration: "60 à 90 secondes", ideal: "landing page, publicité, présentation commerciale" },
  { title: "Démo verticale métier", desc: "Pour adapter la vidéo à un secteur précis : immobilier, santé, équin, finance, RH, éducation.", duration: "90 secondes", ideal: "campagnes ciblées, niches B2B" },
  { title: "Démo courte réseaux sociaux", desc: "Pour créer une version courte en format vertical ou carré.", duration: "20 à 40 secondes", ideal: "LinkedIn, X, Instagram, TikTok, ads" },
];

const SCENARIOS = [
  { title: "SaaS B2B classique", desc: "Présentation produit complète et rythmée.", script: "Présentez le tableau de bord, montrez la création d’un élément, ouvrez la section statistiques, puis concluez sur le gain de temps et la meilleure visibilité pour l’équipe." },
  { title: "CRM ou outil commercial", desc: "Parcours orienté équipe de vente.", script: "Montrez la liste des prospects, ouvrez une fiche client, créez une relance, affichez le pipeline, puis concluez sur la meilleure organisation commerciale." },
  { title: "Plateforme métier", desc: "Centralisation des données et fiabilité.", script: "Présentez le problème quotidien, montrez comment les données sont centralisées, ouvrez une fiche exemple, puis terminez sur la réduction des erreurs et la simplicité d’usage." },
  { title: "Onboarding client", desc: "Prise en main guidée.", script: "Souhaitez la bienvenue, montrez la configuration initiale, présentez les trois actions clés à connaître, puis terminez sur les ressources d’aide disponibles." },
  { title: "Nouvelle fonctionnalité", desc: "Annonce courte et concrète.", script: "Rappelez le besoin en une phrase, ouvrez la nouvelle fonctionnalité, montrez-la en action sur un cas concret, puis concluez sur le bénéfice immédiat." },
  { title: "Démo premium courte", desc: "Rythme calme et conclusion soignée.", script: "Commencez par le contexte métier, montrez les écrans essentiels avec un rythme calme, ajoutez des bénéfices clairs, puis terminez avec une conclusion élégante et rassurante." },
];

const OBTENEZ = [
  "Une vidéo de démonstration prête à partager",
  "Un script voix off clair",
  "Des sous-titres",
  "Un storyboard structuré",
  "Des captures propres de votre produit",
  "Des assets exportables",
  "Plusieurs formats : 16:9, vertical, carré",
];

const QUALITE = [
  { icon: Eye, title: "Captures lisibles", text: "Les écrans doivent rester nets et compréhensibles." },
  { icon: ListOrdered, title: "Storyboard structuré", text: "La vidéo suit un fil logique : contexte, solution, fonctionnalités, bénéfices." },
  { icon: Mic, title: "Voix maîtrisée", text: "Utilisez un script prêt à enregistrer avec une voix humaine ou une voix premium." },
  { icon: Download, title: "Exports exploitables", text: "Téléchargez les fichiers utiles pour vos équipes commerciales et marketing." },
];

const SECURITE = [
  "Utilisez un compte de démonstration dédié",
  "Évitez les données clients réelles",
  "Masquez les informations sensibles si nécessaire",
  "Gardez le contrôle du scénario enregistré",
];

const POUR_QUI = [
  { icon: Rocket, title: "Fondateurs SaaS", text: "Présentez votre produit rapidement sans devoir refaire une démo complète à chaque prospect." },
  { icon: Briefcase, title: "Équipes commerciales", text: "Envoyez une vidéo claire avant ou après un rendez-vous." },
  { icon: Building2, title: "Agences", text: "Livrez à vos clients des vidéos de démonstration propres et réutilisables." },
  { icon: Megaphone, title: "Product marketers", text: "Créez des supports courts pour expliquer les nouveautés et les fonctionnalités." },
  { icon: Code2, title: "Freelances et studios no-code", text: "Valorisez les outils que vous construisez avec une présentation professionnelle." },
];

const CAS_USAGE = [
  "Vidéo de prospection", "Vidéo pour landing page", "Vidéo de relance après démo",
  "Vidéo d’onboarding client", "Vidéo de lancement produit", "Vidéo de formation interne",
  "Vidéo LinkedIn", "Vidéo pour investisseurs", "Vidéo explicative d’une fonctionnalité",
];

const OFFRES = [
  { name: "Essentiel", tagline: "Pour tester le principe avec une première vidéo.", features: ["1 projet de démo", "Export vidéo standard", "Script voix off", "Sous-titres"], cta: { label: "Commencer", href: "/new" } },
  { name: "Pro", tagline: "Pour les équipes qui créent régulièrement des supports commerciaux.", features: ["Plusieurs projets de démo", "Exports premium", "Formats 16:9, vertical et carré", "Modèles de scénarios", "Assets exportables"], cta: { label: "Créer une démo", href: "/new" }, featured: true },
  { name: "Studio", tagline: "Pour agences, équipes sales ou besoins avancés.", features: ["Plusieurs marques ou clients", "Variantes de vidéos", "Scénarios personnalisés", "Support prioritaire", "Préparation de campagnes vidéo"], cta: { label: "Nous contacter", href: "/new" } },
];

const AVANT = ["Démonstrations longues à préparer", "Captures faites à la main", "Discours commercial variable", "Difficulté à réutiliser une démo", "Vidéos souvent jamais produites"];
const APRES = ["Scénario structuré", "Captures propres", "Support réutilisable", "Vidéo prête à envoyer", "Meilleure cohérence commerciale"];

const FAQ = [
  { q: "Est-ce que Studio One crée une fausse interface ?", a: "Non. Studio One est pensé pour travailler à partir de vraies captures de votre produit. L’objectif est de montrer votre application telle qu’elle existe, de façon claire et professionnelle." },
  { q: "Dois-je fournir mes vrais accès ?", a: "Non. Il est recommandé de créer un compte de démonstration dédié, avec des données fictives propres, spécialement prévu pour la vidéo." },
  { q: "Puis-je écrire mon propre scénario ?", a: "Oui. Vous pouvez indiquer précisément ce que la vidéo doit montrer : pages à ouvrir, fonctionnalités à présenter, bénéfices à mettre en avant et conclusion attendue." },
  { q: "Puis-je utiliser une vraie voix humaine ?", a: "Oui. Studio One peut vous fournir un script prêt à enregistrer. C’est souvent la meilleure option pour obtenir un rendu naturel et professionnel." },
  { q: "Quels formats sont disponibles ?", a: "Vous pouvez exporter en 16:9 (paysage), 9:16 (vertical) et 1:1 (carré), selon l’endroit où la vidéo sera utilisée." },
  { q: "Est-ce adapté aux SaaS métier ?", a: "Oui. Studio One est particulièrement utile pour les SaaS B2B, outils métiers, plateformes internes, solutions no-code et produits qui nécessitent une démonstration claire." },
  { q: "Que se passe-t-il si la capture échoue ?", a: "Vous pouvez relancer la génération. Vérifiez l’URL, les accès du compte de démonstration et le scénario, puis réessayez." },
  { q: "À quoi sert le script voix off ?", a: "Il vous donne un texte prêt à enregistrer pour une voix humaine ou une voix premium, afin d’accompagner clairement la démonstration." },
];

export function Landing() {
  return (
    <>
      {/* 1 — HERO (sombre, points qui se fondent dans le crème) */}
      <section id="presentation" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas">
        <div className="absolute inset-y-0 left-0 z-0 w-[52%]">
          <AnimatedDots fullScreen={false} className="h-full w-full" />
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(90deg, transparent 55%, #060504 100%)" }} />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3" style={{ background: "linear-gradient(to bottom, transparent, #060504)" }} />
        </div>
        <div className="absolute inset-y-0 right-0 z-0 w-[60%]">
          <EditorTimeline />
          <div aria-hidden className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/hero/editing.jpg')" }} />
          <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(90deg, #060504 0%, rgba(6,5,4,0.78) 22%, rgba(6,5,4,0.30) 52%, rgba(6,5,4,0.45) 100%)" }} />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: "radial-gradient(60% 52% at 50% 30%, rgba(185,130,74,0.18) 0%, rgba(139,94,52,0.07) 42%, transparent 72%)" }} />
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: "radial-gradient(46% 48% at 50% 46%, rgba(6,5,4,0.74) 0%, rgba(6,5,4,0.42) 50%, transparent 80%)" }} />

        <HeroStagger className="relative z-10 flex max-w-3xl flex-col items-center px-5 py-24 text-center">
          <HeroItem>
            <LogoMark tone="cream" size={120} className="mb-7 max-w-[44vw] drop-shadow-[0_18px_50px_rgba(0,0,0,0.55)]" />
          </HeroItem>
          <HeroItem>
            <span className="block text-xs font-semibold uppercase tracking-[0.32em] text-accent-deep">Bienvenue chez Studio One</span>
          </HeroItem>
          <HeroItem blur>
            <h1 className="text-display mx-auto mt-5 max-w-3xl text-balance text-[clamp(2.3rem,5vw,4.25rem)] text-ink">
              Créez des vidéos de démonstration professionnelles pour vos SaaS.
            </h1>
          </HeroItem>
          <HeroItem>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted sm:text-xl">
              Studio One transforme vos écrans, vos accès démo et votre scénario en une vidéo claire, structurée et prête à être utilisée par vos commerciaux.
            </p>
          </HeroItem>
          <HeroItem>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/new" className="btn-primary px-7 py-3.5 text-base">Créer une démo <ArrowRight size={18} /></Link>
              <Link href="#fonctionnement" className="btn-secondary px-7 py-3.5 text-base">Voir comment ça marche</Link>
            </div>
          </HeroItem>
          <HeroItem>
            <p className="mt-5 text-sm text-faint">Aucune interface inventée. Studio One utilise de vraies captures de votre produit.</p>
          </HeroItem>
          <HeroItem>
            <ul className="mt-7 flex flex-col items-center gap-x-6 gap-y-2 text-sm text-muted sm:flex-row">
              {HERO_POINTS.map((p) => (
                <li key={p} className="flex items-center gap-2"><Check size={16} className="text-accent-deep" /> {p}</li>
              ))}
            </ul>
          </HeroItem>
        </HeroStagger>

        {/* fondu du hero vers le corps crème (plus de coupure nette) */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-52" style={{ background: `linear-gradient(to bottom, rgba(247,241,230,0), ${PAPER})` }} />
      </section>

      {/* CORPS — fond blanc cassé chaud */}
      <div className="paper" style={{ backgroundColor: PAPER }}>
        {/* 2 — POURQUOI */}
        <section id="pourquoi" className="mx-auto max-w-6xl px-5 pb-24 pt-20 sm:px-8 sm:pb-28">
          <Reveal>
            <SectionHeader eyebrow="Pourquoi Studio One" title="Pourquoi utiliser Studio One ?" subtitle="Créer une bonne vidéo de démonstration demande du temps : écrire le scénario, capturer les bons écrans, monter la vidéo, ajouter une voix, exporter les bons formats. Studio One simplifie ce processus pour vous aider à produire rapidement des vidéos propres, cohérentes et exploitables." />
          </Reveal>
          <RevealGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {POURQUOI.map((c) => (
              <RevealItem key={c.title}><FeatureCard icon={c.icon} title={c.title} text={c.text} /></RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* 3 — COMMENT ÇA MARCHE */}
        <section id="fonctionnement" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
          <Reveal>
            <SectionHeader align="center" eyebrow="Comment ça marche" title="Comment ça marche" subtitle="Un processus simple, pensé pour aller de votre produit à une vidéo prête à partager." className="[&_p]:mx-auto" />
          </Reveal>
          <RevealGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {STEPS.map((s, i) => (
              <RevealItem key={s.title}><StepCard index={i + 1} icon={s.icon} title={s.title} text={s.text} /></RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* SHOWCASE — photo écran de montage */}
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
            <Reveal>
              <SectionHeader eyebrow="Le rendu" title="Une vidéo prête à envoyer, pas un projet de montage." />
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Captures réelles de votre application, storyboard structuré, voix off et sous-titres : tout est assemblé pour vous, dans le format de votre choix.
              </p>
              <Link href="/new" className="btn-primary mt-8 px-7 py-3.5 text-base">Créer une démo <ArrowRight size={18} /></Link>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative overflow-hidden rounded-3xl border border-hairline shadow-soft">
                <img src="/visuals/edit.jpg" alt="Écran de montage vidéo" className="aspect-[4/3] w-full object-cover" />
                <span className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-studio shadow-lg">
                  <Play size={19} className="ml-0.5" fill="currentColor" />
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 4 — MODÈLES */}
        <section id="modeles" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
          <Reveal>
            <SectionHeader eyebrow="Modèles" title="Des modèles adaptés à chaque usage" subtitle="Choisissez le type de démonstration qui correspond à votre objectif commercial." />
          </Reveal>
          <RevealGroup className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {MODELES.map((m) => (
              <RevealItem key={m.title}><TemplateCard title={m.title} desc={m.desc} duration={m.duration} ideal={m.ideal} /></RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* 5 — SCÉNARIOS */}
        <section id="scenarios" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
          <Reveal>
            <SectionHeader eyebrow="Scénarios" title="Exemples de scénarios prêts à utiliser" subtitle="Copiez un scénario et adaptez-le à votre produit." />
          </Reveal>
          <RevealGroup className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
            {SCENARIOS.map((s) => (
              <RevealItem key={s.title}><ScenarioCard title={s.title} desc={s.desc} script={s.script} /></RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* 6 — CE QUE VOUS OBTENEZ */}
        <section id="obtenez" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
          <Reveal>
            <SectionHeader eyebrow="Livrables" title="Ce que vous obtenez à la fin" />
          </Reveal>
          <RevealGroup className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OBTENEZ.map((item) => (
              <RevealItem key={item}>
                <div className="card flex items-center gap-3 p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/12 text-accent-deep"><Check size={18} /></span>
                  <span className="text-[15px] text-ink">{item}</span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-3xl text-base leading-relaxed text-muted">
              Votre équipe peut utiliser ces éléments dans ses emails, pages de vente, relances commerciales, démos asynchrones, présentations investisseurs ou supports d’onboarding.
            </p>
          </Reveal>
        </section>

        {/* 7 — QUALITÉ ET RENDU (avec photo caméra) */}
        <section id="qualite" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
            <Reveal>
              <SectionHeader eyebrow="Qualité" title="Un rendu pensé pour un usage professionnel" subtitle="Studio One privilégie une démonstration claire, lisible et crédible. L’objectif n’est pas de créer une vidéo artificielle, mais de mettre en valeur votre vrai produit avec une structure propre, un bon rythme et un message commercial compréhensible." />
            </Reveal>
            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-3xl border border-hairline shadow-soft">
                <img src="/visuals/camera.jpg" alt="Caméra de production vidéo" className="aspect-[4/3] w-full object-cover" />
              </div>
            </Reveal>
          </div>
          <RevealGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {QUALITE.map((c) => (
              <RevealItem key={c.title}><FeatureCard icon={c.icon} title={c.title} text={c.text} /></RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* 8 — SÉCURITÉ */}
        <section id="securite" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Reveal>
              <SectionHeader eyebrow="Sécurité" title="Des accès utilisés uniquement pour la démonstration" />
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Studio One est pensé pour fonctionner avec des comptes de démonstration. Les accès servent uniquement à capturer le parcours prévu dans le scénario. Il est recommandé d’utiliser un compte démo contenant des données fictives et propres.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="card space-y-4 p-7">
                {SECURITE.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-[15px] text-ink">
                    <ShieldCheck size={20} className="mt-0.5 shrink-0 text-accent-deep" /> {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* 9 — POUR QUI */}
        <section id="pour-qui" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
          <Reveal>
            <SectionHeader eyebrow="Pour qui" title="Pour qui est fait Studio One ?" />
          </Reveal>
          <RevealGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {POUR_QUI.map((c) => (
              <RevealItem key={c.title}><FeatureCard icon={c.icon} title={c.title} text={c.text} /></RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* 10 — CAS D’USAGE */}
        <section id="cas-usage" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
          <Reveal>
            <SectionHeader eyebrow="Cas d’usage" title="Cas d’usage fréquents" />
          </Reveal>
          <RevealGroup className="mt-12 flex flex-wrap gap-3">
            {CAS_USAGE.map((c) => (
              <RevealItem key={c}>
                <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-4 py-2 text-sm text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {c}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* 11 — OFFRES */}
        <section id="offres" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
          <Reveal>
            <SectionHeader align="center" eyebrow="Offres" title="Choisissez le niveau qui correspond à votre besoin" />
          </Reveal>
          <RevealGroup className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            {OFFRES.map((o) => (
              <RevealItem key={o.name}><PricingCard name={o.name} tagline={o.tagline} features={o.features} cta={o.cta} featured={o.featured} /></RevealItem>
            ))}
          </RevealGroup>
          <Reveal delay={0.1}>
            <p className="mt-8 text-center text-sm text-faint">Les offres peuvent être ajustées selon votre volume de vidéos et vos besoins d’accompagnement.</p>
          </Reveal>
        </section>

        {/* 12 — AVANT / APRÈS */}
        <section id="avant-apres" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
          <Reveal>
            <SectionHeader eyebrow="Avant / Après" title="Ce que Studio One change" />
          </Reveal>
          <Reveal delay={0.08} className="mt-14 block">
            <BeforeAfter before={AVANT} after={APRES} />
          </Reveal>
        </section>

        {/* 13 — FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-5 py-24 sm:px-8 sm:py-28">
          <Reveal>
            <SectionHeader align="center" eyebrow="FAQ" title="Questions fréquentes" />
          </Reveal>
          <Reveal delay={0.08} className="mt-12 block">
            <div className="border-t border-hairline">
              {FAQ.map((f, i) => (
                <FAQItem key={f.q} question={f.q} answer={f.a} defaultOpen={i === 0} />
              ))}
            </div>
          </Reveal>
        </section>
      </div>

      {/* 14 — CTA FINAL (sombre, bookend) */}
      <CTASection
        title="Transformez votre produit en une vidéo claire et professionnelle."
        text="Préparez une démo que vos prospects peuvent comprendre sans long rendez-vous, sans montage manuel et sans support improvisé."
        cta={{ label: "Créer une démo", href: "/new" }}
      />
    </>
  );
}
