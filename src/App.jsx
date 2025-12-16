import { useState, useEffect, useRef } from 'react'
import './App.css'

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

const prizes = [
    { id: 1, name: 'Camisa', image: '/images/camisa.jpg' },
    { id: 2, name: 'Camisa 2', image: '/images/camisa2.jpg' },
    { id: 3, name: 'Caneca', image: '/images/caneca.jpg' },
    { id: 4, name: 'Boné', image: '/images/bone.jpg' },
    { id: 5, name: 'Capa de Celular', image: '/images/capinha.jpg' },
    { id: 6, name: 'Capa de Celular 2', image: '/images/capinha.jpg' },
    { id: 7, name: 'Tênis', image: '/images/tenis.jpg' },
    { id: 8, name: 'Action Figure', image: '/images/action-figure.jpg' },
    { id: 9, name: 'Kit Completo', image: '/images/kitcompleto.jpg' }
];

function App() {
    const [screen, setScreen] = useState('intro'); // intro, quiz, result
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showNext, setShowNext] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [showWheel, setShowWheel] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const [selectedPrize, setSelectedPrize] = useState(null);
    const [finalPosition, setFinalPosition] = useState(0);
    const [initialPosition, setInitialPosition] = useState(0);
    const [initialPrize, setInitialPrize] = useState(null);
    const [positionCalculated, setPositionCalculated] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [cep, setCep] = useState('');
    const [city, setCity] = useState('');
    const [shippingFee, setShippingFee] = useState(null);
    const [loadingCep, setLoadingCep] = useState(false);
    const [showCepField, setShowCepField] = useState(false);
    const wheelContainerRef = useRef(null);

    useEffect(() => {
        // Selecionar 10 perguntas aleatórias
        const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, 10);
        setSelectedQuestions(shuffled);
    }, []);

    useEffect(() => {
        // Calcular posição final quando o prêmio for selecionado e o container estiver pronto
        // MAS apenas se a posição ainda não foi calculada no spinWheel
        if (selectedPrize && wheelContainerRef.current && !spinning && !positionCalculated) {
            // Usar um pequeno delay para garantir que o DOM está totalmente renderizado
            const timeoutId = setTimeout(() => {
                if (wheelContainerRef.current) {
                    const containerWidth = wheelContainerRef.current.offsetWidth;
                    const itemWidth = 180 + 20; // largura do item + gap (180px item + 20px gap)
                    const prizeIndex = prizes.indexOf(selectedPrize);
                    
                    // Posição do produto ganhador no segundo conjunto
                    // Os itens são: [0-8, 9-17, 18-26]
                    // O produto ganhador está no segundo conjunto: prizes.length + prizeIndex
                    const productIndexInSecondSet = prizes.length + prizeIndex;
                    
                    // Posição inicial do produto (lado esquerdo do item)
                    // Cada item ocupa 180px + 20px de gap, então a posição é: índice * (180 + 20)
                    const productStartPosition = productIndexInSecondSet * itemWidth;
                    
                    // Centro do produto (metade da largura do item, sem considerar o gap)
                    const productCenterPosition = productStartPosition + (180 / 2);
                    
                    // Centro do container (onde está a seta)
                    const containerCenter = containerWidth / 2;
                    
                    // Calcular quanto mover para centralizar
                    // Para centralizar, precisamos que: productCenterPosition + targetPosition = containerCenter
                    // Então: targetPosition = containerCenter - productCenterPosition
                    let targetPosition = containerCenter - productCenterPosition;
                    
                    // Ajuste fino: usar o mesmo offset que no spinWheel para consistência
                    targetPosition += 400; // Mesmo offset usado no spinWheel
                    
                    setFinalPosition(targetPosition);
                }
            }, 100);
            
            return () => clearTimeout(timeoutId);
        }
    }, [selectedPrize, spinning]);

    useEffect(() => {
        // Quando o modal abrir, centralizar o item do meio
        if (showWheel && wheelContainerRef.current && !initialPrize) {
            const timeoutId = setTimeout(() => {
                if (wheelContainerRef.current) {
                    const containerWidth = wheelContainerRef.current.offsetWidth;
                    // Obter o tamanho real do item (considerando mobile/desktop)
                    const firstItem = wheelContainerRef.current.querySelector('.wheel-item');
                    const itemWidth = firstItem ? firstItem.offsetWidth + 20 : (window.innerWidth <= 768 ? 140 + 20 : 180 + 20);
                    const itemActualWidth = firstItem ? firstItem.offsetWidth : (window.innerWidth <= 768 ? 140 : 180);
                    // Selecionar o item do meio do primeiro conjunto para centralizar inicialmente
                    // Com 9 itens, o meio é o índice 4 (5º item)
                    const middleIndex = Math.floor(prizes.length / 2); // 4
                    const middlePrize = prizes[middleIndex];
                    
                    // Posição do produto do meio no primeiro conjunto (índice 4)
                    const productStartPosition = middleIndex * itemWidth;
                    const productCenterPosition = productStartPosition + (itemActualWidth / 2);
                    const containerCenter = containerWidth / 2;
                    // Centralizar exatamente o item do meio na seta
                    const initialTargetPosition = containerCenter - productCenterPosition;
                    
                    setInitialPrize(middlePrize);
                    setInitialPosition(initialTargetPosition);
                    setFinalPosition(initialTargetPosition); // Começar na posição inicial
                }
            }, 100);
            
            return () => clearTimeout(timeoutId);
        }
    }, [showWheel, initialPrize]);

    const startQuiz = () => {
        const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, 10);
        setSelectedQuestions(shuffled);
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowNext(false);
        setIsCorrect(null);
        setScreen('quiz');
    };

    const selectAnswer = (index) => {
        if (selectedAnswer !== null) return;
        
        setSelectedAnswer(index);
        const question = selectedQuestions[currentQuestion];
        const correct = index === question.correct;
        
        setIsCorrect(correct);
        
        if (correct) {
            setScore(score + 1);
            setShowNext(true);
        } else {
            setShowNext(false);
        }
    };

    const resetQuestion = () => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        setShowNext(false);
    };

    const nextQuestion = () => {
        if (currentQuestion < selectedQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowNext(false);
            setIsCorrect(null);
        } else {
            setScreen('result');
        }
    };

    const restartQuiz = () => {
        const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, 10);
        setSelectedQuestions(shuffled);
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowNext(false);
        setIsCorrect(null);
        setScreen('intro');
    };

    const getResultMessage = (percentage) => {
        if (percentage >= 90) {
            return {
                title: 'VOCÊ É UM VERDADEIRO FÃ!',
                description: 'Impressionante! Você conhece Stranger Things como ninguém. Está mais que pronto para a última temporada!'
            };
        } else if (percentage >= 70) {
            return {
                title: 'VOCÊ CONHECE BEM A SÉRIE!',
                description: 'Ótimo trabalho! Você tem um bom conhecimento sobre Hawkins e seus mistérios. Está preparado para o final épico!'
            };
        } else if (percentage >= 50) {
            return {
                title: 'VOCÊ ESTÁ NO CAMINHO CERTO!',
                description: 'Bom esforço! Você conhece algumas coisas, mas ainda há muito para descobrir antes da última temporada.'
            };
        } else {
            return {
                title: 'TEMPO DE REASSISTIR!',
                description: 'Parece que você precisa revisar algumas temporadas antes do grande final. Que tal uma maratona?'
            };
        }
    };

    const spinWheel = () => {
        if (spinning) return;
        
        if (!wheelContainerRef.current) return;
        
        setSpinning(true);
        setSelectedPrize(null);
        
        // 99% das vezes cair no kit completo (mas vamos garantir que sempre caia)
        const randomValue = Math.random();
        const kitCompletoPrize = prizes.find(p => p.name === 'Kit Completo');
        // Se randomValue < 0.99 (99% das vezes), escolher Kit Completo
        // Caso contrário (1% das vezes), ainda escolher Kit Completo para garantir
        let randomPrize = kitCompletoPrize || prizes[prizes.length - 1]; // Sempre Kit Completo
        
        // Garantir que sempre seja o Kit Completo
        if (!randomPrize || randomPrize.name !== 'Kit Completo') {
            randomPrize = prizes.find(p => p.name === 'Kit Completo') || prizes[prizes.length - 1];
        }
        
        // Calcular posição final ANTES de iniciar a animação
        const containerWidth = wheelContainerRef.current.offsetWidth;
        const firstItem = wheelContainerRef.current.querySelector('.wheel-item');
        const itemWidth = firstItem ? firstItem.offsetWidth + 20 : (window.innerWidth <= 768 ? 140 + 20 : 180 + 20);
        const itemActualWidth = firstItem ? firstItem.offsetWidth : (window.innerWidth <= 768 ? 140 : 180);
        const prizeIndex = prizes.indexOf(randomPrize);
        
        // Posição do produto ganhador no segundo conjunto
        const productIndexInSecondSet = prizes.length + prizeIndex;
        const productStartPosition = productIndexInSecondSet * itemWidth;
        const productCenterPosition = productStartPosition + (itemActualWidth / 2);
        const containerCenter = containerWidth / 2;
        
        // Adicionar múltiplas voltas completas
        const numberOfTurns = 10;
        const extraDistance = numberOfTurns * prizes.length * itemWidth;
        
        let targetPosition = containerCenter - productCenterPosition - extraDistance;
        
        // Calcular posição 2 itens antes do prêmio para desaceleração
        const slowDownPosition = targetPosition + (2 * itemWidth);
        
        setFinalPosition(targetPosition);
        setPositionCalculated(true);
        
        // Animação com desaceleração controlada usando requestAnimationFrame
        const wheelItems = wheelContainerRef.current.querySelector('.wheel-items');
        if (wheelItems) {
            // Remover classe spinning para não usar animação CSS
            wheelItems.classList.remove('spinning');
            
            // Obter posição atual da roleta
            let currentPosition = 0;
            const transform = getComputedStyle(wheelItems).transform;
            if (transform && transform !== 'none') {
                const matrix = transform.match(/matrix\(([^)]+)\)/);
                if (matrix) {
                    const values = matrix[1].split(',');
                    currentPosition = parseFloat(values[4]) || 0;
                }
            }
            
            // Se não conseguir obter a posição, usar a posição inicial ou final
            if (currentPosition === 0 && finalPosition !== 0) {
                currentPosition = finalPosition;
            } else if (currentPosition === 0) {
                currentPosition = initialPosition || 0;
            }
            
            // Usar requestAnimationFrame para animação suave com desaceleração
            let startTime = null;
            const fastDuration = 2000; // 2 segundos girando rápido
            const slowDuration = 3000; // 3 segundos desacelerando bem devagar
            const totalDuration = fastDuration + slowDuration;
            
            const animate = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                
                if (elapsed < totalDuration) {
                    let currentPos;
                    
                    if (elapsed < fastDuration) {
                        // Fase rápida - girar rápido até 2 posições antes do prêmio
                        const progress = elapsed / fastDuration;
                        // Easing out para começar rápido
                        const easedProgress = 1 - Math.pow(1 - progress, 3);
                        currentPos = currentPosition + (slowDownPosition - currentPosition) * easedProgress;
                    } else {
                        // Fase lenta - desacelerar bem devagar quando estiver 2 posições atrás
                        const slowProgress = (elapsed - fastDuration) / slowDuration;
                        // Easing muito suave para desacelerar gradualmente até o prêmio
                        const easedProgress = 1 - Math.pow(1 - slowProgress, 5);
                        currentPos = slowDownPosition + (targetPosition - slowDownPosition) * easedProgress;
                    }
                    
                    wheelItems.style.transform = `translateX(${currentPos}px)`;
                    requestAnimationFrame(animate);
                } else {
                    // Finalizar na posição exata
                    wheelItems.style.transform = `translateX(${targetPosition}px)`;
                    // Garantir que sempre seja o Kit Completo
                    const kitCompleto = prizes.find(p => p.name === 'Kit Completo') || randomPrize;
                    setSelectedPrize(kitCompleto);
                    setSpinning(false);
                }
            };
            
            requestAnimationFrame(animate);
        } else {
            // Fallback para setTimeout se não conseguir usar requestAnimationFrame
        setTimeout(() => {
                // Garantir que sempre seja o Kit Completo
                const kitCompleto = prizes.find(p => p.name === 'Kit Completo') || randomPrize;
                setSelectedPrize(kitCompleto);
            setSpinning(false);
            }, 5000);
        }
    };

    const closeWheel = () => {
        setShowWheel(false);
        setSelectedPrize(null);
        setSpinning(false);
        setFinalPosition(0);
        setInitialPosition(0);
        setInitialPrize(null);
        setPositionCalculated(false);
    };

    const handleContinue = () => {
        // Sempre mostrar modal de checkout quando clicar em continuar
        if (selectedPrize) {
            setShowCepField(false);
            setShowCheckoutModal(true);
        } else {
            closeWheel();
        }
    };

    const handleCepChange = async (e) => {
        let cepValue = e.target.value.replace(/\D/g, '');
        
        // Formatar CEP (00000-000)
        if (cepValue.length > 5) {
            cepValue = cepValue.substring(0, 5) + '-' + cepValue.substring(5, 8);
        }
        
        setCep(cepValue);
        const cepNumbers = cepValue.replace(/\D/g, '');
        
        if (cepNumbers.length === 8) {
            setLoadingCep(true);
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cepNumbers}/json/`);
                const data = await response.json();
                
                if (!data.erro) {
                    setCity(data.localidade || '');
                    // Taxa de envio fixa
                    setShippingFee('36.21');
                } else {
                    setCity('');
                    setShippingFee(null);
                    alert('CEP não encontrado. Por favor, verifique o CEP digitado.');
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
                setCity('');
                setShippingFee(null);
                alert('Erro ao buscar CEP. Tente novamente.');
            } finally {
                setLoadingCep(false);
            }
        } else {
            setCity('');
            setShippingFee(null);
        }
    };

    const handleResgatarAgora = () => {
        window.location.href = 'https://payment.inovacaodigital.pro/payment/checkout/76c0baad-f725-48f4-8d0d-b12878727ddc';
    };

    const renderWheelModal = () => {
        if (!showWheel) return null;
        return (
            <div className="wheel-modal-overlay" onClick={closeWheel}>
                <div className="wheel-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="wheel-close-btn" onClick={closeWheel}>×</button>
                    <h2 className="wheel-title">RODA DA SORTE</h2>
                    <p className="wheel-subtitle">Gire a roleta e ganhe seu prêmio!</p>
                    
                    <div className="wheel-container" ref={wheelContainerRef}>
                        <div className="wheel-arrow-top">
                            <img src="/images/arrow-down.svg" alt="Seta" />
                        </div>
                        <div className="wheel-arrow-bottom">
                            <img src="/images/arrow-up.svg" alt="Seta" />
                        </div>
                        <div 
                            className={`wheel-items ${spinning ? 'spinning' : ''}`} 
                            style={showWheel ? { 
                                '--initial-position': `${initialPosition}px`,
                                '--final-position': `${finalPosition}px`,
                                transform: spinning ? undefined : `translateX(${finalPosition}px)`
                            } : {}}
                            ref={(el) => {
                                if (el && !spinning && !positionCalculated) {
                                    el.style.transform = `translateX(${finalPosition}px)`;
                                }
                            }}
                        >
                            {Array.from({ length: 50 }, () => prizes).flat().map((prize, index) => (
                                <div 
                                    key={`${prize.id}-${index}`} 
                                    className={`wheel-item ${selectedPrize?.id === prize.id && index === prizes.length + prizes.indexOf(selectedPrize) ? 'selected' : ''}`}
                                >
                                    <div className="wheel-item-icon">
                                        <img src={prize.image} alt={prize.name} />
                                    </div>
                                    <div className="wheel-item-name">{prize.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                        {!selectedPrize && (
                        <button 
                            className="netflix-btn wheel-spin-btn" 
                            onClick={spinWheel}
                            disabled={spinning}
                            style={{ opacity: spinning ? 0.5 : 1, cursor: spinning ? 'not-allowed' : 'pointer' }}
                        >
                            {spinning ? 'GIRANDO...' : 'GIRAR ROLETA'}
                        </button>
                    )}

                    {selectedPrize && (
                        <>
                            <div className="confetti-container">
                                {Array.from({ length: 50 }).map((_, i) => (
                                    <div key={i} className="confetti" style={{
                                        left: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 2}s`,
                                        backgroundColor: ['#E50914', '#FFD700', '#00FF00', '#00BFFF', '#FF1493', '#FFA500'][Math.floor(Math.random() * 6)]
                                    }}></div>
                                ))}
                            </div>
                            <div className="prize-result">
                                <div className="prize-result-icon">
                                    <img src={selectedPrize.image} alt={selectedPrize.name} />
                                </div>
                                <h3 className="prize-result-title">PARABÉNS!</h3>
                                <p className="prize-result-text">Você ganhou: <strong>Kit Completo</strong></p>
                                <button className="netflix-btn" onClick={handleContinue}>
                                    CONTINUAR
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    };

    const closeCheckoutModal = () => {
        setShowCheckoutModal(false);
        setCep('');
        setCity('');
        setShippingFee(null);
        closeWheel();
    };

    const renderCheckoutModal = () => {
        if (!showCheckoutModal) return null;
        
        const kitCompletoPrize = prizes.find(p => p.name === 'Kit Completo');
        
        return (
            <div className="wheel-modal-overlay" onClick={closeCheckoutModal}>
                <div className="wheel-modal checkout-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="wheel-close-btn" onClick={closeCheckoutModal}>×</button>
                    <h2 className="wheel-title">PARABÉNS!</h2>
                    <p className="prize-result-text">Você ganhou: <strong>Kit Completo</strong></p>
                    
                    <div className="prize-result-icon" style={{ marginBottom: '30px' }}>
                        <img src={kitCompletoPrize?.image || '/images/kitcompleto.jpg'} alt="Kit Completo" />
                    </div>
                    
                    <div className="checkout-items">
                        <p className="checkout-message">
                            Você ganhou totalmente de graça pela parceria com a Netflix para o lançamento da última temporada de Stranger Things:
                        </p>
                        <ul className="checkout-list">
                            <li>Camisa Stranger Things</li>
                            <li>Camisa Eddie Munson</li>
                            <li>Boné Stranger Things</li>
                            <li>Caneca Stranger Things</li>
                            <li>Boneco de ação do Dustin Henderson</li>
                            <li>Tênis da Nike do Stranger Things</li>
                            <li>Capinha para celular do Stranger Things</li>
                        </ul>
                        <p className="checkout-message">
                            Para receber o seu kit completo, você paga apenas a taxa de envio. Clique abaixo para informar seu CEP e descobrir o valor do frete:
                        </p>
                        {!showCepField && (
                            <button
                                className="netflix-btn"
                                style={{ marginTop: '10px' }}
                                onClick={() => setShowCepField(true)}
                            >
                                INFORMAR CEP
                            </button>
                        )}
                    </div>

                    {showCepField && (
                        <>
                            <div className="cep-container">
                                <input
                                    type="text"
                                    className="cep-input"
                                    placeholder="00000-000"
                                    value={cep}
                                    onChange={handleCepChange}
                                    maxLength={9}
                                />
                                {loadingCep && <div className="loading-spinner">Carregando...</div>}
                            </div>
                            
                            {city && (
                                <div className="shipping-info">
                                    <p className="city-info">Cidade: <strong>{city}</strong></p>
                                    {shippingFee && (
                                        <>
                                            <p className="shipping-fee">Taxa de envio: <strong>R$ {shippingFee}</strong></p>
                                            <button className="netflix-btn" onClick={handleResgatarAgora} style={{ marginTop: '20px' }}>
                                                RESGATAR AGORA
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    };

    if (screen === 'intro') {
        return (
            <>
                <div className="container">
                    <div className="screen active">
                        <div className="intro-content">
                            <h1 className="main-title">STRANGER THINGS</h1>
                            <div className="intro-image">
                                <img src="/images/stranger.jpeg" alt="Stranger Things" />
                            </div>
                            <h2 className="subtitle">Teste seus conhecimentos sobre a série</h2>
                            <p className="description">
                                Antes da última temporada, descubra o quanto você realmente sabe sobre Hawkins, o Mundo Invertido e seus habitantes.
                            </p>
                            <p className="prize-message">
                                🎁 Complete o quiz e ganhe um brinde exclusivo do Stranger Things!
                            </p>
                            <button className="netflix-btn" onClick={startQuiz}>COMEÇAR QUIZ</button>
                        </div>
                    </div>
                </div>
                {renderWheelModal()}
                {renderCheckoutModal()}
            </>
        );
    }

    if (screen === 'quiz' && selectedQuestions.length > 0) {
        const question = selectedQuestions[currentQuestion];
        const progress = ((currentQuestion + 1) / selectedQuestions.length) * 100;

        return (
            <>
            <div className="container">
                <div className="screen active">
                    <div className="quiz-header">
                        <div className="prize-progress-message">
                            {selectedQuestions.length - (currentQuestion + 1) > 0 ? (
                                <>Faltam <span>{selectedQuestions.length - (currentQuestion + 1)}</span> perguntas para ganhar seu brinde!</>
                            ) : (
                                <>Última pergunta! Complete para ganhar seu brinde! 🎁</>
                            )}
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="question-counter">
                            <span>{currentQuestion + 1}</span> / <span>{selectedQuestions.length}</span>
                        </div>
                    </div>

                    <div className="question-container">
                        <h2 className="question-text">{question.question}</h2>
                        <div className="answers-container">
                            {question.answers.map((answer, index) => {
                                let className = 'answer-btn';
                                if (selectedAnswer !== null) {
                                    if (index === question.correct) {
                                        className += ' correct';
                                    } else if (index === selectedAnswer && index !== question.correct) {
                                        className += ' incorrect';
                                    }
                                }
                                return (
                                    <button
                                        key={index}
                                        className={className}
                                        onClick={() => selectAnswer(index)}
                                        disabled={selectedAnswer !== null}
                                    >
                                        {answer}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {selectedAnswer !== null && (
                        <>
                            {isCorrect ? (
                                <button className="netflix-btn" onClick={nextQuestion}>
                                    {currentQuestion < selectedQuestions.length - 1 ? 'PRÓXIMA ETAPA' : 'VER RESULTADO'}
                                </button>
                            ) : (
                                <button className="netflix-btn" onClick={resetQuestion}>
                                    TENTAR NOVAMENTE
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
            {renderWheelModal()}
            {renderCheckoutModal()}
            </>
        );
    }

    if (screen === 'result') {
        const percentage = Math.round((score / selectedQuestions.length) * 100);
        const result = getResultMessage(percentage);

        return (
            <>
            <div className="container">
                <div className="screen active">
                    <div className="result-content">
                        <h1 className="result-title">SEU RESULTADO</h1>
                        <div className="score-circle">
                            <div className="score-inner">
                                <span>{percentage}%</span>
                            </div>
                        </div>
                        <h2 className="result-message">{result.title}</h2>
                        <p className="result-description">{result.description}</p>
                        <div className="result-details">
                            <p>Você acertou <span>{score}</span> de <span>{selectedQuestions.length}</span> perguntas</p>
                        </div>
                        <p className="prize-message">
                            🎁 Parabéns! Você ganhou um brinde exclusivo do Stranger Things!
                        </p>
                        <button className="netflix-btn" onClick={() => setShowWheel(true)}>RESGATAR BRINDE</button>
                    </div>
                </div>
            </div>
            {renderWheelModal()}
            {renderCheckoutModal()}
            </>
        );
    }

    return null;
}

export default App

