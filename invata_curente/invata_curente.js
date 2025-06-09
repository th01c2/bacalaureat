// --- COPIAZĂ AICI CONSTANTA rawLiteraryData (cea actualizată) ---
const rawLiteraryData = [
    { opera: "Alexandru Lăpușneanul", author: "Constantin Negruzzi", category: "nuvelă istorică", period: "pașoptistă, romantică", year: 1840, currents: ["pașoptism", "romanticism"] }, // Am actualizat period pentru a fi mai explicit
    { opera: "Povestea lui Harap Alb", author: "Ion Creangă", category: "basm cult", period: "realism cu elemente fantastice", year: 1877, currents: ["realism", "fantastic"] },
    { opera: "Moara cu noroc", author: "Ioan Slavici", category: "nuvelă psihologică", period: "realism", year: 1881, currents: ["realism", "psihologic"] },
    { opera: "Luceafărul", author: "Mihai Eminescu", category: "poem filozofic", period: "romantism", year: 1883, currents: ["romantism"] },
    { opera: "O scrisoare pierdută", author: "Ion Luca Caragiale", category: "comedie", period: "realism, clasicism (elemente)", year: 1884, currents: ["realism", "clasicism"] },
    { opera: "Plumb", author: "George Bacovia", category: "poem simbolist", period: "simbolism", year: 1916, currents: ["simbolism"] },
    { opera: "Eu nu strivesc corola de minuni a lumii", author: "Lucian Blaga", category: "artă poetică", period: "modernism (expresionism)", year: 1919, currents: ["modernism", "expresionism"] },
    { opera: "Ion", author: "Liviu Rebreanu", category: "roman realist", period: "realism obiectiv", year: 1920, currents: ["realism", "obiectiv"] }, // Am actualizat period
    { opera: "Riga Crypto și Lapona Enigel", author: "Ion Barbu", category: "baladă cultă", period: "modernism (ermetism)", year: 1924, currents: ["modernism", "ermetism"] },
    { opera: "Baltagul", author: "Mihail Sadoveanu", category: "roman mitic/realist", period: "realism, tradiționalism", year: 1930, currents: ["realism", "mitic", "tradiționalism"] }, // Am actualizat period
    { opera: "Ultima noapte de dragoste, întâia noapte de război", author: "Camil Petrescu", category: "roman modern, psihologic", period: "modernism subiectiv", year: 1930, currents: ["modernism", "psihologic", "subiectiv"] }, // Am actualizat period
    { opera: "Flori de mucegai", author: "Tudor Arghezi", category: "poem liric", period: "modernism (estetica urâtului)", year: 1931, currents: ["modernism", "estetica uratului"] },
    { opera: "Enigma Otiliei", author: "George Călinescu", category: "roman balzacian (realist)", period: "realism balzacian", year: 1938, currents: ["realism", "balzacian", "obiectiv"] }, // Am actualizat period
    { opera: "Moromeții", author: "Marin Preda", category: "roman realist, realism social", period: "realism postbelic", year: 1955, currents: ["realism", "realism social", "postbelic"] },
    { opera: "Leoaică tânără, iubirea", author: "Nichita Stănescu", category: "poem neomodernist", period: "neomodernism", year: 1964, currents: ["neomodernism"] },
    { opera: "Iona", author: "Marin Sorescu", category: "dramă modernă", period: "neomodernism (teatrul absurdului)", year: 1968, currents: ["neomodernism", "teatrul absurdului", "parabolă"] }
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
        .replace(/ă/g, 'a').replace(/â/g, 'a').replace(/î/g, 'i')
        .replace(/ș/g, 's').replace(/ş/g, 's')
        .replace(/ț/g, 't').replace(/ţ/g, 't');
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
        // Tip 1: "Ce curent/perioadă caracterizează opera X?"
        generatedQuestions.push({
            type: 'opera-to-period',
            question: `Ce curent/perioadă literară definește cel mai bine opera "${item.opera}"?`,
            correctAnswerDisplay: item.period, // Pentru afișare la "Mă dau bătut"
            // acceptedAnswers conține atât perioada completă cât și cuvintele cheie individuale
            acceptedAnswers: [item.period, ...(item.currents || [])].filter(Boolean) // Filtrăm valorile null/undefined
        });

        // Tip 2: "Numește o operă pentru curentul/cuvântul cheie Y"
        if (item.currents && item.currents.length > 0) {
            item.currents.forEach(currentKeyword => {
                if (normalizeString(currentKeyword) === "balzacian" && normalizeString(item.category).includes("roman")) {
                     generatedQuestions.push({
                        type: 'current-to-opera',
                        question: `Numește un roman realist balzacian din cele studiate:`,
                        correctAnswer: "Enigma Otiliei", // Răspunsul specific
                        targetCurrent: "balzacian" // Ajută la verificare și afișare
                    });
                } else {
                    generatedQuestions.push({
                        type: 'current-to-opera',
                        question: `Numește o operă reprezentativă pentru curentul/tipul "${currentKeyword}":`,
                        correctAnswer: item.opera, // Un răspuns corect principal
                        targetCurrent: currentKeyword
                    });
                }
            });
        }
    });

    const uniqueQuestions = [];
    const seenQuestions = new Set();
    for (const q of generatedQuestions) {
        // Pentru 'current-to-opera', întrebarea poate fi aceeași dar cu correctAnswer diferit.
        // Facem semnătura mai specifică pentru unicitate.
        let qSignature = q.question;
        if (q.type === 'current-to-opera') {
            qSignature += `_target:${q.targetCurrent}`; // Asigurăm că întrebări pentru același curent dar cu alt răspuns așteptat sunt unice dacă le vrem așa
                                                       // Dar aici, pentru "Numește O operă", vrem o singură întrebare per curent.
                                                       // Deci, semnătura ar trebui să fie doar q.question
             // Dacă vrem o singură întrebare per "Numește o operă pentru CURENT", folosim doar q.question
             // Dacă vrem să testăm TOATE operele pentru un curent, atunci semnătura trebuie să includă și correctAnswer.
             // Momentan, lasăm să poată apărea mai multe răspunsuri corecte pentru un curent.
        }


        if (!seenQuestions.has(q.question)) { // Simplificăm: o singură întrebare de tipul "Numește o operă pentru X"
            uniqueQuestions.push(q);
            seenQuestions.add(q.question);
        } else if (q.type === 'opera-to-period' && !seenQuestions.has(q.question + q.correctAnswerDisplay)) {
            // Pentru opera-to-period, întrebarea e unică per operă.
            uniqueQuestions.push(q);
            seenQuestions.add(q.question + q.correctAnswerDisplay);
        }
    }


    questions = shuffleArray(uniqueQuestions);
    if (questions.length === 0) {
        console.error("Nu s-au putut genera întrebări pentru curente literare. Verifică datele.");
    }
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
    const userAnswer = answerInput.value;
    if (userAnswer.trim() === "") {
        feedbackMessage.textContent = "Te rog introdu un răspuns.";
        feedbackMessage.className = 'feedback-message incorrect';
        answerInput.focus();
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const normalizedUserAnswer = normalizeString(userAnswer);
    let isCorrect = false;

    if (currentQuestion.type === 'opera-to-period') {
        // Lista de răspunsuri acceptate (perioada completă și cuvintele cheie)
        const normalizedAcceptedAnswers = currentQuestion.acceptedAnswers.map(ans => normalizeString(ans));

        // 1. Verifică dacă răspunsul utilizatorului este unul dintre răspunsurile acceptate complete
        if (normalizedAcceptedAnswers.includes(normalizedUserAnswer)) {
            isCorrect = true;
        } else {
            // 2. Verifică dacă răspunsul utilizatorului este un subșir al perioadei complete stocate (item.period)
            //    sau dacă răspunsul utilizatorului este un cuvânt cheie.
            const normalizedFullPeriod = normalizeString(currentQuestion.correctAnswerDisplay); // item.period
            if (normalizedFullPeriod.includes(normalizedUserAnswer)) { // Ex: "pasoptism" in "pasoptista, romantica"
                isCorrect = true;
            }
            // Caz specific: "nuvela pasoptista"
            if (!isCorrect && normalizedFullPeriod.includes("pasoptist") && (normalizedFullPeriod.includes("nuvel") || normalizedFullPeriod.includes("nuvelă"))) {
                if (normalizedUserAnswer === "nuvela pasoptista") {
                    isCorrect = true;
                }
            }
        }
    } else if (currentQuestion.type === 'current-to-opera') {
        if (currentQuestion.question.toLowerCase().includes("roman realist balzacian")) {
            if (normalizedUserAnswer === normalizeString("Enigma Otiliei")) {
                isCorrect = true;
            }
        } else {
            // Verifică dacă opera introdusă de utilizator este una dintre cele care au 'targetCurrent' în lista lor de 'currents'.
            const matchingOperas = rawLiteraryData.filter(item =>
                item.currents && item.currents.map(c => normalizeString(c)).includes(normalizeString(currentQuestion.targetCurrent))
            ).map(item => normalizeString(item.opera));

            if (matchingOperas.includes(normalizedUserAnswer)) {
                isCorrect = true;
            }
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
        // Afișăm perioada principală (mai descriptivă) și eventualele cuvinte cheie distincte.
        correctAnswerTextToShow = currentQuestion.correctAnswerDisplay; // item.period
        const keywords = currentQuestion.acceptedAnswers.filter(ans => ans !== currentQuestion.correctAnswerDisplay && ans.trim() !== "");
        if (keywords.length > 0) {
            correctAnswerTextToShow += ` (sau: ${keywords.join(', ')})`;
        }
    } else if (currentQuestion.type === 'current-to-opera') {
        if (currentQuestion.question.toLowerCase().includes("roman realist balzacian")) {
            correctAnswerTextToShow = "Enigma Otiliei";
        } else {
            // Găsim toate operele care se potrivesc cu targetCurrent
            const possibleAnswers = rawLiteraryData
                .filter(item => item.currents && item.currents.map(c => normalizeString(c)).includes(normalizeString(currentQuestion.targetCurrent)))
                .map(item => item.opera);
            if (possibleAnswers.length > 0) {
                correctAnswerTextToShow = `Exemple: ${possibleAnswers.slice(0, 3).join(' / ')}`; // Afișăm primele 1-3 exemple
            } else {
                correctAnswerTextToShow = currentQuestion.correctAnswer; // Fallback la cel stocat inițial
            }
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
        questionText.textContent = "Eroare: Nu s-au putut încărca întrebările pentru curente literare.";
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
                if (!submitAnswerButton.disabled) {
                    handleSubmitAnswer();
                }
            }
        });
    }

    if (startScreen && quizScreen && gameOverScreen) {
        startScreen.classList.remove('hidden');
        quizScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
    }
});