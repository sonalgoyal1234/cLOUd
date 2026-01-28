import React, { useState, useEffect, useRef, useContext } from "react";
import Swal from "sweetalert2";
import { LangContext } from "../App";

export default function SmartReminders() {
  const { lang } = useContext(LangContext);

  /* ⭐ GET LOGGED USER */
  const user = JSON.parse(localStorage.getItem("lg_user") || "{}");
  const userKey = user?.email || "guest";

  /* ⭐ USER SPECIFIC STORAGE KEYS */
  const STORAGE_KEY = `smart_reminders_${userKey}`;
  const LAST_TRIGGER_KEY = `lg_last_trigger_${userKey}`;

  /* ================= LANGUAGE ================= */
  const t = {
    en: {
      title: "Smart Reminders & Alerts",
      subtitle: "Medicine • Check-ups • Alerts — stays even after reload 🎯",
      enableSound: "Enable Alarm Sound",
      soundOn: "Alarm Enabled",
      added: "Reminder saved",
      fill: "Fill all fields!",
      addedTitle: "Added!",
      deleteTitle: "Delete?",
      deleted: "Deleted!",
      lastTriggered: "Last Triggered",
      noReminders: "No reminders yet.",
      addBtn: "Add",
      reminderText: "Reminder text",
      deleteConfirm: "Delete this reminder?",
    },

    hi: {
      title: "स्मार्ट रिमाइंडर और अलर्ट",
      subtitle: "दवाई • चेकअप • अलर्ट — रीलोड के बाद भी सुरक्षित 🎯",
      enableSound: "अलार्म साउंड चालू करें",
      soundOn: "अलार्म सक्रिय",
      added: "रिमाइंडर सहेजा गया",
      fill: "सभी फ़ील्ड भरें!",
      addedTitle: "जोड़ा गया!",
      deleteTitle: "हटाएं?",
      deleted: "हटा दिया गया!",
      lastTriggered: "अंतिम रिमाइंडर",
      noReminders: "अभी कोई रिमाइंडर नहीं है।",
      addBtn: "जोड़ें",
      reminderText: "रिमाइंडर टेक्स्ट",
      deleteConfirm: "क्या आप यह रिमाइंडर हटाना चाहते हैं?",
    },
  };

  /* ================= STATES ================= */
  const [reminders, setReminders] = useState(
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  );
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [newReminder, setNewReminder] = useState({
    type: "Medicine",
    text: "",
    date: "",
    time: "",
  });

  const [lastTriggered, setLastTriggered] = useState(
    localStorage.getItem(LAST_TRIGGER_KEY) || null
  );

  const alarmRef = useRef(null);

  /* ================= INIT ================= */
  useEffect(() => {
    alarmRef.current = new Audio("/alarm.mp3");
    alarmRef.current.preload = "auto";
    alarmRef.current.volume = 1.0;
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/reminder-worker.js");
    }
  }, []);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  /* ================= SOUND ================= */
  const enableSound = () => {
    alarmRef.current
      ?.play()
      .then(() => {
        alarmRef.current.pause();
        alarmRef.current.currentTime = 0;
        setSoundEnabled(true);
        Swal.fire("🔊", t[lang].soundOn, "success");
      })
      .catch(() => Swal.fire("Retry", "Click again to enable", "warning"));
  };

  const playAlarm = (ms = 8000) => {
    alarmRef.current.currentTime = 0;
    alarmRef.current.play();
    setTimeout(() => {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
    }, ms);
  };

  /* ================= SAVE PER USER ================= */
  const saveReminders = (list) => {
    setReminders(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  /* ================= ADD REMINDER ================= */
  const addReminder = () => {
    if (!newReminder.text || !newReminder.date || !newReminder.time)
      return Swal.fire(t[lang].fill);

    const entry = { ...newReminder, id: Date.now(), notified: false };
    saveReminders([...reminders, entry]);

    Swal.fire(t[lang].addedTitle, t[lang].added, "success");

    setNewReminder({ type: "Medicine", text: "", date: "", time: "" });
  };

  /* ================= CHECK REMINDERS ================= */
  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      const d = now.toISOString().split("T")[0];
      const hhmm = now.toTimeString().slice(0, 5);

      reminders.forEach((r) => {
        if (r.date === d && r.time === hhmm && !r.notified) {
          if (soundEnabled) playAlarm();

          window.focus();
          alert(`${r.type}: ${r.text}`);

          if ("Notification" in window && Notification.permission === "granted") {
            navigator.serviceWorker.ready.then((reg) =>
              reg.showNotification(`⏰ ${r.type}`, {
                body: r.text,
                icon: "/icon-192.png",
              })
            );
          }

          const updated = reminders.map((x) =>
            x.id === r.id ? { ...x, notified: true } : x
          );

          saveReminders(updated);

          const stamp = new Date().toISOString();
          setLastTriggered(stamp);
          localStorage.setItem(LAST_TRIGGER_KEY, stamp);
        }
      });
    }, 1000);

    return () => clearInterval(id);
  }, [reminders, soundEnabled, lang]);

  /* ================= DELETE ================= */
  const deleteReminder = (id) =>
    Swal.fire({
      title: t[lang].deleteTitle,
      icon: "warning",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        saveReminders(reminders.filter((r) => r.id !== id));
        Swal.fire(t[lang].deleted, "", "success");
      }
    });

  /* ================= UI ================= */
  return (
    <div className="reminders-root">
    <div className="card">
      
      <h2>⏰ {t[lang].title}</h2>
      <p className="muted">{t[lang].subtitle}</p>

      <button className="btn" onClick={enableSound}>
        {soundEnabled ? "🔊 " + t[lang].soundOn : t[lang].enableSound}
      </button>

      <p className="small" style={{ marginTop: 6 }}>
        {t[lang].lastTriggered}:{" "}
        {lastTriggered ? new Date(lastTriggered).toLocaleString() : "—"}
      </p>

      {/* ADD */}
      <div className="card" style={{ marginTop: 12 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
            gap: 10,
          }}
        >
          <select
            value={newReminder.type}
            onChange={(e) =>
              setNewReminder({ ...newReminder, type: e.target.value })
            }
          >
            <option>{lang === "hi" ? "दवाई" : "Medicine"}</option>
            <option>{lang === "hi" ? "चेकअप" : "Check-up"}</option>
            <option>{lang === "hi" ? "टेस्ट" : "Test"}</option>
            <option>
              {lang === "hi" ? "महत्वपूर्ण अलर्ट" : "Critical Alert"}
            </option>
          </select>

          <input
            placeholder={t[lang].reminderText}
            value={newReminder.text}
            onChange={(e) =>
              setNewReminder({ ...newReminder, text: e.target.value })
            }
          />

          <input
            type="date"
            value={newReminder.date}
            onChange={(e) =>
              setNewReminder({ ...newReminder, date: e.target.value })
            }
          />

          <input
            type="time"
            value={newReminder.time}
            onChange={(e) =>
              setNewReminder({ ...newReminder, time: e.target.value })
            }
          />

          <button className="btn" onClick={addReminder}>
            ➕ {t[lang].addBtn}
          </button>
        </div>
      </div>

      {/* LIST */}
      {reminders.length === 0 ? (
        <p className="muted" style={{ marginTop: 10 }}>
          {t[lang].noReminders}
        </p>
      ) : (
        <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
          {reminders.map((r) => (
            <div className="card" key={r.id}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <b>{r.type}</b> — {r.text}
                  <div className="small">
                    📅 {r.date} — ⏰ {r.time}
                  </div>
                </div>

                <button
                  className="btn"
                  style={{ background: "#ef4444" }}
                  onClick={() => deleteReminder(r.id)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
      </div>
  );
}