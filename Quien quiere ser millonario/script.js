const questions = [
    {
        text: "Ante una repentina caída del mercado que afecta las exportaciones, el gerente mantiene la calma, acepta que las fluctuaciones están fuera de su control y se enfoca únicamente en reestructurar la logística interna con disciplina.",
        correct: "A",
        explanation: "La Ética Estoica se centra en aceptar lo incontrolable y mantener la paz interior enfocándose en lo que sí se puede controlar (la propia reacción)."
    },
    {
        text: "Una multinacional analiza abrir una fábrica en un país en desarrollo. Evalúan cuántos empleos generarán versus el impacto ambiental, eligiendo la opción que maximiza el bienestar general para la mayor cantidad de personas.",
        correct: "B",
        explanation: "La Ética Utilitarista busca el mayor beneficio para el mayor número de personas (análisis costo-beneficio a nivel global)."
    },
    {
        text: "Un negociador internacional decide no participar en reuniones fuera del horario laboral, priorizando un ambiente libre de estrés y ansiedad, buscando la tranquilidad de su equipo (ataraxia).",
        correct: "C",
        explanation: "La Ética Epicúrea busca la felicidad mediante el placer moderado y, sobre todo, la evitación del dolor y la ansiedad (ataraxia)."
    },
    {
        text: "Un director de aduanas fomenta una cultura donde cada empleado desarrolla hábitos de honestidad y prudencia (phronesis), buscando el 'justo medio' entre ser demasiado estricto o permisivo.",
        correct: "D",
        explanation: "La Ética Aristotélica se basa en la forja del carácter, la virtud como hábito y la búsqueda del 'justo medio'."
    },
    {
        text: "Al descubrir una falla en un producto ya exportado, la empresa calcula que el costo de retirar el producto es menor que las posibles demandas, decidiendo retirarlo para minimizar el daño global.",
        correct: "B",
        explanation: "De nuevo es Ética Utilitarista: se realiza un cálculo de consecuencias para minimizar el daño global y maximizar la utilidad."
    },
    {
        text: "Durante negociaciones por aranceles, una de las partes utiliza insultos. El otro negociador no se deja afectar emocionalmente, entendiendo que la ira de su contraparte no le pertenece y no debe perturbarlo.",
        correct: "A",
        explanation: "Ética Estoica: Resiliencia emocional frente a las adversidades externas; no permitir que las acciones de otros dicten tu estado de ánimo."
    },
    {
        text: "Una empresa importadora elige a sus proveedores evaluando si los dueños de esas fábricas son personas con excelencia moral (areté) que contribuyen al florecimiento humano.",
        correct: "D",
        explanation: "Ética Aristotélica: Enfoque en la virtud (areté) y el florecimiento humano (eudaimonia) integral de las personas."
    },
    {
        text: "Un ejecutivo rechaza un lucrativo contrato de armas argumentando que su trabajo debe generar productos que traigan una vida placentera y pacífica, alejándose de cualquier fuente de conflicto.",
        correct: "C",
        explanation: "Ética Epicúrea: Evitar lo que cause dolor o sufrimiento mental, promoviendo placeres duraderos y pacíficos."
    },
    {
        text: "Para aprobar un TLC, el gobierno sacrifica ciertos subsidios de un pequeño sector agrícola, argumentando que los beneficios económicos de la exportación favorecerán a millones de ciudadanos.",
        correct: "B",
        explanation: "Ética Utilitarista: El sacrificio de una minoría se justifica si produce un bienestar significativamente mayor para la mayoría."
    },
    {
        text: "El CEO dona el 50% de las ganancias a escuelas en los puertos donde operan, argumentando que la finalidad de los negocios es alcanzar la excelencia humana de todos los involucrados, practicando la generosidad.",
        correct: "D",
        explanation: "Ética Aristotélica: Los negocios como medio para la Eudaimonia (felicidad/florecimiento) social, ejercitando virtudes como la generosidad."
    }
];

const levels = [
    { level: 1, amount: "$ 100", value: 100 },
    { level: 2, amount: "$ 500", value: 500 },
    { level: 3, amount: "$ 1,000", value: 1000 },
    { level: 4, amount: "$ 5,000", value: 5000 },
    { level: 5, amount: "$ 10,000", value: 10000, safe: true },
    { level: 6, amount: "$ 50,000", value: 50000 },
    { level: 7, amount: "$ 100,000", value: 100000 },
    { level: 8, amount: "$ 250,000", value: 250000 },
    { level: 9, amount: "$ 500,000", value: 500000 },
    { level: 10, amount: "$ 1,000,000", value: 1000000, safe: true }
];

let currentLevelIndex = 0;
let isAnimating = false;
let timerInterval;
let timeLeft = 60;
let lifelinesUsed = { fifty: false, friend: false };

// --- SOUND MANAGER (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const SoundManager = {
    playTone: function(freq, type, duration, vol = 0.1) {
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    },
    tick: () => SoundManager.playTone(800, 'sine', 0.1, 0.05),
    start: () => {
        SoundManager.playTone(440, 'square', 0.2, 0.1);
        setTimeout(() => SoundManager.playTone(554, 'square', 0.2, 0.1), 200);
        setTimeout(() => SoundManager.playTone(659, 'square', 0.4, 0.1), 400);
    },
    lock: () => SoundManager.playTone(200, 'sawtooth', 1.5, 0.1),
    correct: () => {
        SoundManager.playTone(523.25, 'sine', 0.2, 0.1); // C5
        setTimeout(() => SoundManager.playTone(659.25, 'sine', 0.2, 0.1), 150); // E5
        setTimeout(() => SoundManager.playTone(783.99, 'sine', 0.4, 0.1), 300); // G5
    },
    wrong: () => {
        SoundManager.playTone(300, 'sawtooth', 0.5, 0.1);
        setTimeout(() => SoundManager.playTone(250, 'sawtooth', 1.0, 0.1), 400);
    },
    lifeline: () => {
        for(let i=0; i<5; i++) {
            setTimeout(() => SoundManager.playTone(800 + i*200, 'sine', 0.1, 0.05), i*100);
        }
    },
    ring: () => {
        let i = 0;
        const ringInterval = setInterval(() => {
            if(i > 8) { clearInterval(ringInterval); return; }
            SoundManager.playTone(600, 'square', 0.1, 0.05);
            setTimeout(() => SoundManager.playTone(800, 'square', 0.1, 0.05), 100);
            i++;
        }, 300);
    }
};

// DOM Elements
const screens = {
    start: document.getElementById('start-screen'),
    game: document.getElementById('game-screen'),
    result: document.getElementById('result-screen')
};

const ui = {
    btnStart: document.getElementById('btn-start'),
    btnRestart: document.getElementById('btn-restart'),
    questionNum: document.getElementById('current-q-num'),
    questionText: document.getElementById('question-text'),
    ladder: document.getElementById('ladder'),
    options: document.querySelectorAll('.option-btn'),
    resultTitle: document.getElementById('result-title'),
    resultMessage: document.getElementById('result-message'),
    finalPrize: document.getElementById('final-prize'),
    timer: document.getElementById('timer'),
    btn5050: document.getElementById('btn-5050'),
    btnFriend: document.getElementById('btn-friend'),
    friendModal: document.getElementById('friend-modal'),
    friendText: document.getElementById('friend-text'),
    btnCloseFriend: document.getElementById('btn-close-friend'),
    callingAnim: document.getElementById('calling-anim')
};

// Initialization
function init() {
    renderLadder();
    
    ui.btnStart.addEventListener('click', startGame);
    ui.btnRestart.addEventListener('click', startGame);
    
    ui.options.forEach(btn => {
        btn.addEventListener('click', () => handleOptionClick(btn));
    });

    ui.btn5050.addEventListener('click', use5050);
    ui.btnFriend.addEventListener('click', useFriend);
    ui.btnCloseFriend.addEventListener('click', closeFriendModal);
}

function showScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
}

function renderLadder() {
    ui.ladder.innerHTML = '';
    // Reverse array to render top down
    [...levels].reverse().forEach(l => {
        const li = document.createElement('li');
        li.className = `ladder-item ${l.safe ? 'safe-net' : ''}`;
        li.id = `ladder-${l.level}`;
        li.innerHTML = `<span class="level">${l.level}</span> <span class="amount">${l.amount}</span>`;
        ui.ladder.appendChild(li);
    });
}

function startGame() {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    SoundManager.start();
    
    currentLevelIndex = 0;
    isAnimating = false;
    lifelinesUsed = { fifty: false, friend: false };
    ui.btn5050.disabled = false;
    ui.btnFriend.disabled = false;
    
    updateLadderUI();
    loadQuestion();
    showScreen('game');
}

function updateLadderUI() {
    document.querySelectorAll('.ladder-item').forEach(item => {
        item.classList.remove('active', 'passed');
    });
    
    for(let i = 0; i < currentLevelIndex; i++) {
        document.getElementById(`ladder-${i + 1}`).classList.add('passed');
    }
    
    if (currentLevelIndex < 10) {
        document.getElementById(`ladder-${currentLevelIndex + 1}`).classList.add('active');
    }
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 60;
    ui.timer.textContent = timeLeft;
    ui.timer.classList.remove('warning');
    
    timerInterval = setInterval(() => {
        if(isAnimating) return; // Pause timer if locked in
        
        timeLeft--;
        ui.timer.textContent = timeLeft;
        SoundManager.tick();
        
        if (timeLeft <= 10) {
            ui.timer.classList.add('warning');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function loadQuestion() {
    ui.options.forEach(btn => {
        btn.classList.remove('selected', 'correct', 'incorrect', 'hidden-option');
        btn.disabled = false;
    });

    const q = questions[currentLevelIndex];
    ui.questionNum.textContent = currentLevelIndex + 1;
    ui.questionText.textContent = q.text;
    
    startTimer();
}

function handleOptionClick(btn) {
    if (isAnimating) return;
    isAnimating = true;
    clearInterval(timerInterval); // stop timer
    SoundManager.lock();

    const selectedOption = btn.dataset.option;
    const correctOption = questions[currentLevelIndex].correct;

    // Lock all buttons
    ui.options.forEach(b => b.disabled = true);
    
    // Highlight selected
    btn.classList.add('selected');

    // Simulate suspense
    setTimeout(() => {
        btn.classList.remove('selected');
        
        if (selectedOption === correctOption) {
            SoundManager.correct();
            btn.classList.add('correct');
            setTimeout(() => advanceLevel(), 2000);
        } else {
            SoundManager.wrong();
            btn.classList.add('incorrect');
            // Highlight the correct one
            Array.from(ui.options).find(b => b.dataset.option === correctOption).classList.add('correct');
            setTimeout(() => endGame(false), 3000);
        }
    }, 2000);
}

function handleTimeout() {
    isAnimating = true;
    SoundManager.wrong();
    
    const correctOption = questions[currentLevelIndex].correct;
    Array.from(ui.options).forEach(b => {
        b.disabled = true;
        if(b.dataset.option === correctOption) {
            b.classList.add('correct');
        }
    });
    
    setTimeout(() => endGame(false, "¡Se acabó el tiempo!"), 3000);
}

function use5050() {
    if(lifelinesUsed.fifty || isAnimating) return;
    SoundManager.lifeline();
    
    lifelinesUsed.fifty = true;
    ui.btn5050.disabled = true;
    
    const correctOption = questions[currentLevelIndex].correct;
    const wrongOptions = Array.from(ui.options).filter(b => b.dataset.option !== correctOption);
    
    // Shuffle and pick 2
    wrongOptions.sort(() => Math.random() - 0.5);
    wrongOptions[0].classList.add('hidden-option');
    wrongOptions[1].classList.add('hidden-option');
}

function useFriend() {
    if(lifelinesUsed.friend || isAnimating) return;
    lifelinesUsed.friend = true;
    ui.btnFriend.disabled = true;
    
    // Pause timer
    isAnimating = true; 
    
    ui.friendModal.classList.add('active');
    ui.callingAnim.style.display = 'flex';
    ui.btnCloseFriend.style.display = 'none';
    ui.friendText.textContent = "Llamando al colega experto...";
    SoundManager.ring();
    
    setTimeout(() => {
        ui.callingAnim.style.display = 'none';
        
        // Expert logic: 80% chance of being right
        const correctOption = questions[currentLevelIndex].correct;
        const allOpts = ['A', 'B', 'C', 'D'];
        let suggestion = correctOption;
        
        if(Math.random() > 0.8) {
            // Pick a wrong one that isn't hidden
            const availableWrong = Array.from(ui.options)
                .filter(b => b.dataset.option !== correctOption && !b.classList.contains('hidden-option'))
                .map(b => b.dataset.option);
            if(availableWrong.length > 0) {
                suggestion = availableWrong[Math.floor(Math.random() * availableWrong.length)];
            }
        }
        
        ui.friendText.innerHTML = `"¡Hola! Uff, qué caso interesante.<br><br>Estoy bastante seguro de que la respuesta correcta es la <strong>Opción ${suggestion}</strong>. ¡Suerte!"`;
        ui.btnCloseFriend.style.display = 'block';
    }, 3000);
}

function closeFriendModal() {
    ui.friendModal.classList.remove('active');
    isAnimating = false; // resume timer tick ability
}

function advanceLevel() {
    currentLevelIndex++;
    
    if (currentLevelIndex >= levels.length) {
        endGame(true);
    } else {
        updateLadderUI();
        loadQuestion();
        isAnimating = false;
    }
}

function endGame(won, customMsg = null) {
    let finalAmount = "$ 0";
    clearInterval(timerInterval);
    
    if (won) {
        finalAmount = levels[9].amount;
        ui.resultTitle.textContent = "¡Felicidades Millonario!";
        ui.resultMessage.textContent = "Has dominado la ética profesional en el comercio internacional.";
        ui.finalPrize.style.color = "var(--correct)";
    } else {
        // Find highest safe net
        const safeNets = levels.filter(l => l.safe && l.level <= currentLevelIndex);
        if (safeNets.length > 0) {
            finalAmount = safeNets[safeNets.length - 1].amount;
        }
        ui.resultTitle.textContent = "¡Juego Terminado!";
        ui.resultMessage.textContent = customMsg ? customMsg : `La respuesta correcta era: ${questions[currentLevelIndex].explanation}`;
        ui.finalPrize.style.color = "var(--incorrect)";
    }
    
    ui.finalPrize.textContent = finalAmount;
    showScreen('result');
}

// Start app
init();
