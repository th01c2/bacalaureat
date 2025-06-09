// Datele despre opere, autori și categorii
const rawLiteraryData = [
    { opera: "Alexandru Lăpușneanul", author: "Constantin Negruzzi", category: "nuvelă istorică", period: "pașoptistă", year: 1840 },
    { opera: "Povestea lui Harap Alb", author: "Ion Creangă", category: "basm cult", period: "realism cu elemente fantastice", year: 1877 },
    { opera: "Moara cu noroc", author: "Ioan Slavici", category: "nuvelă psihologică", period: "realism", year: 1881 },
    { opera: "Luceafărul", author: "Mihai Eminescu", category: "poem filozofic", period: "romantism", year: 1883 },
    { opera: "O scrisoare pierdută", author: "Ion Luca Caragiale", category: "comedie", period: "realism, clasicism (elemente)", year: 1884 },
    { opera: "Plumb", author: "George Bacovia", category: "poem simbolist", period: "simbolism", year: 1916 },
    { opera: "Eu nu strivesc corola de minuni a lumii", author: "Lucian Blaga", category: "artă poetică", period: "modernism (expresionism)", year: 1919 },
    { opera: "Ion", author: "Liviu Rebreanu", category: "roman realist", period: "realism", year: 1920 },
    { opera: "Riga Crypto și Lapona Enigel", author: "Ion Barbu", category: "baladă cultă", period: "modernism (ermetism)", year: 1924 },
    { opera: "Baltagul", author: "Mihail Sadoveanu", category: "roman mitic/realist", period: "realism cu elemente de baladă populară", year: 1930 },
    { opera: "Ultima noapte de dragoste, întâia noapte de război", author: "Camil Petrescu", category: "roman modern, psihologic", period: "modernism", year: 1930 },
    { opera: "Flori de mucegai", author: "Tudor Arghezi", category: "poem liric", period: "modernism (estetica urâtului)", year: 1931 },
    { opera: "Enigma Otiliei", author: "George Călinescu", category: "roman balzacian (realist)", period: "realism", year: 1938 },
    { opera: "Moromeții", author: "Marin Preda", category: "roman realist, realism social", period: "Vol. I 1955", year: 1955 },
    { opera: "Leoaică tânără, iubirea", author: "Nichita Stănescu", category: "poem neomodernist", period: "neomodernism", year: 1964 },
    { opera: "Iona", author: "Marin Sorescu", category: "dramă modernă", period: "neomodernism (teatrul absurdului)", year: 1968 }
];

// Extrage toți autorii, operele și anii unici
const allAuthors = [...new Set(rawLiteraryData.map(data => data.author))];
const allOperas = [...new Set(rawLiteraryData.map(data => data.opera))];
const allYears = [...new Set(rawLiteraryData.map(data => data.year))];
const pasoptisteNovellas = rawLiteraryData.filter(data => data.period.includes("pașoptistă") && data.category.includes("nuvelă")).map(data => data.opera);
const otherNovellas = rawLiteraryData.filter(data => !data.period.includes("pașoptistă") && data.category.includes("nuvelă")).map(data => data.opera);
const nonNovellaWorks = rawLiteraryData.filter(data => !data.category.includes("nuvelă")).map(data => data.opera);

let questions = [];
let currentQuestionIndex = 0;
let correctScore = 0;
let incorrectScore = 0;
let timerId;

// Referințe către elementele DOM
// Este sigur să le declarăm aici, deoarece script.js este încărcat la sfârșitul body-ului.
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackMessage = document.getElementById('feedback-message');
const correctScoreDisplay = document.getElementById('correct-score');
const incorrectScoreDisplay = document.getElementById('incorrect-score');

// --- Funcții Utilitare ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getUniqueRandomOptions(pool, correctOption, numOptions) {
    const filteredPool = pool.filter(opt => String(opt) !== String(correctOption)); // Convertim la string pentru comparație sigură
    const shuffledPool = shuffleArray([...filteredPool]);
    return shuffledPool.slice(0, numOptions);
}

// --- Generarea Întrebărilor pentru Joc ---
function generateAllGameQuestions() {
    const generatedQuestions = [];

    rawLiteraryData.forEach(item => {
        // 1. Opera -> Autor
        let wrongAuthors = getUniqueRandomOptions(allAuthors, item.author, 3);
        if (wrongAuthors.length === 3) {
            generatedQuestions.push({
                type: 'opera-autor',
                question: `Cine a scris opera "${item.opera}"?`,
                correctAnswer: item.author,
                options: shuffleArray([item.author, ...wrongAuthors])
            });
        }

        // 2. Autor -> Operă
        let wrongOperas = getUniqueRandomOptions(allOperas, item.opera, 3);
        if (wrongOperas.length === 3) {
            generatedQuestions.push({
                type: 'autor-opera',
                question: `Ce operă dintre următoarele îi aparține autorului "${item.author}"?`,
                correctAnswer: item.opera,
                options: shuffleArray([item.opera, ...wrongOperas])
            });
        }

        // 3. Opera -> An
        if (item.year) {
            let wrongYears = getUniqueRandomOptions(allYears, item.year, 3);
            if (wrongYears.length === 3) {
                generatedQuestions.push({
                    type: 'opera-an',
                    question: `În ce an a fost publicată opera "${item.opera}"?`,
                    correctAnswer: String(item.year),
                    options: shuffleArray([String(item.year), ...wrongYears.map(y => String(y))])
                });
            }
        }

        // 4. An -> Operă
        if (item.year) {
            let wrongOperasForYear = getUniqueRandomOptions(allOperas, item.opera, 3);
            if (wrongOperasForYear.length === 3) {
                generatedQuestions.push({
                    type: 'an-opera',
                    question: `Ce operă a fost publicată în anul ${item.year}?`,
                    correctAnswer: item.opera,
                    options: shuffleArray([item.opera, ...wrongOperasForYear])
                });
            }
        }
    });

    // 5. Întrebare specifică: Nuvela pașoptistă
    if (pasoptisteNovellas.length > 0) {
        const correctPasoptista = shuffleArray([...pasoptisteNovellas])[0];
        let wrongOptionsPool = [...otherNovellas, ...nonNovellaWorks];
        let wrongOptionsForNovella = getUniqueRandomOptions(wrongOptionsPool, correctPasoptista, 3);

        let attempts = 0; // Pentru a evita bucle infinite dacă nu găsește opțiuni
        while (wrongOptionsForNovella.length < 3 && attempts < allOperas.length * 2) {
            const randomOpera = allOperas[Math.floor(Math.random() * allOperas.length)];
            if (randomOpera !== correctPasoptista && !wrongOptionsForNovella.includes(randomOpera)) {
                wrongOptionsForNovella.push(randomOpera);
            }
            attempts++;
        }
        if (wrongOptionsForNovella.length === 3) { // Adaugă întrebarea doar dacă are 3 opțiuni greșite
            generatedQuestions.push({
                type: 'nuvela-pasoptista',
                question: `Care dintre următoarele este o nuvelă pașoptistă?`,
                correctAnswer: correctPasoptista,
                options: shuffleArray([correctPasoptista, ...wrongOptionsForNovella])
            });
        }
    }
    questions = shuffleArray(generatedQuestions);
}

// --- Logica Jocului ---
function displayQuestion() {
    clearTimeout(timerId);
    feedbackMessage.textContent = '';
    optionsContainer.innerHTML = ''; // Curățăm opțiunile anterioare

    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;

    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-button');
        button.addEventListener('click', () => checkAnswer(button, option, currentQuestion.correctAnswer));
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedButton, selectedOption, correctAnswer) {
    Array.from(optionsContainer.children).forEach(button => {
        button.disabled = true; // Dezactivăm toate butoanele după un răspuns
    });

    const isCorrect = String(selectedOption) === String(correctAnswer);

    if (isCorrect) {
        selectedButton.classList.add('correct');
        feedbackMessage.textContent = "Corect!";
        correctScore++;
        timerId = setTimeout(nextQuestion, 1000); // 1 secundă pentru răspuns corect
    } else {
        selectedButton.classList.add('incorrect');
        feedbackMessage.textContent = `Greșit! Corect: "${correctAnswer}"`;
        incorrectScore++;

        // Găsim și marcăm vizual răspunsul corect
        Array.from(optionsContainer.children).forEach(button => {
            if (String(button.textContent) === String(correctAnswer)) {
                button.classList.add('correct');
            }
        });
        timerId = setTimeout(nextQuestion, 3000); // 3 secunde pentru răspuns greșit
    }
    updateScoreDisplay();
}

function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion(); // displayQuestion va curăța și reactiva butoanele prin reconstruirea lor
}

function updateScoreDisplay() {
    if (correctScoreDisplay && incorrectScoreDisplay) {
        correctScoreDisplay.textContent = correctScore;
        incorrectScoreDisplay.textContent = incorrectScore;
    }
}

function startGame() {
    if (startScreen && quizScreen && gameOverScreen) {
        startScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
    }

    generateAllGameQuestions();
    if (questions.length === 0) { // Fallback dacă nu s-au putut genera întrebări
        if (questionText && optionsContainer && feedbackMessage) {
            questionText.textContent = "Nu s-au putut genera întrebări. Verifică datele din script.js.";
            optionsContainer.innerHTML = "";
            feedbackMessage.textContent = "";
        }
        return;
    }
    currentQuestionIndex = 0;
    correctScore = 0;
    incorrectScore = 0;
    updateScoreDisplay();
    displayQuestion();
}

function endGame() {
    if (quizScreen && gameOverScreen) {
        quizScreen.classList.add('hidden');
        gameOverScreen.classList.remove('hidden');
    }
    const finalScoreP = gameOverScreen ? gameOverScreen.querySelector('p') : null;
    if (finalScoreP) {
        if (questions.length > 0) {
            finalScoreP.innerHTML = `Jocul s-a terminat! Ai parcurs toate întrebările.<br>Scorul tău final: ${correctScore} corecte, ${incorrectScore} greșite.`;
        } else {
            finalScoreP.innerHTML = `Jocul s-a terminat prematur (nu au fost generate întrebări).`;
        }
    }
}

// --- Evenimente ---
// Adăugăm event listener-ul după ce DOM-ul este complet încărcat.
document.addEventListener('DOMContentLoaded', () => {
    // Verificăm existența elementelor înainte de a adăuga event listeners
    if (startButton) {
        startButton.addEventListener('click', startGame);
    }
    if (restartButton) {
        restartButton.addEventListener('click', startGame);
    }

    // Afișarea inițială a ecranelor
    if (startScreen && quizScreen && gameOverScreen) {
        startScreen.classList.remove('hidden');
        quizScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
    } else {
        console.error("Eroare: Unul sau mai multe elemente de ecran (start, quiz, game-over) nu au fost găsite în DOM.");
    }
});