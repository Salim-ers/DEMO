import { Hero } from "./hero.js";
import { TrustTicker } from "./trust-ticker.js";
import { HowItWorks } from "./how-it-works.js";
import { EngineTimeline } from "./engine-timeline.js";
import { PipelineOrbit } from "./pipeline-orbit.js";
import { StylesSwitcher } from "./styles-switcher.js";
import { FormatsSection } from "./formats-section.js";
import { ExamplesSection } from "./examples-section.js";
import { PricingSection } from "./pricing-section.js";
import { FaqSection } from "./faq-section.js";
import { FinalCta } from "./final-cta.js";

/**
 * Studio One landing — dark cinematic studio. Short but intense: a film-grade
 * hero, the production engine as a scrubbed editing timeline, an interactive
 * style switcher, the three social formats, real examples, one clear plan, a
 * tight FAQ and a closing call. Bronze is the single accent; the rest stays
 * warm near-black so nothing reads as generic.
 */
export function Landing() {
  return (
    <>
      <Hero />
      <TrustTicker />
      <HowItWorks />
      <EngineTimeline />
      <PipelineOrbit />
      <StylesSwitcher />
      <FormatsSection />
      <ExamplesSection />
      <PricingSection />
      <FaqSection />
      <FinalCta />
    </>
  );
}
