import { useState, useEffect, useRef } from "react";

const DEFAULT_LISTS = [
  {
    name: "Text Search",
    emoji: "📝",
    items: ["Dragon Fruit", "Banana", "Apple", "Cherry", "Fig"],
  },
  {
    name: "Image Search",
    emoji: "🖼️",
    items: ["Apple", "Dragon Fruit", "Elderberry", "Banana", "Grape"],
  },
  {
    name: "Popularity",
    emoji: "🔥",
    items: ["Cherry", "Apple", "Grape", "Dragon Fruit", "Banana"],
  },
];

const K = 60;

function computeRRF(lists, k) {
  const scores = {};
  const contributions = {};

  lists.forEach((list, listIdx) => {
    list.items.forEach((item, rank) => {
      const score = 1 / (k + rank + 1);
      if (!scores[item]) {
        scores[item] = 0;
        contributions[item] = [];
      }
      scores[item] += score;
      contributions[item].push({ listIdx, rank, score });
    });
  });

  const sorted = Object.entries(scores)
    .map(([item, score]) => ({ item, score, contributions: contributions[item] }))
    .sort((a, b) => b.score - a.score);

  return sorted;
}

const COLORS = [
  { bg: "#FF6B6B", text: "#fff", light: "rgba(255,107,107,0.12)", mid: "rgba(255,107,107,0.35)" },
  { bg: "#4ECDC4", text: "#fff", light: "rgba(78,205,196,0.12)", mid: "rgba(78,205,196,0.35)" },
  { bg: "#FFB347", text: "#fff", light: "rgba(255,179,71,0.12)", mid: "rgba(255,179,71,0.35)" },
];

const FRUIT_COLORS = {
  "Apple": "#E74C3C",
  "Banana": "#F1C40F",
  "Cherry": "#C0392B",
  "Dragon Fruit": "#E91E8A",
  "Elderberry": "#6C3483",
  "Fig": "#8D6E63",
  "Grape": "#8E44AD",
};

function getFruitColor(name) {
  return FRUIT_COLORS[name] || "#607D8B";
}

function ItemPill({ name, highlighted, dimmed, onClick, small }) {
  const color = getFruitColor(name);
  return (
    <div
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: small ? "4px 10px" : "6px 14px",
        borderRadius: 8,
        background: highlighted ? color + "22" : dimmed ? "#1a1a2e" : "#16162a",
        border: `1.5px solid ${highlighted ? color : dimmed ? "#2a2a45" : "#2a2a50"}`,
        cursor: "pointer",
        transition: "all 0.25s ease",
        opacity: dimmed ? 0.35 : 1,
        transform: highlighted ? "scale(1.04)" : "scale(1)",
      }}
    >
      <span
        style={{
          width: small ? 8 : 10,
          height: small ? 8 : 10,
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: small ? 12 : 13,
          fontWeight: 600,
          color: highlighted ? "#f0f0f8" : "#a0a0c0",
          letterSpacing: "0.01em",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {name}
      </span>
    </div>
  );
}

function FormulaBar({ k }) {
  return (
    <div
      style={{
        background: "#12121f",
        border: "1px solid #2a2a50",
        borderRadius: 12,
        padding: "16px 24px",
        marginBottom: 28,
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontSize: 12, color: "#6a6a9a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
        RRF Formula
      </span>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 15,
          color: "#e0e0f8",
          background: "#0d0d1a",
          padding: "8px 16px",
          borderRadius: 8,
          border: "1px solid #2a2a50",
        }}
      >
        <span style={{ color: "#4ECDC4" }}>RRF</span>(d) = Σ{" "}
        <span style={{ color: "#FFB347" }}>1</span> /{" "}
        (<span style={{ color: "#FF6B6B" }}>k</span> +{" "}
        <span style={{ color: "#8B8BFF" }}>rank</span>(d))
      </div>
      <span style={{ fontSize: 12, color: "#5a5a8a" }}>
        where <span style={{ color: "#FF6B6B", fontFamily: "'JetBrains Mono', monospace" }}>k = {k}</span> (smoothing constant)
      </span>
    </div>
  );
}

export default function RRFVisualizer() {
  const [lists, setLists] = useState(DEFAULT_LISTS);
  const [selectedItem, setSelectedItem] = useState(null);
  const [step, setStep] = useState("all"); // "all" or index 0..n
  const [animatedScores, setAnimatedScores] = useState({});
  const merged = computeRRF(lists, K);
  const maxScore = merged.length > 0 ? merged[0].score : 1;

  useEffect(() => {
    const targets = {};
    merged.forEach((m) => {
      targets[m.item] = m.score;
    });
    // Animate scores
    const timeout = setTimeout(() => setAnimatedScores(targets), 50);
    return () => clearTimeout(timeout);
  }, [lists]);

  const allItems = [...new Set(lists.flatMap((l) => l.items))];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a18",
        color: "#e0e0f8",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        padding: "32px 24px",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 36,
              fontWeight: 800,
              margin: 0,
              background: "linear-gradient(135deg, #FF6B6B, #4ECDC4, #FFB347)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            Reciprocal Rank Fusion
          </h1>
          <p style={{ color: "#6a6a9a", fontSize: 14, margin: "8px 0 0", maxWidth: 600, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            RRF merges multiple ranked lists into one by scoring each item based on its position across all lists.
            Items ranked highly in multiple lists rise to the top. Click any item to trace its journey.
          </p>
        </div>

        <FormulaBar k={K} />

        {/* Step controls */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => setStep("all")}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              border: `1.5px solid ${step === "all" ? "#4ECDC4" : "#2a2a50"}`,
              background: step === "all" ? "#4ECDC422" : "transparent",
              color: step === "all" ? "#4ECDC4" : "#6a6a9a",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            All Lists
          </button>
          {lists.map((list, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              style={{
                padding: "6px 16px",
                borderRadius: 8,
                border: `1.5px solid ${step === i ? COLORS[i].bg : "#2a2a50"}`,
                background: step === i ? COLORS[i].bg + "22" : "transparent",
                color: step === i ? COLORS[i].bg : "#6a6a9a",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {list.emoji} {list.name}
            </button>
          ))}
        </div>

        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr minmax(280px, 1.2fr)",
            gap: 16,
          }}
        >
          {/* Ranked Lists */}
          {lists.map((list, listIdx) => {
            const isActive = step === "all" || step === listIdx;
            return (
              <div
                key={listIdx}
                style={{
                  background: "#0f0f20",
                  borderRadius: 14,
                  border: `1.5px solid ${isActive ? COLORS[listIdx].bg + "55" : "#1a1a35"}`,
                  padding: 16,
                  opacity: isActive ? 1 : 0.3,
                  transition: "all 0.35s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 18 }}>{list.emoji}</span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: COLORS[listIdx].bg,
                      fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {list.name}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {list.items.map((item, rank) => {
                    const score = 1 / (K + rank + 1);
                    const isHighlighted = selectedItem === item;
                    const isDimmed = selectedItem && selectedItem !== item;
                    return (
                      <div
                        key={item}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          transition: "all 0.25s",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 11,
                            color: "#4a4a7a",
                            width: 18,
                            textAlign: "right",
                            flexShrink: 0,
                          }}
                        >
                          #{rank + 1}
                        </span>
                        <div style={{ flex: 1 }}>
                          <ItemPill
                            name={item}
                            highlighted={isHighlighted}
                            dimmed={isDimmed}
                            small
                            onClick={() => setSelectedItem(selectedItem === item ? null : item)}
                          />
                        </div>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 11,
                            color: isHighlighted ? COLORS[listIdx].bg : "#3a3a6a",
                            fontWeight: isHighlighted ? 700 : 400,
                            flexShrink: 0,
                            transition: "all 0.25s",
                          }}
                        >
                          {score.toFixed(5)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Score explanation */}
                <div
                  style={{
                    marginTop: 12,
                    padding: "8px 10px",
                    background: "#0a0a16",
                    borderRadius: 8,
                    border: "1px solid #1a1a35",
                  }}
                >
                  <span style={{ fontSize: 10, color: "#4a4a7a", fontFamily: "'JetBrains Mono', monospace" }}>
                    Score = 1/({K} + rank)
                  </span>
                </div>
              </div>
            );
          })}

          {/* Fused Result */}
          <div
            style={{
              background: "linear-gradient(180deg, #12122a 0%, #0f0f20 100%)",
              borderRadius: 14,
              border: "1.5px solid #2a2a60",
              padding: 16,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Glow */}
            <div
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 120,
                height: 120,
                background: "radial-gradient(circle, rgba(78,205,196,0.08) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 18 }}>🏆</span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  background: "linear-gradient(90deg, #FF6B6B, #4ECDC4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.02em",
                }}
              >
                Fused Ranking
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {merged.map((entry, finalRank) => {
                const isHighlighted = selectedItem === entry.item;
                const isDimmed = selectedItem && selectedItem !== entry.item;
                const barWidth = (entry.score / maxScore) * 100;

                // Filter contributions based on step
                const visibleContributions =
                  step === "all"
                    ? entry.contributions
                    : entry.contributions.filter((c) => c.listIdx === step);

                const visibleScore = visibleContributions.reduce((s, c) => s + c.score, 0);

                return (
                  <div
                    key={entry.item}
                    style={{
                      opacity: isDimmed ? 0.25 : 1,
                      transition: "all 0.3s ease",
                      transform: isHighlighted ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 3,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 11,
                          color: finalRank === 0 ? "#FFD700" : "#4a4a7a",
                          width: 18,
                          textAlign: "right",
                          fontWeight: finalRank === 0 ? 800 : 400,
                        }}
                      >
                        #{finalRank + 1}
                      </span>
                      <ItemPill
                        name={entry.item}
                        highlighted={isHighlighted}
                        dimmed={isDimmed}
                        small
                        onClick={() => setSelectedItem(selectedItem === entry.item ? null : entry.item)}
                      />
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 11,
                          color: isHighlighted ? "#e0e0f8" : "#5a5a8a",
                          fontWeight: 600,
                          marginLeft: "auto",
                        }}
                      >
                        {entry.score.toFixed(5)}
                      </span>
                    </div>

                    {/* Score bar with segments */}
                    <div
                      style={{
                        marginLeft: 26,
                        height: 6,
                        background: "#1a1a35",
                        borderRadius: 3,
                        overflow: "hidden",
                        display: "flex",
                      }}
                    >
                      {entry.contributions
                        .sort((a, b) => a.listIdx - b.listIdx)
                        .map((c, ci) => {
                          const segWidth = (c.score / maxScore) * 100;
                          const isVisibleStep = step === "all" || step === c.listIdx;
                          return (
                            <div
                              key={ci}
                              style={{
                                width: `${segWidth}%`,
                                height: "100%",
                                background: COLORS[c.listIdx].bg,
                                opacity: isVisibleStep ? 0.85 : 0.1,
                                transition: "opacity 0.35s ease",
                              }}
                            />
                          );
                        })}
                    </div>

                    {/* Contribution details on hover / select */}
                    {isHighlighted && (
                      <div
                        style={{
                          marginLeft: 26,
                          marginTop: 6,
                          display: "flex",
                          gap: 4,
                          flexWrap: "wrap",
                        }}
                      >
                        {entry.contributions.map((c, ci) => (
                          <span
                            key={ci}
                            style={{
                              fontSize: 10,
                              fontFamily: "'JetBrains Mono', monospace",
                              padding: "2px 8px",
                              borderRadius: 4,
                              background: COLORS[c.listIdx].bg + "18",
                              color: COLORS[c.listIdx].bg,
                              border: `1px solid ${COLORS[c.listIdx].bg}33`,
                            }}
                          >
                            {lists[c.listIdx].emoji} rank {c.rank + 1} → {c.score.toFixed(5)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div
              style={{
                marginTop: 16,
                padding: "10px 12px",
                background: "#0a0a16",
                borderRadius: 8,
                border: "1px solid #1a1a35",
              }}
            >
              <div style={{ fontSize: 10, color: "#4a4a7a", marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Bar segments
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {lists.map((l, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[i].bg }} />
                    <span style={{ fontSize: 10, color: "#6a6a9a", fontFamily: "'JetBrains Mono', monospace" }}>
                      {l.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed calculation for selected item */}
        {selectedItem && (
          <div
            style={{
              marginTop: 24,
              background: "#0f0f20",
              borderRadius: 14,
              border: `1.5px solid ${getFruitColor(selectedItem)}44`,
              padding: 20,
              animation: "fadeIn 0.3s ease",
            }}
          >
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: getFruitColor(selectedItem),
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#e0e0f8",
                }}
              >
                How "{selectedItem}" gets its score
              </span>
            </div>

            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: "#a0a0c0",
                lineHeight: 2.2,
              }}
            >
              {(() => {
                const entry = merged.find((m) => m.item === selectedItem);
                if (!entry) return null;
                return (
                  <>
                    {entry.contributions.map((c, ci) => (
                      <div key={ci} style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ color: COLORS[c.listIdx].bg, fontWeight: 700 }}>
                          {lists[c.listIdx].emoji} {lists[c.listIdx].name}
                        </span>
                        <span style={{ color: "#5a5a8a" }}>→</span>
                        <span>
                          rank <span style={{ color: "#8B8BFF" }}>{c.rank + 1}</span>
                        </span>
                        <span style={{ color: "#5a5a8a" }}>→</span>
                        <span>
                          1/({K} + {c.rank + 1}) ={" "}
                          <span style={{ color: "#4ECDC4", fontWeight: 700 }}>{c.score.toFixed(5)}</span>
                        </span>
                      </div>
                    ))}
                    {/* Items NOT in certain lists */}
                    {lists.map((list, li) => {
                      const inList = entry.contributions.find((c) => c.listIdx === li);
                      if (inList) return null;
                      return (
                        <div key={li} style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.4 }}>
                          <span>{lists[li].emoji} {lists[li].name}</span>
                          <span style={{ color: "#5a5a8a" }}>→</span>
                          <span style={{ color: "#FF6B6B" }}>not ranked → 0</span>
                        </div>
                      );
                    })}
                    <div
                      style={{
                        marginTop: 8,
                        paddingTop: 8,
                        borderTop: "1px solid #2a2a50",
                        fontWeight: 700,
                        color: "#e0e0f8",
                      }}
                    >
                      Total RRF Score ={" "}
                      {entry.contributions.map((c, ci) => (
                        <span key={ci}>
                          {ci > 0 && <span style={{ color: "#5a5a8a" }}> + </span>}
                          <span style={{ color: COLORS[c.listIdx].bg }}>{c.score.toFixed(5)}</span>
                        </span>
                      ))}{" "}
                      = <span style={{ color: "#4ECDC4", fontSize: 15 }}>{entry.score.toFixed(5)}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* How it works */}
        <div
          style={{
            marginTop: 28,
            padding: "20px 24px",
            background: "#0f0f20",
            borderRadius: 14,
            border: "1px solid #1a1a35",
          }}
        >
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 18,
              fontWeight: 700,
              color: "#c0c0e0",
              margin: "0 0 10px",
            }}
          >
            How does RRF work?
          </h3>
          <div style={{ fontSize: 13, color: "#7a7aa0", lineHeight: 1.75, maxWidth: 800 }}>
            <p style={{ margin: "0 0 8px" }}>
              Each item gets a score of <code style={{ color: "#4ECDC4", background: "#0a0a18", padding: "1px 6px", borderRadius: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>1 / (k + rank)</code> from each list it appears in. The constant <strong style={{ color: "#FF6B6B" }}>k=60</strong> prevents top-ranked items from dominating too aggressively — it flattens the score distribution so that rank #1 vs #5 isn't a huge gap.
            </p>
            <p style={{ margin: "0 0 8px" }}>
              Scores from all lists are summed. Items appearing in <em>more</em> lists and at <em>higher</em> ranks accumulate the most points. The final ranking is simply a sort by total score.
            </p>
            <p style={{ margin: 0 }}>
              RRF is popular in search engines for combining results from different retrieval strategies (e.g., keyword search + vector search). It requires no training, no normalization, and works surprisingly well in practice.
            </p>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "#3a3a5a" }}>
          Click any item to see its full score breakdown · Use the filter buttons to isolate each list's contribution
        </div>
      </div>
    </div>
  );
}
