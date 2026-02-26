let timer1Total = 150;
let timer2Total = 40;

let timer1Interval = null;
let timer2Interval = null;

let timer1Running = false;
let timer2Running = false;

let timer2SkillType = 1;

let timer1SoundPlayed = false;
let timer2SoundPlayed = false;

const timer1El = document.getElementById("timer1");
const timer2El = document.getElementById("timer2");
const timer2Title = document.getElementById("timer2Title");

// 音效設定元素
const timer1SoundEnable = document.getElementById("timer1SoundEnable");
const timer1SoundSec = document.getElementById("timer1SoundSec");
const timer1Volume = document.getElementById("timer1Volume");
const timer1SoundFile = document.getElementById("timer1SoundFile");

const timer2SoundEnable = document.getElementById("timer2SoundEnable");
const timer2SoundSec = document.getElementById("timer2SoundSec");
const timer2Volume = document.getElementById("timer2Volume");
const timer2SoundFile = document.getElementById("timer2SoundFile");

// Timer1 頻率
const timer1Freq1 = document.getElementById("timer1Freq1");
const timer1Freq2 = document.getElementById("timer1Freq2");
const timer1Freq3 = document.getElementById("timer1Freq3");

// Timer2 頻率
const timer2Freq1 = document.getElementById("timer2Freq1");
const timer2Freq2 = document.getElementById("timer2Freq2");
const timer2Freq3 = document.getElementById("timer2Freq3");

// 音效預設
let audioCtx = null;

// ===== 儲存設定 =====
function saveSettings() {
    const settings = {
        timer1: {
            enable: timer1SoundEnable.checked,
            sec: parseInt(timer1SoundSec.value) || 10,
            volume: parseFloat(timer1Volume.value),
            freq: [
                (timer1Freq1.value === "" || parseInt(timer1Freq1.value) === 0) ? "" : parseInt(timer1Freq1.value),
                (timer1Freq2.value === "" || parseInt(timer1Freq2.value) === 0) ? "" : parseInt(timer1Freq2.value),
                (timer1Freq3.value === "" || parseInt(timer1Freq3.value) === 0) ? "" : parseInt(timer1Freq3.value)
            ]
        },
        timer2: {
            enable: timer2SoundEnable.checked,
            sec: parseInt(timer2SoundSec.value) || 10,
            volume: parseFloat(timer2Volume.value),
            freq: [
                (timer2Freq1.value === "" || parseInt(timer2Freq1.value) === 0) ? "" : parseInt(timer2Freq1.value),
                (timer2Freq2.value === "" || parseInt(timer2Freq2.value) === 0) ? "" : parseInt(timer2Freq2.value),
                (timer2Freq3.value === "" || parseInt(timer2Freq3.value) === 0) ? "" : parseInt(timer2Freq3.value)
            ]
        }
    };
    localStorage.setItem("zakumTimerSettings", JSON.stringify(settings));
}

// ===== 載入設定 =====
function loadSettings() {
    const stored = JSON.parse(localStorage.getItem("zakumTimerSettings") || "{}");
    let firstUse = false;

    if (!stored.timer1) {
        firstUse = true;
        stored.timer1 = { enable: true, sec: 10, volume: 0.3, freq: [392, 440, 494] };
    }
    if (!stored.timer2) {
        firstUse = true;
        stored.timer2 = { enable: true, sec: 8, volume: 0.3, freq: [440, 440, 440] };
    }

    if (firstUse) {
        localStorage.setItem("zakumTimerSettings", JSON.stringify(stored));
    }

    // 套用到 UI
    // Timer1
    timer1SoundEnable.checked = stored.timer1.enable ?? true;
    timer1SoundSec.value = stored.timer1.sec ?? 10;
    timer1Volume.value = stored.timer1.volume ?? 0.3;
    timer1Freq1.value = stored.timer1.freq?.[0] !== undefined ? stored.timer1.freq[0] : "";
    timer1Freq2.value = stored.timer1.freq?.[1] !== undefined ? stored.timer1.freq[1] : "";
    timer1Freq3.value = stored.timer1.freq?.[2] !== undefined ? stored.timer1.freq[2] : "";

    // Timer2
    timer2SoundEnable.checked = stored.timer2.enable ?? true;
    timer2SoundSec.value = stored.timer2.sec ?? 8;
    timer2Volume.value = stored.timer2.volume ?? 0.3;
    timer2Freq1.value = stored.timer2.freq?.[0] !== undefined ? stored.timer2.freq[0] : "";
    timer2Freq2.value = stored.timer2.freq?.[1] !== undefined ? stored.timer2.freq[1] : "";
    timer2Freq3.value = stored.timer2.freq?.[2] !== undefined ? stored.timer2.freq[2] : "";
}
loadSettings();

// 自動儲存設定
[
    timer1SoundEnable, timer1SoundSec, timer1Volume,
    timer1Freq1, timer1Freq2, timer1Freq3,
    timer2SoundEnable, timer2SoundSec, timer2Volume,
    timer2Freq1, timer2Freq2, timer2Freq3
].forEach(el => el.addEventListener("change", saveSettings));

// ===== 顯示時間 =====
function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m + ":" + (s < 10 ? "0" + s : s);
}

function updateDisplay() {
    timer1El.textContent = formatTime(timer1Total);
    timer2El.textContent = timer2Total;
    const t1Sec = parseInt(timer1SoundSec.value);

    // Timer1 顏色
    if (!timer1Running) {
        timer1El.style.color = "gray";
    }
    else if (!isNaN(t1Sec) && timer1Total <= t1Sec) {
        timer1El.style.color = "#00ee00";

        if (
            timer1SoundEnable.checked &&
            timer1Total === t1Sec &&
            !timer1SoundPlayed
        ) {
            playSound(1);
            timer1SoundPlayed = true;
        }
    }
    else {
        timer1El.style.color = "white";
    }

    // Timer2 顏色
    const t2Sec = parseInt(timer2SoundSec.value);

    if (!timer2Running) {
        timer2El.style.color = "gray";
    }
    else if (!isNaN(t2Sec) && timer2Total <= t2Sec) {
        timer2El.style.color = (timer2SkillType === 1) ? "#ff0000" : "#00ee00";

        if (
            timer2SoundEnable.checked &&
            timer2Total === t2Sec &&
            !timer2SoundPlayed
        ) {
            playSound(2);
            timer2SoundPlayed = true;
        }
    }
    else {
        timer2El.style.color = "white";
    }
}

// ===== 計時器 =====
function startTimer1() {
    timer1Total = 150;
    timer1Running = true;
    timer1SoundPlayed = false;
    clearInterval(timer1Interval);
    timer1Interval = setInterval(() => {
        timer1Total--;
        if (timer1Total < 0) {
            timer1Total = 150;
            timer1SoundPlayed = false; // 重置音效播放
        }
        updateDisplay();
    }, 1000);
    updateDisplay();
}

function startTimer2Green() {
    timer2SkillType = 1;
    timer2Title.textContent = "黑水";
    timer2Title.style.color = "#ff0000";
    timer2Total = 40;
    timer2Running = true;
    timer2SoundPlayed = false;
    clearInterval(timer2Interval);
    timer2Interval = setInterval(() => {
        timer2Total--;
        if (timer2Total < 0) {
            timer2Total = 40;
            toggleSkillType();
        }
        updateDisplay();
    }, 1000);
    updateDisplay();
}

function startTimer2Black() {
    timer2SkillType = 2;
    timer2Title.textContent = "本體綠方";
    timer2Title.style.color = "#00ee00";
    timer2Total = 40;
    timer2Running = true;
    timer2SoundPlayed = false;
    clearInterval(timer2Interval);
    timer2Interval = setInterval(() => {
        timer2Total--;
        if (timer2Total < 0) {
            timer2Total = 40;
            toggleSkillType();
        }
        updateDisplay();
    }, 1000);
    updateDisplay();
}

function stopTimer1() {
    clearInterval(timer1Interval);
    timer1Running = false;
    timer1Total = 150;
    timer1SoundPlayed = false;
    updateDisplay();
}

function stopTimer2() {
    clearInterval(timer2Interval);
    timer2Running = false;
    timer2Total = 40;
    timer2SoundPlayed = false;
    updateDisplay();
}

function toggleSkillType() {
    if (timer2SkillType === 1) {
        timer2SkillType = 2;
        timer2Title.textContent = "本體綠方";
        timer2Title.style.color = "#00ee00";
    } else {
        timer2SkillType = 1;
        timer2Title.textContent = "黑水";
        timer2Title.style.color = "#ff0000";
    }
    timer2SoundPlayed = false;
}

function add10() {
    timer2Total += 10;
    if (timer2Total > 40) {
        timer2Total -= 40;
        toggleSkillType();
    }
    updateDisplay();
}

// ===== 音效播放 =====
function playSound(timer) {
    const fileInput = (timer === 1) ? timer1SoundFile : timer2SoundFile;
    const volume = (timer === 1) ? parseFloat(timer1Volume.value) : parseFloat(timer2Volume.value);
    const fileURL = fileInput.files[0] ? URL.createObjectURL(fileInput.files[0]) : null;

    if (fileURL) {
        const audio = new Audio(fileURL);
        audio.volume = volume;
        audio.play();
    } else {
        defaultBeep(timer);
    }
}

function defaultBeep(timer) {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const volume = (timer === 1) ? parseFloat(timer1Volume.value) : parseFloat(timer2Volume.value);
    const frequencies = (timer === 1)
        ? [parseInt(timer1Freq1.value) || 0,
           parseInt(timer1Freq2.value) || 0,
           parseInt(timer1Freq3.value) || 0]
        : [parseInt(timer2Freq1.value) || 0,
           parseInt(timer2Freq2.value) || 0,
           parseInt(timer2Freq3.value) || 0];

    frequencies.forEach((freq, i) => {
        if (freq > 0) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.frequency.value = freq;
            gain.gain.value = volume;
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(audioCtx.currentTime + i * 0.2);
            osc.stop(audioCtx.currentTime + i * 0.2 + 0.15);
        }
    });
}

// Timer1 還原預設值
function resetTimer1Defaults() {
    timer1SoundEnable.checked = true;
    timer1SoundSec.value = 10;
    timer1Volume.value = 0.3;
    timer1Freq1.value = 392;
    timer1Freq2.value = 440;
    timer1Freq3.value = 494;

    saveSettings(); // 儲存回 localStorage
    updateDisplay(); // 更新畫面顯示
}

// Timer2 還原預設值
function resetTimer2Defaults() {
    timer2SoundEnable.checked = true;
    timer2SoundSec.value = 8;
    timer2Volume.value = 0.3;
    timer2Freq1.value = 440;
    timer2Freq2.value = 440;
    timer2Freq3.value = 440;

    saveSettings();
    updateDisplay();
}

updateDisplay();
