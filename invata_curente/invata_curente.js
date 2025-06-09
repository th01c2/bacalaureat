// --- COPIAZĂ AICI CONSTANTA rawLiteraryData (cea actualizată) ---
const rawLiteraryData = [
    { opera: "Alexandru Lăpușneanul", author: "Constantin Negruzzi", category: "nuvelă istorică", period: "pașoptistă, romantică", year: 1840, currents: ["pașoptism", "romanticism", "nuvelă istorică"] },
    { opera: "Povestea lui Harap Alb", author: "Ion Creangă", category: "basm cult", period: "realism cu elemente fantastice", year: 1877, currents: ["realism", "fantastic", "basm cult"] },
    { opera: "Moara cu noroc", author: "Ioan Slavici", category: "nuvelă psihologică", period: "realism psihologic", year: 1881, currents: ["realism", "psihologic", "nuvelă psihologică"] },
    { opera: "Luceafărul", author: "Mihai Eminescu", category: "poem filozofic", period: "romantism", year: 1883, currents: ["romantism"] },
    { opera: "O scrisoare pierdută", author: "Ion Luca Caragiale", category: "comedie", period: "realism, clasicism", year: 1884, currents: ["realism", "clasicism", "comedie"] },
    { opera: "Plumb", author: "George Bacovia", category: "poem simbolist", period: "simbolism", year: 1916, currents: ["simbolism"] },
    { opera: "Eu nu strivesc corola de minuni a lumii", author: "Lucian Blaga", category: "artă poetică", period: "modernism expresionist", year: 1919, currents: ["modernism", "expresionism", "artă poetică"] },
    { opera: "Ion", author: "Liviu Rebreanu", category: "roman realist", period: "realism obiectiv", year: 1920, currents: ["realism", "obiectiv", "roman realist"] },
    { opera: "Riga Crypto și Lapona Enigel", author: "Ion Barbu", category: "baladă cultă", period: "modernism ermetic", year: 1924, currents: ["modernism", "ermetism", "baladă cultă"] },
    { opera: "Baltagul", author: "Mihail Sadoveanu", category: "roman mitic/realist", period: "realism tradiționalist, mitic", year: 1930, currents: ["realism", "mitic", "tradiționalism", "roman mitic"] },
    { opera: "Ultima noapte de dragoste, întâia noapte de război", author: "Camil Petrescu", category: "roman modern, psihologic", period: "modernism subiectiv, psihologic", year: 1930, currents: ["modernism", "psihologic", "subiectiv", "roman modern"] },
    { opera: "Flori de mucegai", author: "Tudor Arghezi", category: "poem liric", period: "modernism (estetica urâtului)", year: 1931, currents: ["modernism", "estetica uratului"] },
    { opera: "Enigma Otiliei", author: "George Călinescu", category: "roman balzacian (realist)", period: "realism balzacian, obiectiv", year: 1938, currents: ["realism", "balzacian", "obiectiv", "roman balzacian"] },
    { opera: "Moromeții", author: "Marin Preda", category: "roman realist, realism social", period: "realism postbelic", year: 1955, currents: ["realism", "realism social", "postbelic"] },
    { opera: "Leoaică tânără, iubirea", author: "Nichita Stănescu", category: "poem neomodernist", period: "neomodernism", year: 1964, currents: ["neomodernism"] },
    { opera: "Iona", author: "Marin Sorescu", category: "dramă modernă", period: "neomodernism (teatrul absurdului)", year: 1968, currents: ["neomodernism", "teatrul absurdului", "parabolă", "dramă modernă"] }
];
// ---------------------------------------------

let questions = [];
let currentQuestionIndex = 0;
let correctScore = 0;
let incorrectScore = 0;
let timerId;

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const questionText = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const submitAnswerButton = document.getElementById('submit-answer-button');
const giveUpButton = document.getElementById('give-up-button');
const feedbackMessage = document.getElementById('feedback-message');
const correctScoreDisplay = document.getElementById('correct-score');
const incorrectScoreDisplay = document.getElementById('incorrect-score');
const finalScoreMessage = document.getElementById('final-score-message');

function normalizeString(str) {
    if (typeof str !== 'string' && typeof str !== 'number') return '';
    return String(str).toLowerCase().trim()
        .replace(/\s+/g, ' ') // normalize multiple spaces to one
        .replace(/[.,()!?]/g, '') // Elimină punctuația comună
        .replace(/ă/g, 'a').replace(/â/g, 'a').replace(/î/g, 'i')
        .replace(/ș/g, 's').replace(/ş/g, 's')
        .replace(/ț/g, 't').replace(/ţ/g, 't');
}

function compareIgnoringArticulation(userStr, correctStr) {
    const s1 = normalizeString(userStr);
    const s2 = normalizeString(correctStr);

    if (s1 === s2) return true;
    const commonSuffixes = ["ul", "ului", "a", "ei", "i", "ii", "le", "lor", "u"];

    if (s1.length > s2.length && s1.startsWith(s2)) {
        const suffix = s1.substring(s2.length);
        if (commonSuffixes.includes(suffix) && s1.length - s2.length <= 3) return true;
    }
    if (s2.length > s1.length && s2.startsWith(s1)) {
        const suffix = s2.substring(s1.length);
        if (commonSuffixes.includes(suffix) && s2.length - s1.length <= 3) return true;
    }
    return false;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateAllGameQuestions() {
    const generatedQuestions = [];
    rawLiteraryData.forEach(item => {
        generatedQuestions.push({
            type: 'opera-to-period',
            question: `Ce curent/perioadă literară definește cel mai bine opera "${item.opera}"?`,
            correctAnswerDisplay: item.period,
            acceptedAnswers: [item.period, ...(item.currents || [])].filter(Boolean).map(s => s.trim()) // Curățăm spațiile
        });

        if (item.currents && item.currents.length > 0) {
            item.currents.forEach(currentKeyword => {
                const normKeyword = normalizeString(currentKeyword);
                // Evităm să generăm întrebări prea specifice ca "Numește o operă pentru roman balzacian" dacă nu e cazul explicit "Enigma Otiliei"
                if (normKeyword === "balzacian" && normalizeString(item.category).includes("roman") && item.opera === "Enigma Otiliei") {
                     generatedQuestions.push({
                        type: 'current-to-opera',
                        question: `Numește un roman (realist) balzacian din cele studiate:`,
                        correctAnswer: "Enigma Otiliei",
                        targetCurrent: "balzacian"
                    });
                } else if (normKeyword !== "balzacian" || !normalizeString(item.category).includes("roman")) { // Nu generăm "Numește o operă pentru balzacian" generic
                    generatedQuestions.push({
                        type: 'current-to-opera',
                        question: `Numește o operă reprezentativă pentru ${currentKeyword.startsWith("neomodernism") || currentKeyword.startsWith("postmodernism") ? "curentul" : "tipul/curentul"} "${currentKeyword}":`,
                        correctAnswer: item.opera,
                        targetCurrent: currentKeyword
                    });
                }
            });
        }
    });

    const uniqueQuestions = [];
    const seenQuestionTexts = new Set();
    for (const q of generatedQuestions) {
        if (!seenQuestionTexts.has(q.question)) {
            uniqueQuestions.push(q);
            seenQuestionTexts.add(q.question);
        }
    }
    questions = shuffleArray(uniqueQuestions);
    if (questions.length === 0) console.error("Nu s-au generat întrebări pentru curente.");
}

function displayQuestion() {
    clearTimeout(timerId);
    feedbackMessage.textContent = '';
    feedbackMessage.className = 'feedback-message';
    answerInput.value = '';
    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }
    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    setAnswerControlsState(false);
    answerInput.focus();
}

function setAnswerControlsState(disabled) {
    answerInput.disabled = disabled;
    submitAnswerButton.disabled = disabled;
    giveUpButton.disabled = disabled;
}

function handleSubmitAnswer() {
    const userAnswerRaw = answerInput.value;
    if (userAnswerRaw.trim() === "") {
        feedbackMessage.textContent = "Te rog introdu un răspuns.";
        feedbackMessage.className = 'feedback-message incorrect';
        answerInput.focus();
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const normalizedUserAnswer = normalizeString(userAnswerRaw);
    let isCorrect = false;

    if (currentQuestion.type === 'opera-to-period') {
        for (const acceptedAns of currentQuestion.acceptedAnswers) {
            const normalizedAcceptedAns = normalizeString(acceptedAns);
            if (compareIgnoringArticulation(normalizedUserAnswer, normalizedAcceptedAns)) {
                isCorrect = true;
                break;
            }
            // Verificare ca subșir, dar cu atenție la prefixe
            if (!isCorrect && normalizedAcceptedAns.includes(normalizedUserAnswer)) {
                // Prevenim potrivirea "modernism" cu "neomodernism" sau "postmodernism" etc.
                if ((normalizedAcceptedAns.startsWith("neo") || normalizedAcceptedAns.startsWith("post")) &&
                    normalizedUserAnswer.length < normalizedAcceptedAns.length &&
                    normalizedAcceptedAns.endsWith(normalizedUserAnswer) && // ex: user "modernism", accepted "neomodernism"
                    !normalizedUserAnswer.startsWith("neo") && !normalizedUserAnswer.startsWith("post")) { // user nu a scris si el neo/post
                    //  Lasă isCorrect false
                } else if (normalizedAcceptedAns.startsWith("supra") &&
                           normalizedUserAnswer.length < normalizedAcceptedAns.length &&
                           normalizedAcceptedAns.endsWith(normalizedUserAnswer) &&
                           !normalizedUserAnswer.startsWith("supra")) {
                    // Lasă isCorrect false
                }
                else {
                    isCorrect = true; // Altfel, subșirul e ok (ex: "expresionism" in "modernism expresionist")
                }
            }
             if (isCorrect) break;
        }
         // Caz specific "nuvela pasoptista"
        if (!isCorrect) {
            const normalizedFullPeriod = normalizeString(currentQuestion.correctAnswerDisplay);
            if (normalizedFullPeriod.includes("pasoptist") && (normalizedFullPeriod.includes("nuvel") || normalizedFullPeriod.includes("nuvelă"))) {
                 if (normalizedUserAnswer === "nuvela pasoptista") {
                    isCorrect = true;
                }
            }
        }

    } else if (currentQuestion.type === 'current-to-opera') {
        if (currentQuestion.question.toLowerCase().includes("roman (realist) balzacian")) { // Am ajustat textul întrebării
            if (normalizedUserAnswer === normalizeString("Enigma Otiliei")) isCorrect = true;
        } else {
            const matchingOperas = rawLiteraryData
                .filter(item => item.currents && item.currents.map(c => normalizeString(c)).includes(normalizeString(currentQuestion.targetCurrent)))
                .map(item => normalizeString(item.opera));
            if (matchingOperas.includes(normalizedUserAnswer)) isCorrect = true;
        }
    }

    if (isCorrect) {
        feedbackMessage.textContent = "Corect!";
        feedbackMessage.className = 'feedback-message correct';
        correctScore++;
        setAnswerControlsState(true);
        timerId = setTimeout(nextQuestion, 1000);
    } else {
        feedbackMessage.textContent = "Incorect! Încearcă din nou.";
        feedbackMessage.className = 'feedback-message incorrect';
        answerInput.focus();
    }
    updateScoreDisplay();
}

function handleGiveUp() {
    const currentQuestion = questions[currentQuestionIndex];
    let correctAnswerTextToShow = "";

    if (currentQuestion.type === 'opera-to-period') {
        correctAnswerTextToShow = currentQuestion.correctAnswerDisplay;
        const distinctKeywords = [...new Set(currentQuestion.acceptedAnswers
            .map(normalizeString)
            .filter(ansNorm => ansNorm !== normalizeString(currentQuestion.correctAnswerDisplay) && ansNorm.length > 2))] // cuvinte cheie distincte și relevante
            .map(ansNorm => { // Găsim forma originală pentru afișare
                return currentQuestion.acceptedAnswers.find(orig => normalizeString(orig) === ansNorm);
            }).filter(Boolean);

        if (distinctKeywords.length > 0) {
             // Eliminăm cuvintele cheie care sunt deja incluse complet în correctAnswerDisplay
            const finalKeywords = distinctKeywords.filter(kw => !normalizeString(currentQuestion.correctAnswerDisplay).includes(normalizeString(kw)));
            if (finalKeywords.length > 0) {
                correctAnswerTextToShow += ` (sau: ${finalKeywords.join(', ')})`;
            }
        }
    } else if (currentQuestion.type === 'current-to-opera') {
        if (currentQuestion.question.toLowerCase().includes("roman (realist) balzacian")) {
            correctAnswerTextToShow = "Enigma Otiliei";
        } else {
            const possibleAnswers = rawLiteraryData
                .filter(item => item.currents && item.currents.map(c => normalizeString(c)).includes(normalizeString(currentQuestion.targetCurrent)))
                .map(item => item.opera);
            correctAnswerTextToShow = possibleAnswers.length > 0 ? `Exemple: ${possibleAnswers.slice(0, 3).join(' / ')}` : currentQuestion.correctAnswer;
        }
    }

    feedbackMessage.textContent = `Răspunsul corect putea fi: "${correctAnswerTextToShow}"`;
    feedbackMessage.className = 'feedback-message incorrect';
    incorrectScore++;
    setAnswerControlsState(true);
    timerId = setTimeout(nextQuestion, 3000);
    updateScoreDisplay();
}

function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

function updateScoreDisplay() {
    correctScoreDisplay.textContent = correctScore;
    incorrectScoreDisplay.textContent = incorrectScore;
}

function startGame() {
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    generateAllGameQuestions();
    if (questions.length === 0) {
        questionText.textContent = "Eroare: Nu s-au putut încărca întrebările.";
        setAnswerControlsState(true);
        return;
    }
    currentQuestionIndex = 0;
    correctScore = 0;
    incorrectScore = 0;
    updateScoreDisplay();
    displayQuestion();
}

function endGame() {
    quizScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    finalScoreMessage.innerHTML = `Scorul tău final: ${correctScore} corecte, ${incorrectScore} greșite din ${questions.length} întrebări.`;
}

document.addEventListener('DOMContentLoaded', () => {
    if (startButton) startButton.addEventListener('click', startGame);
    if (restartButton) restartButton.addEventListener('click', startGame);
    if (submitAnswerButton) submitAnswerButton.addEventListener('click', handleSubmitAnswer);
    if (giveUpButton) giveUpButton.addEventListener('click', handleGiveUp);
    if (answerInput) {
        answerInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (!submitAnswerButton.disabled) handleSubmitAnswer();
            }
        });
    }
    if (startScreen && quizScreen && gameOverScreen) {
        startScreen.classList.remove('hidden');
        quizScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
    }
});