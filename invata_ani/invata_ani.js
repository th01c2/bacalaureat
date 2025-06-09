// --- COPIAZĂ AICI CONSTANTA rawLiteraryData (cea actualizată) ---
const rawLiteraryData = [
    { opera: "Alexandru Lăpușneanul", author: "Constantin Negruzzi", category: "nuvelă istorică", period: "pașoptistă", year: 1840, currents: ["pașoptism", "romanticism"] },
    { opera: "Povestea lui Harap Alb", author: "Ion Creangă", category: "basm cult", period: "realism cu elemente fantastice", year: 1877, currents: ["realism", "fantastic"] },
    { opera: "Moara cu noroc", author: "Ioan Slavici", category: "nuvelă psihologică", period: "realism", year: 1881, currents: ["realism", "psihologic"] },
    { opera: "Luceafărul", author: "Mihai Eminescu", category: "poem filozofic", period: "romantism", year: 1883, currents: ["romantism"] },
    { opera: "O scrisoare pierdută", author: "Ion Luca Caragiale", category: "comedie", period: "realism, clasicism (elemente)", year: 1884, currents: ["realism", "clasicism"] },
    { opera: "Plumb", author: "George Bacovia", category: "poem simbolist", period: "simbolism", year: 1916, currents: ["simbolism"] },
    { opera: "Eu nu strivesc corola de minuni a lumii", author: "Lucian Blaga", category: "artă poetică", period: "modernism (expresionism)", year: 1919, currents: ["modernism", "expresionism"] },
    { opera: "Ion", author: "Liviu Rebreanu", category: "roman realist", period: "realism", year: 1920, currents: ["realism", "obiectiv"] },
    { opera: "Riga Crypto și Lapona Enigel", author: "Ion Barbu", category: "baladă cultă", period: "modernism (ermetism)", year: 1924, currents: ["modernism", "ermetism"] },
    { opera: "Baltagul", author: "Mihail Sadoveanu", category: "roman mitic/realist", period: "realism cu elemente de baladă populară", year: 1930, currents: ["realism", "mitic", "tradiționalism"] },
    { opera: "Ultima noapte de dragoste, întâia noapte de război", author: "Camil Petrescu", category: "roman modern, psihologic", period: "modernism", year: 1930, currents: ["modernism", "psihologic", "subiectiv"] },
    { opera: "Flori de mucegai", author: "Tudor Arghezi", category: "poem liric", period: "modernism (estetica urâtului)", year: 1931, currents: ["modernism", "estetica uratului"] },
    { opera: "Enigma Otiliei", author: "George Călinescu", category: "roman balzacian (realist)", period: "realism", year: 1938, currents: ["realism", "balzacian", "obiectiv"] },
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

// Funcție pentru normalizarea textului (deși pentru ani nu e critică, o păstrăm pentru consistență)
function normalizeString(str) {
    if (typeof str !== 'string' && typeof str !== 'number') return '';
    return String(str).toLowerCase().trim()
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
    const operasWithYears = rawLiteraryData.filter(item => item.year); // Filtrăm doar operele care au an

    operasWithYears.forEach(item => {
        // Tip 1: "În ce an a fost publicată opera X?" -> Răspuns: Anul
        generatedQuestions.push({
            type: 'opera-to-year',
            question: `În ce an a fost publicată opera "${item.opera}"?`,
            correctAnswer: String(item.year)
        });

        // Tip 2: "Ce operă a fost publicată în anul Y?" -> Răspuns: Opera
        // Pentru a evita ca mai multe opere să aibă același an și să creăm confuzie la corectare
        // (deoarece utilizatorul ar putea scrie oricare din ele),
        // vom genera o întrebare "An -> Operă" doar dacă anul este unic pentru acea operă în setul nostru.
        // Sau, mai simplu pentru acest mod, ne concentrăm pe Opera -> An.
        // Dacă dorești An -> Operă, trebuie să gestionăm posibile răspunsuri multiple sau să alegem doar anii unici.
        // Pentru acest modul "Învață Anii", ne vom concentra pe Opera -> An, deoarece titlul sugerează asta.
    });

    questions = shuffleArray(generatedQuestions);
    if (questions.length === 0) {
        console.error("Nu s-au putut genera întrebări pentru anii operelor. Verifică datele.");
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
    const userAnswer = answerInput.value.trim(); // Trim pentru a elimina spațiile goale
    if (userAnswer === "") {
        feedbackMessage.textContent = "Te rog introdu un răspuns.";
        feedbackMessage.className = 'feedback-message incorrect';
        answerInput.focus();
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correctAnswer; // Anul e deja string

    // Normalizăm doar pentru a fi siguri, deși anii nu au diacritice.
    const normalizedUserAnswer = normalizeString(userAnswer);
    const normalizedCorrectAnswer = normalizeString(correctAnswer);


    if (normalizedUserAnswer === normalizedCorrectAnswer) {
        feedbackMessage.textContent = "Corect!";
        feedbackMessage.className = 'feedback-message correct';
        correctScore++;
        setAnswerControlsState(true);
        timerId = setTimeout(nextQuestion, 1000);
    } else {
        feedbackMessage.textContent = "Incorect! Încearcă din nou.";
        feedbackMessage.className = 'feedback-message incorrect';
        answerInput.focus(); // Permite reîncercarea
        // Nu se incrementează scorul greșit aici, doar la "Mă dau bătut"
    }
    updateScoreDisplay();
}

function handleGiveUp() {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correctAnswer;

    feedbackMessage.textContent = `Răspunsul corect era: "${correctAnswer}"`;
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
        questionText.textContent = "Eroare: Nu s-au putut încărca întrebările pentru anii operelor.";
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