let timer1Total = 150;
let timer2Total = 40;

let timer1Interval = null;
let timer2Interval = null;

let timer2SkillType = 1;

const timer1El = document.getElementById("timer1");
const timer2El = document.getElementById("timer2");
const timer2Title = document.getElementById("timer2Title");

function formatTime(sec){
    let m = Math.floor(sec/60);
    let s = sec % 60;
    return m + ":" + (s<10?"0"+s:s);
}

function updateDisplay(){
    timer1El.textContent = formatTime(timer1Total);
    timer2El.textContent = timer2Total;
    
    // ===== Timer1 =====
    if(timer1Total <= 10 && timer1Total >= 0)
        timer1El.style.color = "#00ee00";
    else
        timer1El.style.color = "white";
    
    // ===== Timer2 =====
    if(timer2Total <= 10 && timer2Total >= 0){
        if(timer2SkillType === 1)
            timer2El.style.color = "#ff0000";
        else
            timer2El.style.color = "#00ee00";
    }
    else{
        timer2El.style.color = "white";
    }
}

function startTimer1(){
    timer1Total = 150;
    clearInterval(timer1Interval);
    timer1Interval = setInterval(()=>{
        timer1Total--;
        if(timer1Total < 0)
            timer1Total = 150;
        updateDisplay();
    },1000);
}

function startTimer2(){
    timer2Total = 40;
    clearInterval(timer2Interval);
    timer2Interval = setInterval(()=>{
        timer2Total--;
        if(timer2Total < 0){
            timer2Total = 40;
            toggleSkillType();
        }
        updateDisplay();
    },1000);
}

function toggleSkillType(){
    if(timer2SkillType === 1){
        timer2SkillType = 2;
        timer2Title.textContent = "本體綠方";
        timer2Title.style.color = "#00ee00";
    }else{
        timer2SkillType = 1;
        timer2Title.textContent = "黑水";
        timer2Title.style.color = "#ff0000";
    }
}

function add10(){
    timer2Total += 10;
    if(timer2Total > 40){
        timer2Total -= 40;
        toggleSkillType();
    }
    updateDisplay();
}

function stopAll(){
    clearInterval(timer1Interval);
    clearInterval(timer2Interval);
    timer1Total = 150;
    timer2Total = 40;
    updateDisplay();
}

function stopTimer1(){
    clearInterval(timer1Interval);
}

function stopTimer2(){
    clearInterval(timer2Interval);
}

updateDisplay();
