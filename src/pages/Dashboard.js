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

export default function Dashboard() {
  const { lang } = useContext(LangContext);

  const [points, setPoints] = useState(0);
  const [percent, setPercent] = useState(0);
  const [timeMessage, setTimeMessage] = useState("");

  const [userName, setUserName] = useState("User");

  const [challenge, setChallenge] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [walletData, setWalletData] = useState(null);

  /* =============== USER DATA =============== */
  const user = JSON.parse(localStorage.getItem("lg_user") || "{}");
  const userKey = user?.email || "guest";

  useEffect(() => {
  setUserName(user?.username || user?.name || "User");
}, []);

  /* ========= LOAD / RESET PROGRESS PER USER ========= */
  useEffect(() => {
    const today = new Date().toDateString();

    const saved = JSON.parse(
      localStorage.getItem(`lg_progress_${userKey}`) || "{}"
    );

    if (saved.date === today) {
      setPoints(saved.points || 0);
      setPercent(saved.percent || 0);
      setAccepted(saved.accepted || false);
      setCompleted(saved.completed || false);
      setChallenge(saved.challenge || null);
    } else {
      saveProgress({
        date: today,
        points: 0,
        percent: 0,
        accepted: false,
        completed: false,
        challenge: null,
      });

      setPoints(0);
      setPercent(0);
      setAccepted(false);
      setCompleted(false);
      setChallenge(null);
    }

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
  }, [lang, userKey]);

  /* ========= SAVE PER USER ========= */
  const saveProgress = (data) => {
    localStorage.setItem(`lg_progress_${userKey}`, JSON.stringify(data));
  };

  useEffect(() => {
    const today = new Date().toDateString();
    saveProgress({
      date: today,
      points,
      percent,
      accepted,
      completed,
      challenge,
    });
  }, [points, percent, accepted, completed, challenge, userKey]);

  /* ================= CONFETTI ================= */
  const shootConfetti = () => {
    const duration = 1600;
    const end = Date.now() + duration;

    const colors = [
      "#ff0a54",
      "#ff477e",
      "#ff85a1",
      "#fbb1bd",
      "#ffe066",
      "#70e000",
      "#4cc9f0",
      "#06b6d4",
    ];

    const shapes = ["■", "●", "▲", "★", "♥"];

    const frame = () => {
      for (let i = 0; i < 35; i++) {
        const confetti = document.createElement("div");
        confetti.style.position = "fixed";
        confetti.style.zIndex = "9999";
        confetti.style.fontSize = `${Math.random() * 20 + 14}px`;
        confetti.innerHTML =
          Math.random() < 0.3
            ? shapes[Math.floor(Math.random() * shapes.length)]
            : "";

        confetti.style.width = confetti.innerHTML ? "auto" : "8px";
        confetti.style.height = confetti.innerHTML ? "auto" : "12px";

        confetti.style.background =
          confetti.innerHTML === ""
            ? colors[Math.floor(Math.random() * colors.length)]
            : "transparent";

        confetti.style.color =
          colors[Math.floor(Math.random() * colors.length)];

        confetti.style.top = "-20px";
        confetti.style.left = Math.random() * window.innerWidth + "px";
        confetti.style.opacity = 1;

        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.transition =
          "transform 1.3s cubic-bezier(.15,.77,.37,1), top 1.3s ease-out, opacity 1.3s";

        document.body.appendChild(confetti);

        setTimeout(() => {
          const fallX = Math.random() * 200 - 100;
          confetti.style.top = window.innerHeight + "px";
          confetti.style.transform = `translateX(${fallX}px) rotate(${
            Math.random() * 720
          }deg)`;
          confetti.style.opacity = 0;
        }, 10);

        setTimeout(() => confetti.remove(), 1400);
      }

      if (Date.now() < end) requestAnimationFrame(frame);
    };

    frame();
  };

  /* ================= CHALLENGES ================= */
  const challenges =
    lang === "hi"
      ? [
          "8 गिलास पानी पिएं 💧",
          "5000 कदम चलें 🚶‍♀️",
          "10 मिनट ध्यान करें 🧘‍♂️",
          "7+ घंटे सोएं 😴",
          "2 फल खाएं 🍎",
        ]
      : [
          "Drink 8 glasses of water 💧",
          "Walk 5000 steps 🚶‍♀️",
          "Meditate 10 mins 🧘‍♂️",
          "Sleep 7+ hours 😴",
          "Eat 2 fruits 🍎",
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
    setPercent((p) => Math.min(p + 20, 100));
    setPoints((p) => p + 50);

    shootConfetti();
  };

  const circleStyle = {
    background: `conic-gradient(#06b6d4 ${percent * 3.6}deg, #dff9fb ${
      percent * 3.6
    }deg)`,
    transition: "0.4s ease-in-out",
  };

  const history = [
    { date: "Mon", score: 40 },
    { date: "Tue", score: 55 },
    { date: "Wed", score: 70 },
    { date: "Thu", score: 60 },
    { date: "Fri", score: 75 },
  ];

  useEffect(() => {
    const lastUpload = JSON.parse(
      localStorage.getItem(`lg_wallet_last_upload_${userKey}`)
    );
    setWalletData(lastUpload);
  }, []);

  const daysAgo = (dateStr) => {
    if (!dateStr) return "";
    const recordDate = new Date(dateStr);
    const today = new Date();
    const diff = Math.floor((today - recordDate) / 86400000);
    if (diff === 0) return lang === "hi" ? "आज" : "today";
    if (diff === 1) return lang === "hi" ? "1 दिन पहले" : "1 day ago";
    return lang === "hi" ? `${diff} दिन पहले` : `${diff} days ago`;
  };

  return (
    <div className="dashboard-root">
      {/* HEADER */}
      <div
        className="card"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
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

        <div className="progress-wrapper">
          <div className="progress-ring" style={circleStyle}>
            <div className="progress-center">
              <div style={{ fontWeight: 800 }}>{percent}%</div>
              <div className="small">{points} XP</div>
            </div>
          </div>

          <div className="tiny" style={{ textAlign: "center", marginTop: 8 }}>
            {completed
              ? lang === "hi"
                ? "बहुत बढ़िया 🎉"
                : "Great job 🎉"
              : lang === "hi"
              ? "चलो शुरुआत करें 💪"
              : "Let’s begin your journey 💪"}
          </div>
        </div>
      </div>

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
                  🎉{" "}
                  {lang === "hi"
                    ? "शानदार! आपने चैलेंज पूरा किया!"
                    : "Hurray! You completed today’s challenge!"}
                </p>
              )}
            </>
          )}
        </div>

        {/* HEALTH TIP */}
        <div className="card">
          <h4>💡 {lang === "hi" ? "हेल्थ टिप" : "Health Tip"}</h4>
          <p>
            {lang === "hi"
              ? "दिन में 8–10 गिलास पानी पिएं।"
              : "Drink 8–10 glasses of water daily."}
          </p>
        </div>

        {/* SUMMARY */}
        <div className="card">
          <h4>📊 {lang === "hi" ? "सारांश" : "Quick Summary"}</h4>
          <ul>
            <li>{lang === "hi" ? "फ्लू रिस्क — कम" : "Flu Risk — Low"}</li>
            <li>
              {lang === "hi" ? "विटामिन D — सुबह 8 बजे" : "Vitamin D — 8AM"}
            </li>
            <li>
              {lang === "hi" ? "पानी — 6/8 गिलास" : "Water — 6/8 glasses"}
            </li>
          </ul>
        </div>
      </div>

      {/* REMINDERS */}
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

        {/* WALLET */}
        <div className="card wallet-card">
          <h4>💼 {lang === "hi" ? "मेडिकल वॉलेट" : "Medical Wallet"}</h4>

          {walletData ? (
            <p className="small">
              {lang === "hi" ? "आखिरी अपलोड" : "Last upload"}:{" "}
              <b>{walletData.name}</b> — {daysAgo(walletData.date)}
            </p>
          ) : (
            <p className="small">
              {lang === "hi" ? "अभी तक कोई अपलोड नहीं" : "No uploads yet"}
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
    </div>
  );
}