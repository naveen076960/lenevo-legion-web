import BackBombView from "./back-bombview";

export default function Page() {
  return (
    <main className="lenevo-page">
      <BackBombView />

      <section className="legion-story-section">
        <div className="legion-story-inner">
          <div className="section-eyebrow">OPERATIONS // SYSTEM MAP</div>
          <div className="two-column-layout">
            <div>
              <h2 className="section-title">From signal to execution.</h2>
              <p className="section-copy">
                Legion unifies the intelligence layer, active compute flow, and
                field-ready command permissions into one sustained operating
                rhythm.
              </p>
            </div>
            <div className="signal-stack">
              <div>
                <span className="signal-label">thermal routing</span>
                <span className="signal-value">02.8ms</span>
              </div>
              <div>
                <span className="signal-label">adaptive compute</span>
                <span className="signal-value">97%</span>
              </div>
              <div>
                <span className="signal-label">field resilience</span>
                <span className="signal-value">online</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="legion-cta-section">
        <div className="legion-cta-inner">
          <div>
            <span className="section-eyebrow">ACCESS PROTOCOL</span>
            <h2 className="section-title compact">
              Enter the Legion operating stack.
            </h2>
          </div>
          <a href="#" className="primary-button">
            Request deployment
          </a>
        </div>
      </section>
    </main>
  );
}
