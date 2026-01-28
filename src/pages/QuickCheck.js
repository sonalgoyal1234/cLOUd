import React, { useRef, useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { LangContext } from "../App";
import "./ui-effects.css";
import { FaHeartbeat } from "react-icons/fa";
import { motion } from "framer-motion";

const HOSPITALS = [
  {
    name: "Emergency Ambulance",
    type: "Government",
    phone: "108", // 🚑 National Emergency Ambulance
  },
  {
    name: "Women Emergency Helpline",
    type: "Government",
    phone: "181",
  },
  {
    name: "Health Ministry Helpline",
    type: "Government",
    phone: "1075",
  },
];



export default function QuickCheck() {
  const { lang } = useContext(LangContext);   // ⭐ Language Context

  /* ========= CURRENT USER ========= */
  const user = JSON.parse(localStorage.getItem("lg_user") || "{}");
  const userEmail = user?.email || "guest";

  const STORAGE_KEY = `lg_quickcheck_${userEmail}`;

  const [symptom, setSymptom] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDoctors, setShowDoctors] = useState(false);
  const [userLocation, setUserLocation] = useState(null);



  const [savedResults, setSavedResults] = useState(
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  );
  const [showSaved, setShowSaved] = useState(false);

  const recognitionRef = useRef(null);

  /* ================== LANGUAGE STRINGS ================== */
  const text = {
    en: {
      title: "Quick Health Check",
      subtitle: "Type or speak your symptoms below",
      placeholder: "Example: Fever, headache, cough...",
      analyzeBtn: "Analyze",
      speakBtn: "Speak",
      stopBtn: "Stop Listening",
      saveBtn: "Save",
      viewBtn: "View Saved",
      analyzing: "Analyzing symptoms…",
      predicted: "Predicted Diseases",
      savedTitle: "Saved Results",
      noSaved: "No saved records",
      clearAsk: "Clear saved results?",
      clear: "Clear",
      listeningPopup: "Listening… Speak slowly & clearly",
      blockedMic: "Microphone permission blocked",
      enterFirst: "Enter or speak symptoms",
      savedDone: "Saved",
      analyzeFirst: "Analyze first",
      noMatch: "⚕️ No clear match — try adding more symptoms",
    },

    hi: {
      title: "त्वरित स्वास्थ्य जांच",
      subtitle: "नीचे अपने लक्षण टाइप करें या बोलें",
      placeholder: "उदाहरण: बुखार, सिर दर्द, खांसी...",
      analyzeBtn: "जांचें",
      speakBtn: "बोलें",
      stopBtn: "सुनना बंद",
      saveBtn: "सहेजें",
      viewBtn: "सहेजे गए देखें",
      analyzing: "लक्षणों का विश्लेषण हो रहा है…",
      predicted: "संभावित बीमारियाँ",
      savedTitle: "सहेजे गए परिणाम",
      noSaved: "अभी तक कोई रिकॉर्ड नहीं",
      clearAsk: "सहेजे गए परिणाम साफ करें?",
      clear: "साफ करें",
      listeningPopup: "सुन रहा हूँ… धीरे और साफ बोलें",
      blockedMic: "माइक अनुमति ब्लॉक",
      enterFirst: "कृपया लक्षण दर्ज करें",
      savedDone: "सहेजा गया",
      analyzeFirst: "पहले जांच करें",
      noMatch: "⚕️ स्पष्ट मिलान नहीं — और लक्षण जोड़ें",
    },
  };

  /* ================== DISEASE DATABASE ================== */
  const diseaseDB = [
  {
    disease: "Dengue",
    symptoms: {
      fever: 3,
      headache: 2,
      "joint pain": 3,
      rash: 3,
      nausea: 1,
      vomiting: 1
    }
  },
  {
    disease: "Malaria",
    symptoms: {
      fever: 3,
      chills: 3,
      sweating: 2,
      shivering: 2,
      headache: 1
    }
  },
  {
    disease: "Typhoid",
    symptoms: {
      fever: 3,
      fatigue: 2,
      headache: 1,
      "abdominal pain": 2
    }
  },
  {
    disease: "Flu (Influenza)",
    symptoms: {
      fever: 2,
      cough: 2,
      fatigue: 2,
      "body ache": 2,
      chills: 1
    }
  },
  {
    disease: "Common Cold",
    symptoms: {
      cold: 2,
      cough: 1,
      "runny nose": 2,
      sore: 1
    }
  },
  {
    disease: "Heart Problem",
    symptoms: {
      "chest pain": 4,
      "shortness of breath": 4,
      dizziness: 2,
      fatigue: 1
    }
  }
];
const adviceMap = {
  Dengue: {
    risk: "High",
    advice: "Drink plenty of fluids. Avoid painkillers like ibuprofen.",
    consult: "If fever lasts more than 2 days or platelets drop.",
  },

  Malaria: {
    risk: "High",
    advice: "Do not delay treatment. Blood test recommended.",
    consult: "Immediately visit a hospital.",
  },

  "Typhoid": {
    risk: "Medium",
    advice: "Rest, hydrate well, avoid outside food.",
    consult: "If fever persists beyond 3 days.",
  },

  "Flu (Influenza)": {
    risk: "Medium",
    advice: "Rest, fluids, and paracetamol if needed.",
    consult: "If breathing issues occur.",
  },

  "Common Cold": {
    risk: "Low",
    advice: "Steam inhalation, rest, warm fluids.",
    consult: "Usually not required.",
  },

  "Heart Problem": {
    risk: "Critical",
    advice: "Do NOT ignore chest pain.",
    consult: "Call emergency services immediately.",
  },
};
const HIGH_RISK_DISEASES = [
  "Dengue",
  "Heart Problem",
  "Malaria",
  "COVID-19"
];






  const analyzeSymptom = (input) => {
  const textInput = input.toLowerCase();
  let results = [];

  diseaseDB.forEach(disease => {
    let score = 0;
    let maxScore = 0;

    Object.entries(disease.symptoms).forEach(([symptom, weight]) => {
      maxScore += weight;
      if (textInput.includes(symptom)) {
        score += weight;
      }
    });

    if (score > 0) {
      const confidence = Math.min(
        Math.round((score / maxScore) * 100),
        98
      );

      results.push({
        name: disease.disease,
        confidence
      });
    }
  });

  if (results.length === 0) {
    return [
      { name: "No clear match — add more symptoms", confidence: 60 }
    ];
  }

  return results
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);
};

  /* ================== VOICE INPUT ================== */
  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      Swal.fire("⚠️ Browser does not support voice input");
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = lang === "hi" ? "hi-IN" : "en-IN";
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      let finalTranscript = "";

      recognitionRef.current.onstart = () => {
        setListening(true);
        Swal.fire(text[lang].listeningPopup);
      };

      recognitionRef.current.onerror = (e) => {
        setListening(false);
        if (e.error === "not-allowed")
          Swal.fire(text[lang].blockedMic);
      };

      recognitionRef.current.onresult = (event) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const txt = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalTranscript += txt + " ";
          else interim += txt + " ";
        }
        setSymptom((finalTranscript + interim).trim());
      };

      recognitionRef.current.onend = () => {
        if (listening) recognitionRef.current.start();
      };
    }

    if (!listening) recognitionRef.current.start();
    else recognitionRef.current.stop();

    setListening(!listening);
  };

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  /* ================== ANALYZE ================== */
const handleAnalyze = () => {
  if (!symptom.trim()) {
    Swal.fire("Please enter or speak symptoms");
    return;
  }

  setLoading(true);

  setTimeout(() => {
    const result = analyzeSymptom(symptom);
    setPredictions(result);
    setLoading(false);

    // 🚨 EMERGENCY ALERT
    if (
      HIGH_RISK_DISEASES.includes(result[0].name) &&
      result[0].confidence >= 70
    ) {
      Swal.fire({
        icon: "warning",
        title: "🚨 Medical Attention Needed",
        html: `
          <b>Possible:</b> ${result[0].name}<br/><br/>
          This condition may be serious.<br/>
          Please consult a doctor immediately.
        `,
        confirmButtonText: "Find Help",
      });
    }
  }, 700);
};
const detectLocation = () => {
  if (!navigator.geolocation) {
    Swal.fire("Location not supported by this browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      setUserLocation({ latitude, longitude });

      window.open(
        `https://www.google.com/maps/search/hospitals/@${latitude},${longitude},15z`,
        "_blank"
      );
    },
    () => {
      Swal.fire("Location access denied");
    }
  );
};






  /* ================== SAVE ================== */
  const saveResult = () => {
    if (!predictions.length) return Swal.fire(text[lang].analyzeFirst);

    const entry = { symptom, predictions, date: new Date().toLocaleString() };
    const data = [...savedResults, entry];

    setSavedResults(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    Swal.fire(text[lang].savedDone);
  };

  const clearResults = () => {
    Swal.fire({
      title: text[lang].clearAsk,
      icon: "warning",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.removeItem(STORAGE_KEY);
        setSavedResults([]);
      }
    });
  };

  /* ================== UI ================== */
  /* ================== UI ================== */
return (
  <div
    className="quickcheck-root"
    style={{
      minHeight: "100vh",
      padding: "40px",
     background: `
  linear-gradient(
     rgba(255,255,255,0.82),
      rgba(255,255,255,0.88)
  ),
  url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwH2UE5_rw0-fJ8K6Y3-ClQOhHz-3--3kLgg&s")
`,

      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
    }}
  >
    <div className="glass-card card">
      <h2>
        🩺 {text[lang].title}
      </h2>

      <p className="muted">{text[lang].subtitle}</p>

      <textarea
        className="quick-input"
        rows="4"
        value={symptom}
        onChange={(e) => setSymptom(e.target.value)}
        placeholder={text[lang].placeholder}
      />

      <div
        style={{
          marginTop: 12,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <button className="btn" onClick={handleAnalyze}>
          🔍 {text[lang].analyzeBtn}
        </button>

        <button className="btn" onClick={startVoiceInput}>
          {listening
            ? `🛑 ${text[lang].stopBtn}`
            : `🎤 ${text[lang].speakBtn}`}
        </button>

        <button className="btn" onClick={saveResult}>
          💾 {text[lang].saveBtn}
        </button>

        <button className="btn" onClick={() => setShowSaved(true)}>
          📜 {text[lang].viewBtn}
        </button>
      </div>
      {showDoctors && (
  <div
    onClick={() => setShowDoctors(false)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 300,
    }}
  >
    <div
      className="card"
      style={{ width: "90%", maxWidth: 500 }}
      onClick={(e) => e.stopPropagation()}
    >
      <h3>🏥 Nearby Medical Help</h3>
      <p
  className="muted"
  style={{ fontSize: 12, marginBottom: 12 }}
>
  Hospital details are fetched via Google Maps to ensure real-time accuracy.
</p>


      {HOSPITALS.map((h, i) => (
        <div key={i} className="pred-item">
          <b>{h.name}</b>
          <div className="muted">{h.type}</div>

          <a
  href="https://www.google.com/maps/search/hospital+near+me"
  target="_blank"
  rel="noopener noreferrer"
  className="btn"
  style={{ marginTop: 6 }}
>
  🗺️ Find Nearby Hospitals
</a>

        </div>
      ))}
    </div>
  </div>
)}


      {/* ===== ANALYZING ===== */}
      {loading && (
        <motion.div
          className="card"
          style={{ marginTop: 20 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {text[lang].analyzing}
        </motion.div>
      )}

      {/* ===== PREDICTIONS ===== */}
      {/* ===== PREDICTIONS ===== */}
{!loading && predictions.length > 0 && (
  <motion.div
    className="card"
    style={{ marginTop: 15 }}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
  >
    <h3>🧠 {text[lang].predicted}</h3>

    {predictions.map((p, i) => {
      const advice = adviceMap[p.name];

      return (
        <div key={i} className="pred-item">
          {HIGH_RISK_DISEASES.includes(p.name) && p.confidence >= 70 && (
            <div
              style={{
                marginBottom: 6,
                padding: "6px 10px",
                background: "#fee2e2",
                color: "#b91c1c",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              🚨 High Risk — Seek medical help immediately
            </div>
          )}

          <b>
            {i + 1}. {p.name}
          </b>{" "}
          — {p.confidence}%

          {advice && (
            <>
              <div className="muted">
                🟡 Risk: <b>{advice.risk}</b>
              </div>
              <div className="muted">
                💡 Advice: {advice.advice}
              </div>
              <div className="muted">
                🏥 Doctor Visit: {advice.consult}
              </div>
            </>
          )}
        </div>
      );
    })}

    {predictions[0].confidence >= 70 && (
      <button
        className="btn"
        style={{ marginTop: 12 }}
        onClick={detectLocation}
      >
        📍 Find Nearby Doctors
      </button>
    )}
  </motion.div>
)}


      {/* ===== SAVED RESULTS MODAL ===== */}
      {showSaved && (
        <div
          onClick={() => setShowSaved(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
          }}
        >
          <div
            className="card"
            style={{
              width: "90%",
              maxWidth: 600,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>📜 {text[lang].savedTitle}</h3>

            {!savedResults.length ? (
              <p>{text[lang].noSaved}</p>
            ) : (
              savedResults
                .slice()
                .reverse()
                .map((r, i) => (
                  <div key={i} className="pred-item">
                    <b>Symptoms:</b> {r.symptom}
                    <br />
                    <b>Top:</b> {r.predictions[0].name}
                    <div className="muted">{r.date}</div>
                  </div>
                ))
            )}

            <button className="btn" onClick={clearResults}>
              🗑 {text[lang].clear}
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);

}