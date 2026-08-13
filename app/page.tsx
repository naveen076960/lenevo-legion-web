import BackBombView from "./back-bombview";
import Gpu from "./gpu";

export default function Page() {
  return (
    <main className="lenevo-page">
      <BackBombView />

      {/* <section className="legion-story-section">
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
      </section>*/}

      {/* CPU Section - reserves left space for CPU image */}
      <section className="cpu-section" aria-labelledby="cpu-heading">
        <div className="cpu-inner">
          <div className="cpu-image-placeholder" aria-hidden="true">
            <img src="/cpu.png" alt="CPU illustration" className="cpu-image" />
            {/* CPU image is placed here and styled to blend with background */}
          </div>

          <div className="cpu-details">
            <div className="section-eyebrow">CORE // PERFORMANCE</div>
            <h2 id="cpu-heading" className="section-title">
              Engineered for relentless performance.
            </h2>
            <p className="section-copy">
              The Legion's CPU delivers desktop-class multi-core performance in
              a mobile chassis — optimized for gaming, content creation, and
              heavy multitasking.
            </p>

            {/* Clear, easy-to-edit spec list */}
            <ul className="cpu-spec-list">
              <li>
                <strong>Processor:</strong>
                <span>Intel® Core i9-14900HX</span>
              </li>
              <li>
                <strong>Cores:</strong>
                <span>24</span>
              </li>
              <li>
                <strong>Max Turbo:</strong>
                <span>5.8 GHz</span>
              </li>
              <li>
                <strong>Cache:</strong>
                <span>36 MB</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Render GPU component below CPU section */}
      <Gpu />

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
