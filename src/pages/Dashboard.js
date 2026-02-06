import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { LangContext } from "../App";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* 🎉 CONFETTI (ADDED) */
const shootConfetti = () => {
  const colors = ["#22c55e", "#84cc16", "#fde047", "#f97316"];
  for (let i = 0; i < 35; i++) {
    const el = document.createElement("div");
    el.style.position = "fixed";
    el.style.top = "-10px";
    el.style.left = Math.random() * window.innerWidth + "px";
    el.style.width = "8px";
    el.style.height = "8px";
    el.style.borderRadius = "50%";
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.zIndex = 9999;
    el.style.animation = "confettiFall 1.4s ease forwards";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }
};

export default function Dashboard() {
  const { lang } = useContext(LangContext);

  const [timeMessage, setTimeMessage] = useState("");
  const [userName, setUserName] = useState("User");

  const [challenge, setChallenge] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [walletData, setWalletData] = useState(null);

  /* 🌳 TREE STATE (UNCHANGED) */
  const [growthPoints, setGrowthPoints] = useState(
    Number(localStorage.getItem("lg_health_tree")) || 0
  );

  /* 🍎🍊🍇 FRUIT STATES (🍇 ADDED) */
  const [appleStage, setAppleStage] = useState("hidden");
  const [orangeStage, setOrangeStage] = useState("hidden");
  const [grapeStage, setGrapeStage] = useState("hidden");

  const [banner, setBanner] = useState(null);

  /* 🌲 FOREST MEMORY (ADDED) */
  const completedTrees = Math.floor(growthPoints / 26);

  /* ================= USER ================= */
  const user = JSON.parse(localStorage.getItem("lg_user") || "{}");
  const userKey = user?.email || "guest";

  useEffect(() => {
    setUserName(user?.username || user?.name || "User");
  }, []);

  /* ================= GREETING ================= */
  useEffect(() => {
    const hr = new Date().getHours();
    if (lang === "hi") {
      if (hr < 12) setTimeMessage("🌅 शुभ प्रभात");
      else if (hr < 18) setTimeMessage("🌞 शुभ दोपहर");
      else setTimeMessage("🌙 शुभ संध्या");
    } else {
      if (hr < 12) setTimeMessage("Good Morning ☀");
      else if (hr < 18) setTimeMessage("Good Afternoon 🌼");
      else setTimeMessage("Good Evening 🌙");
    }
  }, [lang]);

  /* ================= TREE + FRUIT LOGIC (EXTENDED ONLY) ================= */
  useEffect(() => {
    localStorage.setItem("lg_health_tree", growthPoints);

    // 🍎 Apple
    if (growthPoints >= 14 && growthPoints < 15) setAppleStage("small");
    if (growthPoints >= 15 && growthPoints < 17) setAppleStage("growing");
    if (growthPoints === 17) setAppleStage("ripe");
    if (growthPoints >= 18 && appleStage !== "fallen") {
      setAppleStage("fallen");
      shootConfetti();
      setBanner({
        emoji: "🍎",
        title: "Hydration Habit Completed",
        text: `You completed ${growthPoints} health challenges. This apple fell because a real hydration habit was formed.`,
      });
    }

    // 🍊 Orange (after apple)
    if (appleStage === "fallen") {
      if (growthPoints >= 22 && growthPoints < 23) setOrangeStage("small");
      if (growthPoints >= 23 && growthPoints < 25) setOrangeStage("growing");
      if (growthPoints === 25) setOrangeStage("ripe");
      if (growthPoints >= 26 && orangeStage !== "fallen") {
        setOrangeStage("fallen");
        shootConfetti();
        setBanner({
          emoji: "🍊",
          title: "Consistency Habit Completed",
          text: `You reached ${growthPoints} challenges. This fruit represents long-term health consistency.`,
        });
      }
    }

    // 🍇 Grape (NEW — Symptom Awareness)
    if (orangeStage === "fallen") {
      if (growthPoints >= 30 && growthPoints < 31) setGrapeStage("small");
      if (growthPoints >= 31 && growthPoints < 33) setGrapeStage("growing");
      if (growthPoints === 33) setGrapeStage("ripe");
      if (growthPoints >= 34 && grapeStage !== "fallen") {
        setGrapeStage("fallen");
        shootConfetti();
        setBanner({
          emoji: "🍇",
          title: "Symptom Awareness Habit",
          text:
            "You consistently tracked symptoms early. Early detection improves diagnosis accuracy and treatment success.",
        });
      }
    }
  }, [growthPoints, appleStage, orangeStage, grapeStage]);

  const getTreeEmoji = () => {
    if (growthPoints === 0) return "🌰";
    if (growthPoints <= 3) return "🌱";
    if (growthPoints <= 7) return "🌿";
    return "🌳";
  };

  const getTreeStage = () => {
    if (growthPoints <= 3) return "Sprout";
    if (growthPoints <= 7) return "Plant";
    if (growthPoints <= 13) return "Tree";
    return "Mature Tree";
  };

  /* ================= CHALLENGES (UNCHANGED) ================= */
  const challenges =
    lang === "hi"
      ? [
          "8 गिलास पानी पिएं 💧",
          "5000 कदम चलें 🚶‍♀️",
          "10 मिनट ध्यान करें 🧘‍♂️",
          "7+ घंटे सोएं 😴",
        ]
      : [
          "Drink 8 glasses of water 💧",
          "Walk 5000 steps 🚶‍♀️",
          "Meditate 10 mins 🧘‍♂️",
          "Sleep 7+ hours 😴",
        ];

  const acceptChallenge = () => {
    const random = challenges[Math.floor(Math.random() * challenges.length)];
    setChallenge(random);
    setAccepted(true);
    setCompleted(false);
  };

  const completeChallenge = () => {
    if (!accepted || completed) return;
    setCompleted(true);
    setGrowthPoints((prev) => prev + 1);
  };

  /* ================= WALLET (UNCHANGED) ================= */
  useEffect(() => {
    const lastUpload = JSON.parse(
      localStorage.getItem(`lg_wallet_last_upload_${userKey}`)
    );
    setWalletData(lastUpload);
  }, []);

  const history = [
    { date: "Mon", score: 40 },
    { date: "Tue", score: 55 },
    { date: "Wed", score: 70 },
    { date: "Thu", score: 60 },
    { date: "Fri", score: 75 },
  ];

  return (
    <div className="dashboard-root">

      {/* 🌲 FOREST MEMORY (ADDED, NON-INTRUSIVE) */}
      <div style={{ opacity: 0.12, fontSize: "1.8rem" }}>
        {"🌳".repeat(completedTrees)}
      </div>

      {/* ================= HEADER ================= */}
      <div className="card" style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h2>{timeMessage}</h2>
          <h3>
            {lang === "hi" ? `नमस्ते, ${userName} 👋` : `Hi, ${userName} 👋`}
          </h3>
          <p style={{ color: "#036672" }}>
            {lang === "hi"
              ? "यह रहा आपका स्वास्थ्य सारांश"
              : "Here's your health summary."}
          </p>
        </div>

        {/* 🌳 TREE + FRUITS */}
        <div style={{ position: "relative", fontSize: "3.8rem" }}>
          {getTreeEmoji()}

          {appleStage !== "hidden" && appleStage !== "fallen" && <span>🍎</span>}
          {orangeStage !== "hidden" && orangeStage !== "fallen" && <span>🍊</span>}
          {grapeStage !== "hidden" && grapeStage !== "fallen" && <span>🍇</span>}

          <div className="tree-info">
            <div className="tree-stage">
              {lang === "hi" ? "स्तर" : "Stage"}: <b>{getTreeStage()}</b>
            </div>
            <div className="tree-desc">
              {lang === "hi"
                ? "सेहत धीरे-धीरे बनती है"
                : "Health grows gradually"}
            </div>
          </div>
        </div>
      </div>

      {/* 🍓 BANNER (UNCHANGED STRUCTURE) */}
      {banner && (
        <div
          className="card"
          style={{
            marginTop: 16,
            background: "linear-gradient(135deg,#fff7ed,#ffedd5)",
            borderLeft: "6px solid #fb923c",
          }}
        >
          <h3>
            {banner.emoji} {banner.title}
          </h3>
          <p>{banner.text}</p>
          <button className="btn-small" onClick={() => setBanner(null)}>
            Continue 🌱
          </button>
        </div>
      )}

      {/* ================= EVERYTHING BELOW IS IDENTICAL ================= */}

      {/* DAILY CHALLENGE */}
      <div className="top-grid" style={{ marginTop: 25 }}>
        <div className="card">
          <h4>💪 {lang === "hi" ? "डेली चैलेंज" : "Daily Challenge"}</h4>
          {!accepted ? (
            <>
              <p>
                {lang === "hi"
                  ? "आज का चैलेंज प्राप्त करें"
                  : "Click to get today’s challenge"}
              </p>
              <button className="btn" onClick={acceptChallenge}>
                🎯 {lang === "hi" ? "आज का चैलेंज" : "Get Today’s Challenge"}
              </button>
            </>
          ) : (
            <>
              <p style={{ fontWeight: 700 }}>{challenge}</p>
              {!completed ? (
                <button className="btn" onClick={completeChallenge}>
                  ✅ {lang === "hi" ? "पूरा किया" : "Mark as Completed"}
                </button>
              ) : (
                <p style={{ color: "green", fontWeight: 700 }}>
                  🎉 {lang === "hi" ? "आज का चैलेंज पूरा!" : "Challenge completed!"}
                </p>
              )}
            </>
          )}
        </div>

        <div className="card">
          <h4>💡 {lang === "hi" ? "हेल्थ टिप" : "Health Tip"}</h4>
          <p>
            {lang === "hi"
              ? "दिन में 8–10 गिलास पानी पिएं।"
              : "Drink 8–10 glasses of water daily."}
          </p>
        </div>

        <div className="card">
          <h4>📊 {lang === "hi" ? "सारांश" : "Quick Summary"}</h4>
          <ul>
            <li>{lang === "hi" ? "फ्लू रिस्क — कम" : "Flu Risk — Low"}</li>
            <li>{lang === "hi" ? "विटामिन D — सुबह 8 बजे" : "Vitamin D — 8AM"}</li>
            <li>{lang === "hi" ? "पानी — 6/8 गिलास" : "Water — 6/8 glasses"}</li>
          </ul>
        </div>
      </div>

      {/* REMINDERS + WALLET */}
      <div className="bottom-grid" style={{ marginTop: 25 }}>
        <div className="card reminder-card">
          <h4>⏰ {lang === "hi" ? "रिमाइंडर" : "Smart Reminders"}</h4>
          <p>
            {lang === "hi" ? "अगला रिमाइंडर" : "Next reminder"}:{" "}
            <b>
              {lang === "hi"
                ? "ब्लड प्रेशर — शाम 7 बजे"
                : "Blood Pressure — 7PM"}
            </b>
          </p>
          <Link to="./reminders" className="btn-small">
            {lang === "hi" ? "रिमाइंडर देखें" : "Manage Reminders"}
          </Link>
        </div>

        <div className="card wallet-card">
          <h4>💼 {lang === "hi" ? "मेडिकल वॉलेट" : "Medical Wallet"}</h4>

          {walletData ? (
            <p className="small">
              {lang === "hi" ? "आखिरी अपलोड" : "Last upload"}:{" "}
              <b>{walletData.name}</b>
            </p>
          ) : (
            <p className="small">
              {lang === "hi" ? "कोई रिकॉर्ड नहीं" : "No uploads yet"}
            </p>
          )}

          <Link to="./wallet" className="btn-small">
            {lang === "hi" ? "वॉलेट खोलें" : "Open Wallet"}
          </Link>
        </div>
      </div>

      {/* GRAPH */}
      <div className="card" style={{ marginTop: 25 }}>
        <h3>📈 {lang === "hi" ? "हेल्थ ट्रेंड" : "Health Trend"}</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={history}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#06b6d4"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* CONFETTI STYLE */}
      <style>{`
        @keyframes confettiFall {
          to { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
