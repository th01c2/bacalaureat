// --- COPIAZĂ AICI CONSTANTA rawLiteraryData ---
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

const allAuthors = [...new Set(rawLiteraryData.map(data => data.author))];
const allOperas = [...new Set(rawLiteraryData.map(data => data.opera))];
const allYears = [...new Set(rawLiteraryData.map(data => String(data.year)))];
const allPeriods = [...new Set(rawLiteraryData.map(data => data.period))];
const pasoptisteNovellas = rawLiteraryData.filter(data => data.period.toLowerCase().includes("pașoptist") && data.category.toLowerCase().includes("nuvelă")).map(data => data.opera);
const otherWorks = rawLiteraryData.filter(data => !(data.period.toLowerCase().includes("pașoptist") && data.category.toLowerCase().includes("nuvelă"))).map(data => data.opera);

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
const optionsContainer = document.getElementById('options-container');
const feedbackMessage = document.getElementById('feedback-message');
const correctScoreDisplay = document.getElementById('correct-score');
const incorrectScoreDisplay = document.getElementById('incorrect-score');
const finalScoreMessage = document.getElementById('final-score-message');

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getUniqueRandomOptions(pool, correctOption, numOptions) {
    const filteredPool = pool.filter(opt => String(opt).trim().toLowerCase() !== String(correctOption).trim().toLowerCase());
    const shuffledPool = shuffleArray([...filteredPool]);
    return shuffledPool.slice(0, numOptions);
}

function generateAllGameQuestions() {
    const generatedQuestions = [];

    rawLiteraryData.forEach(item => {
        let wrongOptions;

        // 1. Opera -> Autor
        wrongOptions = getUniqueRandomOptions(allAuthors, item.author, 3);
        if (wrongOptions.length === 3) {
            generatedQuestions.push({
                question: `Cine a scris opera "${item.opera}"?`,
                correctAnswer: item.author,
                options: shuffleArray([item.author, ...wrongOptions])
            });
        }

        // 2. Autor -> Operă
        wrongOptions = getUniqueRandomOptions(allOperas, item.opera, 3);
        if (wrongOptions.length === 3) {
            generatedQuestions.push({
                question: `Ce operă dintre următoarele îi aparține autorului "${item.author}"?`,
                correctAnswer: item.opera,
                options: shuffleArray([item.opera, ...wrongOptions])
            });
        }

        // 3. Opera -> An
        if (item.year) {
            wrongOptions = getUniqueRandomOptions(allYears, String(item.year), 3);
            if (wrongOptions.length === 3) {
                generatedQuestions.push({
                    question: `În ce an a fost publicată opera "${item.opera}"?`,
                    correctAnswer: String(item.year),
                    options: shuffleArray([String(item.year), ...wrongOptions])
                });
            }
        }

        // 4. An -> Operă
        if (item.year) {
            wrongOptions = getUniqueRandomOptions(allOperas, item.opera, 3);
            if (wrongOptions.length === 3) {
                generatedQuestions.push({
                    question: `Ce operă importantă a fost publicată în anul ${item.year}?`,
                    correctAnswer: item.opera,
                    options: shuffleArray([item.opera, ...wrongOptions])
                });
            }
        }

        // 5. Opera -> Perioada/Curent (folosind câmpul 'period')
         wrongOptions = getUniqueRandomOptions(allPeriods, item.period, 3);
         if (wrongOptions.length === 3) {
            generatedQuestions.push({
                question: `Ce curent/perioadă literară caracterizează opera "${item.opera}"?`,
                correctAnswer: item.period,
                options: shuffleArray([item.period, ...wrongOptions])
            });
        }
    });

    // Întrebare specifică: Nuvela pașoptistă
    if (pasoptisteNovellas.length > 0) {
        const correctPasoptista = shuffleArray([...pasoptisteNovellas])[0];
        let wrongOptionsForNovella = getUniqueRandomOptions(otherWorks, correctPasoptista, 3);

        // Asigurăm că avem 3 opțiuni, chiar dacă trebuie să completăm din toate operele
        let attempts = 0;
        const allOtherOperas = allOperas.filter(op => op !== correctPasoptista);
        while(wrongOptionsForNovella.length < 3 && attempts < allOtherOperas.length * 2) {
            const randomOpera = allOtherOperas[Math.floor(Math.random() * allOtherOperas.length)];
            if(!wrongOptionsForNovella.includes(randomOpera)) {
                wrongOptionsForNovella.push(randomOpera);
            }
            attempts++;
        }


        if (wrongOptionsForNovella.length === 3) {
            generatedQuestions.push({
                question: `Care dintre următoarele este o nuvelă pașoptistă?`,
                correctAnswer: correctPasoptista,
                options: shuffleArray([correctPasoptista, ...wrongOptionsForNovella])
            });
        }
    }

    questions = shuffleArray(generatedQuestions);
    if (questions.length === 0) {
        console.error("Nu s-au putut genera întrebări pentru modul 'Învață pe Variante'. Verifică datele și logica de generare.");
    }
}

function displayQuestion() {
    clearTimeout(timerId);
    feedbackMessage.textContent = '';
    feedbackMessage.className = 'feedback-message';
    optionsContainer.innerHTML = '';

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
        button.disabled = true;
    });

    const isCorrect = String(selectedOption).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();

    if (isCorrect) {
        selectedButton.classList.add('correct');
        feedbackMessage.textContent = "Corect!";
        feedbackMessage.classList.add('correct');
        correctScore++;
        timerId = setTimeout(nextQuestion, 1000);
    } else {
        selectedButton.classList.add('incorrect');
        feedbackMessage.textContent = `Greșit! Corect: "${correctAnswer}"`;
        feedbackMessage.classList.add('incorrect');
        incorrectScore++;

        Array.from(optionsContainer.children).forEach(button => {
            if (String(button.textContent).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase()) {
                button.classList.add('correct');
            }
        });
        timerId = setTimeout(nextQuestion, 3000);
    }
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
        optionsContainer.innerHTML = "";
        feedbackMessage.textContent = "Încearcă să reîncarci pagina sau contactează administratorul.";
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

    if (startScreen && quizScreen && gameOverScreen) {
        startScreen.classList.remove('hidden');
        quizScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
    }
});