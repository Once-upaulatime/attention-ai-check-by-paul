// 오늘의 목표 저장 기능
const goalInput = document.getElementById("goal-input");
const goalBtn = document.getElementById("goal-save-btn");
const goalDisplay = document.getElementById("goal-display");

goalBtn.addEventListener("click", () => {
  const goalText = goalInput.value.trim();
  if (goalText !== "") {
    goalDisplay.textContent = `🎯 오늘의 목표: ${goalText}`;
  }
});

// 타이머 기능
let time = 25 * 60; // 25분
let timerId = null;
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");

function updateTimerDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

startBtn.addEventListener("click", () => {
  if (timerId) return; // 중복 방지
  timerId = setInterval(() => {
    time--;
    updateTimerDisplay();
    if (time <= 0) {
      clearInterval(timerId);
      timerId = null;
      time = 25 * 60;
    }
  }, 1000);
});

resetBtn.addEventListener("click", () => {
  clearInterval(timerId);
  timerId = null;
  time = 25 * 60;
  updateTimerDisplay();
});

// 화이트 노이즈 (임시 - 추후 사운드 추가)
const whiteNoiseBtn = document.getElementById("white-noise-btn");
let noisePlaying = false;

whiteNoiseBtn.addEventListener("click", () => {
  noisePlaying = !noisePlaying;
  whiteNoiseBtn.textContent = noisePlaying
    ? "화이트 노이즈 정지"
    : "화이트 노이즈 ON/OFF";
  console.log("White Noise 기능은 추후 적용 예정!");
});

// 초기 표시
updateTimerDisplay();
