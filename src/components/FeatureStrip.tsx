const features = [
  'Private client-side conversion',
  'Responsive layout for every screen',
  'Accessible controls with keyboard support',
];

export function FeatureStrip() {
  return (
    <section className="feature-strip" aria-label="Application highlights">
      {features.map((feature) => (
        <div key={feature} className="feature-pill">
          {feature}
        </div>
      ))}
    </section>
  );
}
