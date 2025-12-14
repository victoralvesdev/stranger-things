// Perguntas do Quiz sobre Stranger Things
const questions = [
    {
        question: "Qual é o nome completo de Eleven?",
        answers: [
            "Jane Hopper",
            "Eleven Brenner",
            "Jane Ives",
            "Eleven Byers"
        ],
        correct: 2
    },
    {
        question: "Em qual cidade fictícia se passa a série Stranger Things?",
        answers: [
            "Hawkins",
            "Springfield",
            "Riverside",
            "Woodsboro"
        ],
        correct: 0
    },
    {
        question: "Qual é o nome do laboratório secreto onde Eleven foi criada?",
        answers: [
            "Laboratório Nacional de Hawkins",
            "Laboratório de Pesquisas de Hawkins",
            "Laboratório de Energia de Hawkins",
            "Laboratório Nacional de Hawkins"
        ],
        correct: 1
    },
    {
        question: "Qual personagem é conhecido por ter um vocabulário extenso e usar palavras difíceis?",
        answers: [
            "Dustin Henderson",
            "Will Byers",
            "Mike Wheeler",
            "Lucas Sinclair"
        ],
        correct: 0
    },
    {
        question: "Qual é o nome do monstro principal da primeira temporada?",
        answers: [
            "Demogorgon",
            "Mind Flayer",
            "Vecna",
            "Demodog"
        ],
        correct: 0
    },
    {
        question: "Qual é o nome do irmão mais velho de Nancy Wheeler?",
        answers: [
            "Steve Harrington",
            "Jonathan Byers",
            "Billy Hargrove",
            "Mike Wheeler"
        ],
        correct: 3
    },
    {
        question: "Qual personagem trabalha no Palace Arcade?",
        answers: [
            "Steve Harrington",
            "Robin Buckley",
            "Max Mayfield",
            "Erica Sinclair"
        ],
        correct: 1
    },
    {
        question: "Qual é o nome do grupo de amigos principais formado por Mike, Dustin, Lucas e Will?",
        answers: [
            "Os Caçadores",
            "Os Aventureiros",
            "Os Investigadores",
            "Os Caçadores de Monstros"
        ],
        correct: 0
    },
    {
        question: "Qual personagem tem poderes telepáticos e pode ver coisas distantes?",
        answers: [
            "Eleven",
            "Kali",
            "Max",
            "Will"
        ],
        correct: 1
    },
    {
        question: "Qual é o nome do shopping que aparece na terceira temporada?",
        answers: [
            "Starcourt Mall",
            "Hawkins Mall",
            "Riverside Mall",
            "Woodsboro Mall"
        ],
        correct: 0
    },
    {
        question: "Qual personagem é conhecido por sempre usar um boné?",
        answers: [
            "Dustin",
            "Lucas",
            "Will",
            "Mike"
        ],
        correct: 0
    },
    {
        question: "Qual é o nome do pai de Eleven?",
        answers: [
            "Jim Hopper",
            "Dr. Martin Brenner",
            "Terry Ives",
            "Bob Newby"
        ],
        correct: 2
    },
    {
        question: "Qual é o nome do mundo paralelo e sombrio que existe junto com o nosso?",
        answers: [
            "Mundo Invertido",
            "Mundo das Trevas",
            "Mundo Paralelo",
            "Mundo Sombrio"
        ],
        correct: 0
    },
    {
        question: "Qual personagem morre na terceira temporada tentando fechar o portal?",
        answers: [
            "Bob Newby",
            "Billy Hargrove",
            "Alexei",
            "Dr. Owens"
        ],
        correct: 1
    },
    {
        question: "Qual é o nome da mãe de Will e Jonathan Byers?",
        answers: [
            "Joyce Byers",
            "Karen Wheeler",
            "Terry Ives",
            "Claudia Henderson"
        ],
        correct: 0
    }
];

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let quizStarted = false;

// Elementos DOM
const introScreen = document.getElementById('intro-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answers-container');
const progressFill = document.getElementById('progress');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const scorePercentage = document.getElementById('score-percentage');
const resultMessage = document.getElementById('result-message');
const resultDescription = document.getElementById('result-description');
const correctAnswersSpan = document.getElementById('correct-answers');
const totalAnswersSpan = document.getElementById('total-answers');

// Selecionar 10 perguntas aleatórias
let selectedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 10);

// Event Listeners
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);

function startQuiz() {
    introScreen.classList.remove('active');
    quizScreen.classList.add('active');
    quizStarted = true;
    currentQuestion = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    selectedAnswer = null;
    const question = selectedQuestions[currentQuestion];
    
    questionText.textContent = question.question;
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.addEventListener('click', () => selectAnswer(index, question.correct));
        answersContainer.appendChild(button);
    });
    
    // Atualizar progresso
    const progress = ((currentQuestion + 1) / selectedQuestions.length) * 100;
    progressFill.style.width = progress + '%';
    currentQuestionSpan.textContent = currentQuestion + 1;
    totalQuestionsSpan.textContent = selectedQuestions.length;
    
    nextBtn.style.display = 'none';
}

function selectAnswer(index, correctIndex) {
    if (selectedAnswer !== null) return;
    
    selectedAnswer = index;
    const buttons = answersContainer.querySelectorAll('.answer-btn');
    
    buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === correctIndex) {
            btn.classList.add('correct');
        } else if (i === index && index !== correctIndex) {
            btn.classList.add('incorrect');
        }
    });
    
    if (index === correctIndex) {
        score++;
    }
    
    nextBtn.style.display = 'block';
}

function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < selectedQuestions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');
    
    const percentage = Math.round((score / selectedQuestions.length) * 100);
    scorePercentage.textContent = percentage + '%';
    correctAnswersSpan.textContent = score;
    totalAnswersSpan.textContent = selectedQuestions.length;
    
    // Mensagens baseadas na pontuação
    if (percentage >= 90) {
        resultMessage.textContent = 'VOCÊ É UM VERDADEIRO FÃ!';
        resultDescription.textContent = 'Impressionante! Você conhece Stranger Things como ninguém. Está mais que pronto para a última temporada!';
    } else if (percentage >= 70) {
        resultMessage.textContent = 'VOCÊ CONHECE BEM A SÉRIE!';
        resultDescription.textContent = 'Ótimo trabalho! Você tem um bom conhecimento sobre Hawkins e seus mistérios. Está preparado para o final épico!';
    } else if (percentage >= 50) {
        resultMessage.textContent = 'VOCÊ ESTÁ NO CAMINHO CERTO!';
        resultDescription.textContent = 'Bom esforço! Você conhece algumas coisas, mas ainda há muito para descobrir antes da última temporada.';
    } else {
        resultMessage.textContent = 'TEMPO DE REASSISTIR!';
        resultDescription.textContent = 'Parece que você precisa revisar algumas temporadas antes do grande final. Que tal uma maratona?';
    }
}

function restartQuiz() {
    resultScreen.classList.remove('active');
    introScreen.classList.add('active');
    
    // Selecionar novas perguntas aleatórias
    selectedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 10);
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
}

