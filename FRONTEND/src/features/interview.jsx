import React, { useMemo, useState } from "react";
import "./interview.scss";

const QUESTIONS = {
  technical: [
    "Explain Redis pub/sub and one production pitfall.",
    "How would you debug a delayed message queue consumer?",
    "What does the Node.js event loop do in each phase?",
  ],
  behavioral: [
    "Describe a time you handled a high-pressure incident.",
    "How do you prioritize conflicting tasks from stakeholders?",
    "Tell me about a mistake you made and what changed after.",
  ],
  roadmap: [
    "Review data structures and algorithm patterns.",
    "Practice system design fundamentals weekly.",
    "Run mock interviews and gather structured feedback.",
  ],
};

const SKILL_GAPS = ["redis", "Message queue", "Event loop"];

function Interview() {
  const [activeTab, setActiveTab] = useState("technical");

  const activeTitle = useMemo(() => {
    if (activeTab === "behavioral") return "Behavioral questions";
    if (activeTab === "roadmap") return "Road Map";
    return "Technical questions";
  }, [activeTab]);

  const activeItems = QUESTIONS[activeTab];

  return (
    <main className="interview-page">
      <section className="interview-board">
        <aside className="interview-board__left">
          <button
            type="button"
            className={`topic-item ${activeTab === "technical" ? "is-active" : ""}`}
            onClick={() => setActiveTab("technical")}
          >
            Technical questions
          </button>
          <button
            type="button"
            className={`topic-item ${activeTab === "behavioral" ? "is-active" : ""}`}
            onClick={() => setActiveTab("behavioral")}
          >
            Behavioral questions
          </button>
          <button
            type="button"
            className={`topic-item ${activeTab === "roadmap" ? "is-active" : ""}`}
            onClick={() => setActiveTab("roadmap")}
          >
            Road Map
          </button>
        </aside>

        <section className="interview-board__center">
          <h2>{activeTitle}</h2>
          <ul>
            {activeItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <aside className="interview-board__right">
          <h3>Skill Gaps</h3>
          <div className="tag-list">
            {SKILL_GAPS.map((tag) => (
              <span key={tag} className="gap-tag">
                {tag}
              </span>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

export default Interview;
