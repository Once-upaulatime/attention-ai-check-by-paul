// Focus Insight - demo script

// helpers
function hashStringToInt(s) {
  // simple deterministic hash -> integer
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function clamp(n, a=0, b=100){ return Math.max(a, Math.min(b, Math.round(n))); }
function pickRecommendations(score) {
  if (score >= 75) return [
    "현재 집중 상태가 양호합니다. 장시간 학습 시 규칙적으로 휴식하세요.",
    "고난도 과제는 50분 집중 → 10분 휴식 방식도 추천됩니다."
  ];
  if (score >= 45) return [
    "환경 소음을 줄이고, 짧은 집중 세션(25/5)을 시도하세요.",
    "작은 목표(15~25분)를 세워 성취감을 쌓아보세요."
  ];
  return [
    "수면 및 기본 리듬을 먼저 점검하세요(7시간 권장).",
    "자극(폰 등) 차단과 함께 타이머 기반 분할 학습을 권장합니다."
  ];
}

// DOM
const analyzeBtn = document.getElementById("analyze-btn");
const quickBtn = document.getElementById("quick-scan");
const userInput = document.getElementById("user-input");
const resultCard = document.getElementById("result-card");
const placeholder = document.getElementById("placeholder");
const scoreCircle = document.getElementById("score-circle");
const scoreLabel = document.getElementById("score-label");
const m1 = document.getElementById("m1");
const m2 = document.getElementById("m2");
const m3 = document.getElementById("m3");
const recList = document.getElementById("rec-list");
const retest = document.getElementById("retest");
const exportPdf = document.getElementById("export-pdf");

function runAnalysis(text){
  const base = hashStringToInt(text || String(Date.now()));
  // create pseudo-random but deterministic metrics
  const focus = clamp((base % 41) + 40); // 40-80
  const inhibit = clamp(((base >>> 3) % 51) + 30); // 30-80
  const sustain = clamp(((base >>> 6) % 61) + 20); // 20-80
  // final score weighted
  const score = clamp(Math.round((focus*0.45 + inhibit*0.3 + sustain*0.25)));
  return {score, focus, inhibit, sustain};
}

function showResult(obj){
  placeholder.hidden = true;
  resultCard.hidden = false;
  scoreCircle.textContent = obj.score;
  scoreLabel.textContent = obj.score >= 75 ? "High Focus" : (obj.score >= 45 ? "Moderate Focus" : "Low Focus");
  m1.value = obj.focus;
  m2.value = obj.inhibit;
  m3.value = obj.sustain;
  // recommendations
  const recs = pickRecommendations(obj.score);
  recList.innerHTML = "";
  recs.forEach(r => {
    const li = document.createElement("li");
    li.textContent = r;
    recList.appendChild(li);
  });
}

// events
analyzeBtn.addEventListener("click", () => {
  const txt = userInput.value.trim();
  const {score, focus, inhibit, sustain} = runAnalysis(txt.length ? txt : "default sample");
  showResult({score, focus, inhibit, sustain});
});

quickBtn.addEventListener("click", () => {
  const {score, focus, inhibit, sustain} = runAnalysis(String(Date.now()));
  showResult({score, focus, inhibit, sustain});
});

retest.addEventListener("click", () => {
  resultCard.hidden = true;
  placeholder.hidden = false;
  userInput.value = "";
});

// simple "pdf" download (text snapshot)
exportPdf.addEventListener("click", () => {
  const title = "Focus_Insight_Report.txt";
  const score = scoreCircle.textContent;
  const label = scoreLabel.textContent;
  const lines = [
    "Focus Insight - Demo Report",
    `Score: ${score} (${label})`,
    "Metrics:",
    ` - Focus: ${m1.value}`,
    ` - Inhibition: ${m2.value}`,
    ` - Sustained: ${m3.value}`,
    "Recommendations:",
    ...Array.from(recList.children).map(li => ` - ${li.textContent}`)
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = title;
  a.click();
  URL.revokeObjectURL(url);
});

// --- basic accessibility: focus for keyboard users
analyzeBtn.addEventListener("keyup", (e)=>{ if(e.key === "Enter") analyzeBtn.click(); });

// end of script
