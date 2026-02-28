import { useState } from "react"
import ClientLayout from "@/components/client/layout/ClientLayout"
import { Spinner } from "@/components/common/Spinner"
import { useAIPlan, useGenerateAIPlan } from "@/hooks/client/AIplan/useAIPlan"

const DAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

const DAY_COLORS = {
  monday: "#4F8EF7",
  tuesday: "#A78BFA",
  wednesday: "#34D399",
  thursday: "#FB923C",
  friday: "#F472B6",
  saturday: "#FBBF24",
  sunday: "#94A3B8",
}

const MEAL_ICONS = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
  snacks: "🥜",
}

const MEAL_ORDER = ["breakfast", "lunch", "dinner", "snacks"]

function DietModal({ planData, onClose }) {
  const diet = planData?.diet_plan || {}

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div>
            <span style={styles.modalBadge}>🥗 Nutrition</span>
            <h2 style={styles.modalTitle}>Diet Plan</h2>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.modalBody}>
          <div style={styles.dietGrid}>
            {MEAL_ORDER.filter(m => diet[m]).map((meal) => (
              <div key={meal} style={styles.mealCard}>
                <div style={styles.mealIcon}>{MEAL_ICONS[meal] || "🍽️"}</div>
                <div>
                  <div style={styles.mealLabel}>{meal.charAt(0).toUpperCase() + meal.slice(1)}</div>
                  <div style={styles.mealText}>{diet[meal]}</div>
                </div>
              </div>
            ))}
            {/* Render any extra keys not in MEAL_ORDER */}
            {Object.keys(diet).filter(k => !MEAL_ORDER.includes(k)).map(key => (
              <div key={key} style={styles.mealCard}>
                <div style={styles.mealIcon}>🍽️</div>
                <div>
                  <div style={styles.mealLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                  <div style={styles.mealText}>{diet[key]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function WorkoutModal({ planData, onClose }) {
  const workout = planData?.workout_plan || {}
  const [activeDay, setActiveDay] = useState(
    DAY_ORDER.find(d => workout[d]) || Object.keys(workout)[0] || null
  )

  const sortedDays = DAY_ORDER.filter(d => workout[d])
  const extraDays = Object.keys(workout).filter(d => !DAY_ORDER.includes(d))
  const allDays = [...sortedDays, ...extraDays]

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={{ ...styles.modal, maxWidth: 760 }} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div>
            <span style={styles.modalBadge}>💪 Training</span>
            <h2 style={styles.modalTitle}>Workout Plan</h2>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.modalBody}>
          {/* Day tabs */}
          <div style={styles.dayTabs}>
            {allDays.map(day => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                style={{
                  ...styles.dayTab,
                  ...(activeDay === day ? {
                    background: DAY_COLORS[day] || "#4F8EF7",
                    color: "#fff",
                    borderColor: DAY_COLORS[day] || "#4F8EF7",
                  } : {}),
                }}
              >
                {day.slice(0, 3).toUpperCase()}
              </button>
            ))}
          </div>

          {/* Active day exercises */}
          {activeDay && workout[activeDay] && (
            <div style={styles.exerciseList}>
              <div style={styles.dayHeading}>
                <span style={{
                  ...styles.dayDot,
                  background: DAY_COLORS[activeDay] || "#4F8EF7"
                }} />
                {activeDay.charAt(0).toUpperCase() + activeDay.slice(1)}
              </div>
              {workout[activeDay].map((exercise, idx) => (
                <div key={idx} style={styles.exerciseCard}>
                  <div style={{
                    ...styles.exerciseNum,
                    background: DAY_COLORS[activeDay] || "#4F8EF7",
                  }}>
                    {idx + 1}
                  </div>
                  <div style={styles.exerciseText}>{exercise}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AIPlanPage() {
  const { data: plan, isLoading, isError, error } = useAIPlan()
  const { mutate: generatePlan, isPending } = useGenerateAIPlan()
  const [selectedType, setSelectedType] = useState(null)

  const planData = plan?.plan_data

  return (
    <ClientLayout>
      <div style={styles.page}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
          * { box-sizing: border-box; }
          .plan-card { transition: box-shadow 0.2s, transform 0.2s; }
          .plan-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.10) !important; transform: translateY(-3px); }
          .gen-btn:hover { opacity: 0.88; transform: translateY(-1px); }
          .regen-btn:hover { background: #e8f5e9 !important; }
          .close-btn:hover { color: #111 !important; background: #f1f5f9 !important; }
          .day-tab { transition: all 0.15s; }
          .day-tab:hover { opacity: 0.85; }
        `}</style>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <p style={styles.headerLabel}>Personalized for you</p>
            <h1 style={styles.headerTitle}>AI Plans</h1>
          </div>
          {!isLoading && plan && (
            <button
              onClick={() => generatePlan()}
              disabled={isPending}
              className="regen-btn"
              style={styles.regenBtn}
            >
              {isPending ? "Updating…" : "↺ Regenerate"}
            </button>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div style={styles.center}>
            <Spinner />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div style={styles.errorBox}>
            ⚠️ {error.message}
          </div>
        )}

        {/* No Plan */}
        {!isLoading && !plan && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🤖</div>
            <h2 style={styles.emptyTitle}>No plan generated yet</h2>
            <p style={styles.emptyDesc}>
              Let AI create a personalized diet and workout plan just for you.
            </p>
            <button
              onClick={() => generatePlan()}
              disabled={isPending}
              className="gen-btn"
              style={styles.generateBtn}
            >
              {isPending ? "Generating…" : "Generate My Plan"}
            </button>
          </div>
        )}

        {/* Plans Grid */}
        {!isLoading && plan && planData && (
          <div style={styles.cardsGrid}>
            {/* Diet Card */}
            <div
              onClick={() => setSelectedType("diet")}
              className="plan-card"
              style={{ ...styles.card, borderTop: "4px solid #34D399" }}
            >
              <div style={styles.cardIcon}>🥗</div>
              <div style={styles.cardTag} >Nutrition</div>
              <h2 style={styles.cardTitle}>Diet Plan</h2>
              <p style={styles.cardDesc}>
                Personalized meal recommendations for breakfast, lunch, dinner & snacks.
              </p>
              <div style={styles.cardAction}>View Details →</div>
            </div>

            {/* Workout Card */}
            <div
              onClick={() => setSelectedType("workout")}
              className="plan-card"
              style={{ ...styles.card, borderTop: "4px solid #4F8EF7" }}
            >
              <div style={styles.cardIcon}>💪</div>
              <div style={styles.cardTag}>Training</div>
              <h2 style={styles.cardTitle}>Workout Plan</h2>
              <p style={styles.cardDesc}>
                A full week of targeted exercises tailored to your fitness goals.
              </p>
              <div style={styles.cardAction}>View Details →</div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedType === "diet" && (
        <DietModal planData={planData} onClose={() => setSelectedType(null)} />
      )}
      {selectedType === "workout" && (
        <WorkoutModal planData={planData} onClose={() => setSelectedType(null)} />
      )}
    </ClientLayout>
  )
}

const styles = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    padding: "40px 24px",
    maxWidth: 900,
    margin: "0 auto",
    minHeight: "100vh",
    background: "#f8fafc",
  },
  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  headerLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#94a3b8",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 36,
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
  },
  regenBtn: {
    background: "#fff",
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    padding: "60px 0",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    borderRadius: 12,
    padding: "16px 20px",
    fontSize: 14,
    fontWeight: 500,
  },
  emptyState: {
    background: "#fff",
    borderRadius: 20,
    padding: "60px 40px",
    textAlign: "center",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 24,
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: 8,
  },
  emptyDesc: {
    color: "#64748b",
    fontSize: 15,
    marginBottom: 28,
    maxWidth: 340,
    margin: "0 auto 28px",
  },
  generateBtn: {
    background: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "14px 32px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "32px 28px",
    cursor: "pointer",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  cardIcon: {
    fontSize: 36,
    marginBottom: 14,
  },
  cardTag: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#64748b",
    background: "#f1f5f9",
    borderRadius: 6,
    padding: "3px 8px",
    marginBottom: 10,
  },
  cardTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 22,
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 10px",
  },
  cardDesc: {
    color: "#64748b",
    fontSize: 14,
    lineHeight: 1.6,
    marginBottom: 24,
  },
  cardAction: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0f172a",
  },

  // Modal
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.45)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    padding: 20,
  },
  modal: {
    background: "#fff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 640,
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
    overflow: "hidden",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "28px 28px 20px",
    borderBottom: "1px solid #f1f5f9",
    flexShrink: 0,
  },
  modalBadge: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: "#64748b",
    display: "block",
    marginBottom: 4,
  },
  modalTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 26,
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    fontSize: 18,
    color: "#94a3b8",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: 8,
    lineHeight: 1,
    transition: "all 0.15s",
  },
  modalBody: {
    padding: "24px 28px 28px",
    overflowY: "auto",
    flex: 1,
  },

  // Diet
  dietGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  mealCard: {
    display: "flex",
    gap: 16,
    background: "#f8fafc",
    borderRadius: 14,
    padding: "18px 20px",
    alignItems: "flex-start",
    border: "1px solid #f1f5f9",
  },
  mealIcon: {
    fontSize: 28,
    flexShrink: 0,
    marginTop: 2,
  },
  mealLabel: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: "#94a3b8",
    marginBottom: 5,
  },
  mealText: {
    fontSize: 15,
    color: "#1e293b",
    lineHeight: 1.6,
  },

  // Workout
  dayTabs: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 24,
  },
  dayTab: {
    border: "1.5px solid #e2e8f0",
    background: "#fff",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.05em",
    cursor: "pointer",
    color: "#475569",
  },
  exerciseList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  dayHeading: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontFamily: "'Syne', sans-serif",
    fontSize: 18,
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: 4,
  },
  dayDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    display: "inline-block",
    flexShrink: 0,
  },
  exerciseCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "#f8fafc",
    borderRadius: 12,
    padding: "14px 16px",
    border: "1px solid #f1f5f9",
  },
  exerciseNum: {
    width: 28,
    height: 28,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
    flexShrink: 0,
  },
  exerciseText: {
    fontSize: 14,
    color: "#1e293b",
    lineHeight: 1.5,
    fontWeight: 500,
  },
}