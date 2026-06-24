# Studio One — Direction artistique

**Positionnement :** _Studio One — Vidéos de démonstration SaaS professionnelles._
L'interface doit être sobre, élégante, claire et rassurante. Pas de néon, pas
d'effets futuristes, pas de jargon. Un studio professionnel, simple à utiliser.

## Principes

- **Sobre et premium.** Beaucoup d'espace, peu d'éléments, hiérarchie nette.
- **Français partout.** Toute l'interface est en français.
- **Le logo en valeur.** Wordmark blanc sur fond sombre, badge brun sur fond crème.
  Jamais de plaque ou de damier derrière le logo (les PNG sont transparents).

## Palette

Source unique : `app/globals.css` (`:root`) et `tailwind.config.ts`.

- Fond sombre `#060504`, fond doux `#11100E`
- Crème `#FFF7EC`, crème douce `#F3E7D7`
- Brun `#8B5E34`, caramel `#B9824A` (accent)
- Texte sombre `#1A130D`

## Typographie

Inter (sans-serif moderne) pour tout le texte. La typo script n'existe que dans
le logo lui-même (fichiers PNG dans `public/brand/`).

## Composants

`components/ui/` — `button`, `card`, `input`, `status-badge`, `stepper`,
`empty-state`, `badge`, `dialog`, `dropdown-menu`, `toast`. Animations légères
uniquement (`animate-fade-up`, `animate-fade-in`) — pas de 3D, pas de parallax.
