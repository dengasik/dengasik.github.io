// Casino Game System - Roblox Style
// Include this in your HTML after your basic layout with left panel and main screen

// Main Casino Class
class RobloxCasino {
    constructor() {
        this.tokens = 1000; // Starting tokens
        this.currentGame = null;
        this.gameHistory = [];
        this.init();
    }

    init() {
        this.updateTokenDisplay();
        this.setupEventListeners();
    }

    // Token Management
    updateTokens(amount) {
        this.tokens += amount;
        this.updateTokenDisplay();
        
        // Visual feedback for token changes
        if (amount > 0) {
            this.showTokenGainEffect(amount);
        } else if (amount < 0) {
            this.showTokenLossEffect(Math.abs(amount));
        }
    }

    updateTokenDisplay() {
        const tokenDisplay = document.getElementById('token-count');
        if (tokenDisplay) {
            tokenDisplay.textContent = this.tokens.toLocaleString();
        }
    }

    showTokenGainEffect(amount) {
        this.showFloatingText(`+${amount}`, 'green');
        this.playWinAnimation();
    }

    showTokenLossEffect(amount) {
        this.showFloatingText(`-${amount}`, 'red');
    }

    showFloatingText(text, color) {
        const floatingText = document.createElement('div');
        floatingText.textContent = text;
        floatingText.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            font-size: 24px;
            font-weight: bold;
            color: ${color};
            pointer-events: none;
            z-index: 1000;
            animation: floatUp 2s ease-out forwards;
        `;
        
        document.body.appendChild(floatingText);
        
        setTimeout(() => {
            floatingText.remove();
        }, 2000);
    }

    playWinAnimation() {
        document.body.classList.add('win-animation');
        setTimeout(() => {
            document.body.classList.remove('win-animation');
        }, 1000);
    }

    // Game Selection
    selectGame(gameName) {
        this.currentGame = gameName;
        this.loadGame(gameName);
    }

    loadGame(gameName) {
        const mainScreen = document.getElementById('main-screen');
        if (!mainScreen) return;

        mainScreen.innerHTML = '';
        
        switch(gameName) {
            case 'mystery-box':
                this.createMysteryBoxGame(mainScreen);
                break;
            case 'slots':
                this.createSlotsGame(mainScreen);
                break;
            case 'roulette':
                this.createRouletteGame(mainScreen);
                break;
            case 'crash':
                this.createCrashGame(mainScreen);
                break;
            case 'mines':
                this.createMinesGame(mainScreen);
                break;
            case 'towers':
                this.createTowersGame(mainScreen);
                break;
            case 'poker':
                this.createPokerGame(mainScreen);
                break;
            case 'blackjack':
                this.createBlackjackGame(mainScreen);
                break;
            case 'cups':
                this.createCupsGame(mainScreen);
                break;
        }
    }

    setupEventListeners() {
        // Add event listeners for game selection buttons
        const gameButtons = document.querySelectorAll('.game-button');
        gameButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const gameName = e.target.dataset.game;
                this.selectGame(gameName);
            });
        });
    }

    // Game: Mystery Box
    createMysteryBoxGame(container) {
        container.innerHTML = `
            <div class="game-container mystery-box">
                <h2>Mystery Box</h2>
                <div class="mystery-box-content">
                    <div class="box-display">
                        <div class="mystery-box-item" id="unopened-box">
                            <div class="box">🎁</div>
                            <p>Click to open!</p>
                        </div>
                        <div class="mystery-box-item hidden" id="opened-item">
                            <div class="item-icon" id="item-icon"></div>
                            <div class="item-value" id="item-value"></div>
                        </div>
                    </div>
                    <div class="controls">
                        <button class="btn-primary" id="buy-box-btn">Buy Box (50 tokens)</button>
                        <button class="btn-secondary" id="open-box-btn" disabled>Open Box</button>
                    </div>
                </div>
            </div>
        `;

        const buyBtn = document.getElementById('buy-box-btn');
        const openBtn = document.getElementById('open-box-btn');
        const unopenedBox = document.getElementById('unopened-box');
        const openedItem = document.getElementById('opened-item');
        let currentBox = null;

        buyBtn.addEventListener('click', () => {
            if (this.tokens >= 50) {
                this.updateTokens(-50);
                currentBox = this.generateMysteryBoxItem();
                openBtn.disabled = false;
                unopenedBox.style.opacity = '0.5';
            } else {
                alert('Not enough tokens!');
            }
        });

        openBtn.addEventListener('click', () => {
            if (currentBox) {
                unopenedBox.classList.add('hidden');
                openedItem.classList.remove('hidden');
                document.getElementById('item-icon').textContent = currentBox.icon;
                document.getElementById('item-value').textContent = `Value: ${currentBox.value} tokens`;
                this.updateTokens(currentBox.value);
                
                // Animation
                this.playWinAnimation();
                this.showConfetti();
                
                openBtn.disabled = true;
                currentBox = null;
            }
        });
    }

    generateMysteryBoxItem() {
        const items = [
            { icon: '💎', value: 100 },
            { icon: '🥇', value: 75 },
            { icon: '🥈', value: 50 },
            { icon: '🥉', value: 25 },
            { icon: '🍪', value: 10 },
            { icon: '🎁', value: 150 },
            { icon: '🌟', value: 200 },
            { icon: '👑', value: 300 }
        ];
        
        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    }

    // Game: Slots
    createSlotsGame(container) {
        container.innerHTML = `
            <div class="game-container slots">
                <h2>Slot Machine</h2>
                <div class="slots-display">
                    <div class="slot-reel" id="reel1">🍒</div>
                    <div class="slot-reel" id="reel2">🍋</div>
                    <div class="slot-reel" id="reel3">🍊</div>
                </div>
                <div class="controls">
                    <button class="btn-primary" id="spin-btn">Spin (20 tokens)</button>
                    <div class="win-message" id="win-message"></div>
                </div>
            </div>
        `;

        const spinBtn = document.getElementById('spin-btn');
        const reels = [
            document.getElementById('reel1'),
            document.getElementById('reel2'),
            document.getElementById('reel3')
        ];
        const winMessage = document.getElementById('win-message');

        spinBtn.addEventListener('click', () => {
            if (this.tokens >= 20) {
                this.updateTokens(-20);
                this.spinSlots(reels, winMessage);
            } else {
                alert('Not enough tokens!');
            }
        });
    }

    spinSlots(reels, winMessage) {
        winMessage.textContent = '';
        const symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '⭐', '7️⃣', '💎'];
        
        // Animate spinning
        let spins = 0;
        const spinInterval = setInterval(() => {
            reels.forEach(reel => {
                reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            });
            spins++;
            
            if (spins > 20) {
                clearInterval(spinInterval);
                // Final result
                const results = symbols.map(() => 
                    symbols[Math.floor(Math.random() * symbols.length)]
                );
                
                results.forEach((symbol, i) => {
                    reels[i].textContent = symbol;
                });
                
                this.checkSlotsWin(results, winMessage);
            }
        }, 100);
    }

    checkSlotsWin(results, winMessage) {
        let winAmount = 0;
        const [r1, r2, r3] = results;
        
        if (r1 === r2 && r2 === r3) {
            // Jackpot
            winAmount = 200;
            winMessage.textContent = `JACKPOT! ${winAmount} tokens!`;
            winMessage.style.color = '#ffd700';
            this.showConfetti();
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
            // Two matching
            winAmount = 50;
            winMessage.textContent = `Win! ${winAmount} tokens!`;
            winMessage.style.color = '#00ff00';
        } else {
            winMessage.textContent = 'Try again!';
            winMessage.style.color = '#ff0000';
        }
        
        if (winAmount > 0) {
            this.updateTokens(winAmount);
            this.playWinAnimation();
        }
    }

    // Game: Roulette
    createRouletteGame(container) {
        container.innerHTML = `
            <div class="game-container roulette">
                <h2>Roulette</h2>
                <div class="roulette-wheel">
                    <div class="wheel-display" id="wheel-result">0</div>
                </div>
                <div class="betting-options">
                    <div class="bet-option" data-bet="red">Red</div>
                    <div class="bet-option" data-bet="black">Black</div>
                    <div class="bet-option" data-bet="even">Even</div>
                    <div class="bet-option" data-bet="odd">Odd</div>
                </div>
                <div class="controls">
                    <input type="number" id="bet-amount" value="10" min="1" max="${this.tokens}">
                    <button class="btn-primary" id="spin-roulette-btn">Spin</button>
                    <div class="win-message" id="roulette-message"></div>
                </div>
            </div>
        `;

        const spinBtn = document.getElementById('spin-roulette-btn');
        const betAmountInput = document.getElementById('bet-amount');
        const resultDisplay = document.getElementById('wheel-result');
        const message = document.getElementById('roulette-message');
        const betOptions = document.querySelectorAll('.bet-option');

        let selectedBet = 'red';

        betOptions.forEach(option => {
            option.addEventListener('click', () => {
                betOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                selectedBet = option.dataset.bet;
            });
        });

        spinBtn.addEventListener('click', () => {
            const betAmount = parseInt(betAmountInput.value);
            
            if (betAmount > this.tokens) {
                alert('Not enough tokens!');
                return;
            }
            
            this.updateTokens(-betAmount);
            this.spinRoulette(selectedBet, betAmount, resultDisplay, message);
        });
    }

    spinRoulette(selectedBet, betAmount, resultDisplay, message) {
        message.textContent = '';
        
        // Animate spinning
        let spins = 0;
        const spinInterval = setInterval(() => {
            const randomNum = Math.floor(Math.random() * 37);
            resultDisplay.textContent = randomNum;
            spins++;
            
            if (spins > 30) {
                clearInterval(spinInterval);
                
                const result = Math.floor(Math.random() * 37);
                const isEven = result % 2 === 0;
                const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(result);
                
                resultDisplay.textContent = result;
                
                let win = false;
                let winAmount = 0;
                
                switch(selectedBet) {
                    case 'red':
                        win = isRed && result !== 0;
                        winAmount = win ? betAmount * 2 : 0;
                        break;
                    case 'black':
                        win = !isRed && result !== 0;
                        winAmount = win ? betAmount * 2 : 0;
                        break;
                    case 'even':
                        win = isEven && result !== 0;
                        winAmount = win ? betAmount * 2 : 0;
                        break;
                    case 'odd':
                        win = !isEven && result !== 0;
                        winAmount = win ? betAmount * 2 : 0;
                        break;
                }
                
                if (win) {
                    message.textContent = `Win! ${winAmount} tokens!`;
                    message.style.color = '#00ff00';
                    this.updateTokens(winAmount);
                    this.playWinAnimation();
                    this.showConfetti();
                } else {
                    message.textContent = 'Lost!';
                    message.style.color = '#ff0000';
                }
            }
        }, 50);
    }

    // Game: Crash
    createCrashGame(container) {
        container.innerHTML = `
            <div class="game-container crash">
                <h2>Crash Game</h2>
                <div class="crash-display">
                    <div class="multiplier" id="crash-multiplier">1.00x</div>
                </div>
                <div class="controls">
                    <button class="btn-primary" id="bet-crash-btn">Bet (50 tokens)</button>
                    <button class="btn-secondary" id="cashout-btn" disabled>Cash Out</button>
                    <div class="win-message" id="crash-message"></div>
                </div>
            </div>
        `;

        const betBtn = document.getElementById('bet-crash-btn');
        const cashoutBtn = document.getElementById('cashout-btn');
        const multiplierDisplay = document.getElementById('crash-multiplier');
        const message = document.getElementById('crash-message');

        let crashGameActive = false;
        let crashInterval;
        let currentMultiplier = 1.00;
        let crashPoint;

        betBtn.addEventListener('click', () => {
            if (this.tokens >= 50) {
                this.updateTokens(-50);
                crashGameActive = true;
                betBtn.disabled = true;
                cashoutBtn.disabled = false;
                currentMultiplier = 1.00;
                crashPoint = 1.5 + Math.random() * 10; // Random crash point between 1.5x and 11.5x
                
                multiplierDisplay.textContent = `${currentMultiplier.toFixed(2)}x`;
                message.textContent = '';
                
                crashInterval = setInterval(() => {
                    currentMultiplier += 0.05;
                    multiplierDisplay.textContent = `${currentMultiplier.toFixed(2)}x`;
                    
                    if (currentMultiplier >= crashPoint) {
                        clearInterval(crashInterval);
                        crashGameActive = false;
                        betBtn.disabled = false;
                        cashoutBtn.disabled = true;
                        multiplierDisplay.textContent = 'CRASH!';
                        message.textContent = 'Crashed! You lost.';
                        message.style.color = '#ff0000';
                    }
                }, 100);
            } else {
                alert('Not enough tokens!');
            }
        });

        cashoutBtn.addEventListener('click', () => {
            if (crashGameActive) {
                clearInterval(crashInterval);
                crashGameActive = false;
                betBtn.disabled = false;
                cashoutBtn.disabled = true;
                
                const winAmount = Math.floor(50 * currentMultiplier);
                this.updateTokens(winAmount);
                
                message.textContent = `Cashed out at ${currentMultiplier.toFixed(2)}x! Won ${winAmount} tokens!`;
                message.style.color = '#00ff00';
                
                this.playWinAnimation();
                if (currentMultiplier > 3) {
                    this.showConfetti();
                }
            }
        });
    }

    // Game: Mines
    createMinesGame(container) {
        container.innerHTML = `
            <div class="game-container mines">
                <h2>Mines Game</h2>
                <div class="mines-grid" id="mines-grid"></div>
                <div class="controls">
                    <div class="mines-info">
                        <label>Mines: <input type="number" id="mine-count" value="3" min="1" max="15"></label>
                        <button class="btn-primary" id="start-mines-btn">Start Game (20 tokens)</button>
                    </div>
                    <div class="win-message" id="mines-message"></div>
                </div>
            </div>
        `;

        const grid = document.getElementById('mines-grid');
        const startBtn = document.getElementById('start-mines-btn');
        const mineCountInput = document.getElementById('mine-count');
        const message = document.getElementById('mines-message');

        let mines = [];
        let gameStarted = false;
        let safeCells = 0;

        startBtn.addEventListener('click', () => {
            if (this.tokens >= 20) {
                this.updateTokens(-20);
                this.startMinesGame(grid, parseInt(mineCountInput.value), message);
            } else {
                alert('Not enough tokens!');
            }
        });
    }

    startMinesGame(grid, mineCount, message) {
        message.textContent = '';
        grid.innerHTML = '';
        
        // Create 25 cells (5x5 grid)
        const cells = 25;
        const mines = [];
        const safeCells = cells - mineCount;
        let revealedSafe = 0;
        
        // Place mines randomly
        while (mines.length < mineCount) {
            const minePos = Math.floor(Math.random() * cells);
            if (!mines.includes(minePos)) {
                mines.push(minePos);
            }
        }
        
        // Create grid
        for (let i = 0; i < cells; i++) {
            const cell = document.createElement('div');
            cell.className = 'mines-cell';
            cell.dataset.index = i;
            cell.textContent = '?';
            
            cell.addEventListener('click', () => {
                if (!gameStarted) return;
                
                if (mines.includes(i)) {
                    // Mine hit
                    cell.textContent = '💣';
                    cell.style.backgroundColor = '#ff0000';
                    message.textContent = 'Mine hit! Game over.';
                    message.style.color = '#ff0000';
                    gameStarted = false;
                    
                    // Reveal all mines
                    for (let j = 0; j < cells; j++) {
                        if (mines.includes(j)) {
                            const mineCell = document.querySelector(`[data-index="${j}"]`);
                            mineCell.textContent = '💣';
                            mineCell.style.backgroundColor = '#ff0000';
                        }
                    }
                } else {
                    // Safe cell
                    const multiplier = 1 + (revealedSafe * 0.2); // Increase multiplier as more cells are revealed
                    const winAmount = Math.floor(20 * multiplier);
                    
                    cell.textContent = '💎';
                    cell.style.backgroundColor = '#00ff00';
                    revealedSafe++;
                    
                    message.textContent = `Safe! Multiplier: ${multiplier.toFixed(2)}x`;
                    message.style.color = '#00ff00';
                    
                    if (revealedSafe === safeCells) {
                        this.updateTokens(winAmount);
                        message.textContent = `All safe cells revealed! Won ${winAmount} tokens!`;
                        this.playWinAnimation();
                        this.showConfetti();
                        gameStarted = false;
                    }
                }
            });
            
            grid.appendChild(cell);
        }
        
        gameStarted = true;
    }

    // Game: Towers
    createTowersGame(container) {
        container.innerHTML = `
            <div class="game-container towers">
                <h2>Towers</h2>
                <div class="towers-grid" id="towers-grid"></div>
                <div class="controls">
                    <button class="btn-primary" id="start-towers-btn">Start Game (30 tokens)</button>
                    <div class="win-message" id="towers-message"></div>
                </div>
            </div>
        `;

        const grid = document.getElementById('towers-grid');
        const startBtn = document.getElementById('start-towers-btn');
        const message = document.getElementById('towers-message');

        startBtn.addEventListener('click', () => {
            if (this.tokens >= 30) {
                this.updateTokens(-30);
                this.startTowersGame(grid, message);
            } else {
                alert('Not enough tokens!');
            }
        });
    }

    startTowersGame(grid, message) {
        message.textContent = '';
        grid.innerHTML = '';
        
        // Create 3x3 grid with towers
        const towers = [];
        let currentRow = 0;
        
        for (let i = 0; i < 9; i++) {
            if (i % 3 === 0 && i > 0) currentRow++;
            
            const tower = document.createElement('div');
            tower.className = 'tower-cell';
            tower.dataset.row = currentRow;
            tower.dataset.col = i % 3;
            tower.textContent = '🏗️';
            
            // Each tower has a 70% chance of success
            const isSafe = Math.random() < 0.7;
            tower.dataset.safe = isSafe;
            
            tower.addEventListener('click', () => {
                if (tower.dataset.revealed) return;
                
                tower.dataset.revealed = 'true';
                
                if (tower.dataset.safe === 'true') {
                    // Success - reveal reward
                    const reward = 10 + Math.floor(Math.random() * 40); // 10-50 tokens
                    tower.textContent = `💰${reward}`;
                    tower.style.backgroundColor = '#00ff00';
                    
                    // Check if all in row are safe (bonus)
                    const row = parseInt(tower.dataset.row);
                    const rowCells = document.querySelectorAll(`[data-row="${row}"]`);
                    const allRowSafe = Array.from(rowCells).every(cell => 
                        cell.dataset.revealed && cell.dataset.safe === 'true'
                    );
                    
                    if (allRowSafe) {
                        const bonus = 50;
                        this.updateTokens(bonus);
                        message.textContent = `Row bonus! +${bonus} tokens!`;
                        this.playWinAnimation();
                        this.showConfetti();
                    }
                    
                    this.updateTokens(reward);
                } else {
                    // Failure - crash
                    tower.textContent = '💥';
                    tower.style.backgroundColor = '#ff0000';
                    message.textContent = 'Tower collapsed! Game over.';
                    message.style.color = '#ff0000';
                    
                    // Disable all remaining towers
                    document.querySelectorAll('.tower-cell:not([data-revealed])').forEach(cell => {
                        cell.style.opacity = '0.5';
                        cell.style.pointerEvents = 'none';
                    });
                }
            });
            
            grid.appendChild(tower);
        }
    }

    // Game: Poker
    createPokerGame(container) {
        container.innerHTML = `
            <div class="game-container poker">
                <h2>Poker</h2>
                <div class="poker-hands">
                    <div class="hand" id="player-hand">
                        <h3>Your Hand</h3>
                        <div class="cards"></div>
                    </div>
                    <div class="hand" id="dealer-hand">
                        <h3>Dealer's Hand</h3>
                        <div class="cards"></div>
                    </div>
                </div>
                <div class="controls">
                    <button class="btn-primary" id="deal-poker-btn">Deal (25 tokens)</button>
                    <button class="btn-secondary" id="draw-cards-btn" disabled>Draw Cards</button>
                    <div class="win-message" id="poker-message"></div>
                </div>
            </div>
        `;

        const dealBtn = document.getElementById('deal-poker-btn');
        const drawBtn = document.getElementById('draw-cards-btn');
        const playerCards = document.getElementById('player-hand').querySelector('.cards');
        const dealerCards = document.getElementById('dealer-hand').querySelector('.cards');
        const message = document.getElementById('poker-message');

        dealBtn.addEventListener('click', () => {
            if (this.tokens >= 25) {
                this.updateTokens(-25);
                this.dealPokerHand(playerCards, dealerCards, drawBtn, message);
            } else {
                alert('Not enough tokens!');
            }
        });
    }

    dealPokerHand(playerCards, dealerCards, drawBtn, message) {
        message.textContent = '';
        playerCards.innerHTML = '';
        dealerCards.innerHTML = '';
        drawBtn.disabled = false;
        
        // Create deck and deal initial cards
        const deck = this.createPokerDeck();
        const playerHand = this.dealCards(deck, 5);
        const dealerHand = this.dealCards(deck, 5);
        
        // Show player's cards, hide dealer's
        playerHand.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'poker-card';
            cardEl.textContent = card;
            playerCards.appendChild(cardEl);
        });
        
        dealerHand.forEach(() => {
            const cardEl = document.createElement('div');
            cardEl.className = 'poker-card hidden-card';
            cardEl.textContent = '?';
            dealerCards.appendChild(cardEl);
        });
        
        drawBtn.onclick = () => {
            // Reveal dealer's hand
            dealerCards.innerHTML = '';
            dealerHand.forEach(card => {
                const cardEl = document.createElement('div');
                cardEl.className = 'poker-card';
                cardEl.textContent = card;
                dealerCards.appendChild(cardEl);
            });
            
            // Determine winner
            const playerRank = this.evaluatePokerHand(playerHand);
            const dealerRank = this.evaluatePokerHand(dealerHand);
            
            let result = 0;
            if (playerRank.rank > dealerRank.rank) {
                result = 1; // Player wins
            } else if (playerRank.rank < dealerRank.rank) {
                result = -1; // Dealer wins
            } else {
                // Same rank, compare high cards
                if (playerRank.highCard > dealerRank.highCard) result = 1;
                else if (playerRank.highCard < dealerRank.highCard) result = -1;
                else result = 0; // Tie
            }
            
            if (result === 1) {
                const winAmount = 50;
                this.updateTokens(winAmount);
                message.textContent = `You win! ${winAmount} tokens! (${playerRank.name} beats ${dealerRank.name})`;
                message.style.color = '#00ff00';
                this.playWinAnimation();
            } else if (result === -1) {
                message.textContent = `Dealer wins! (${dealerRank.name} beats ${playerRank.name})`;
                message.style.color = '#ff0000';
            } else {
                this.updateTokens(25); // Return bet
                message.textContent = `Tie! Bet returned.`;
                message.style.color = '#ffff00';
            }
            
            drawBtn.disabled = true;
        };
    }

    createPokerDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const deck = [];
        
        for (const suit of suits) {
            for (const rank of ranks) {
                deck.push(`${rank}${suit}`);
            }
        }
        
        // Shuffle deck
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        
        return deck;
    }

    dealCards(deck, count) {
        const cards = [];
        for (let i = 0; i < count; i++) {
            cards.push(deck.pop());
        }
        return cards;
    }

    evaluatePokerHand(hand) {
        // Simplified poker hand evaluation
        const ranks = hand.map(card => {
            const rankStr = card.slice(0, -1);
            if (rankStr === 'A') return 14;
            if (rankStr === 'K') return 13;
            if (rankStr === 'Q') return 12;
            if (rankStr === 'J') return 11;
            return parseInt(rankStr);
        }).sort((a, b) => b - a);
        
        const suits = hand.map(card => card.slice(-1));
        
        // Check for flush
        const isFlush = suits.every(suit => suit === suits[0]);
        
        // Check for straight
        const isStraight = ranks.slice().sort((a, b) => a - b).every((val, i, arr) => 
            i === 0 || val === arr[i-1] + 1
        );
        
        // Check for pairs, three of a kind, etc.
        const rankCounts = {};
        ranks.forEach(rank => {
            rankCounts[rank] = (rankCounts[rank] || 0) + 1;
        });
        
        const counts = Object.values(rankCounts).sort((a, b) => b - a);
        
        // Determine hand rank
        if (isFlush && isStraight && ranks[0] === 14) return { rank: 9, name: 'Royal Flush', highCard: 14 };
        if (isFlush && isStraight) return { rank: 8, name: 'Straight Flush', highCard: ranks[0] };
        if (counts[0] === 4) return { rank: 7, name: 'Four of a Kind', highCard: parseInt(Object.keys(rankCounts).find(k => rankCounts[k] === 4)) };
        if (counts[0] === 3 && counts[1] === 2) return { rank: 6, name: 'Full House', highCard: parseInt(Object.keys(rankCounts).find(k => rankCounts[k] === 3)) };
        if (isFlush) return { rank: 5, name: 'Flush', highCard: ranks[0] };
        if (isStraight) return { rank: 4, name: 'Straight', highCard: ranks[0] };
        if (counts[0] === 3) return { rank: 3, name: 'Three of a Kind', highCard: parseInt(Object.keys(rankCounts).find(k => rankCounts[k] === 3)) };
        if (counts[0] === 2 && counts[1] === 2) return { rank: 2, name: 'Two Pair', highCard: Math.max(...Object.keys(rankCounts).filter(k => rankCounts[k] === 2).map(Number)) };
        if (counts[0] === 2) return { rank: 1, name: 'One Pair', highCard: parseInt(Object.keys(rankCounts).find(k => rankCounts[k] === 2)) };
        return { rank: 0, name: 'High Card', highCard: ranks[0] };
    }

    // Game: Blackjack
    createBlackjackGame(container) {
        container.innerHTML = `
            <div class="game-container blackjack">
                <h2>Blackjack</h2>
                <div class="blackjack-hands">
                    <div class="hand" id="bj-player-hand">
                        <h3>Your Hand (<span id="player-score">0</span>)</h3>
                        <div class="cards"></div>
                    </div>
                    <div class="hand" id="bj-dealer-hand">
                        <h3>Dealer's Hand (<span id="dealer-score">0</span>)</h3>
                        <div class="cards"></div>
                    </div>
                </div>
                <div class="controls">
                    <button class="btn-primary" id="deal-bj-btn">Deal (20 tokens)</button>
                    <button class="btn-secondary" id="hit-btn" disabled>Hit</button>
                    <button class="btn-secondary" id="stand-btn" disabled>Stand</button>
                    <div class="win-message" id="bj-message"></div>
                </div>
            </div>
        `;

        const dealBtn = document.getElementById('deal-bj-btn');
        const hitBtn = document.getElementById('hit-btn');
        const standBtn = document.getElementById('stand-btn');
        const playerCards = document.getElementById('bj-player-hand').querySelector('.cards');
        const dealerCards = document.getElementById('bj-dealer-hand').querySelector('.cards');
        const playerScore = document.getElementById('player-score');
        const dealerScore = document.getElementById('dealer-score');
        const message = document.getElementById('bj-message');

        dealBtn.addEventListener('click', () => {
            if (this.tokens >= 20) {
                this.updateTokens(-20);
                this.dealBlackjackHand(
                    playerCards, dealerCards, 
                    playerScore, dealerScore,
                    hitBtn, standBtn, message
                );
            } else {
                alert('Not enough tokens!');
            }
        });
    }

    dealBlackjackHand(pCards, dCards, pScore, dScore, hitBtn, standBtn, message) {
        message.textContent = '';
        pCards.innerHTML = '';
        dCards.innerHTML = '';
        
        const deck = this.createPokerDeck();
        let playerHand = [this.dealCards(deck, 1)[0], this.dealCards(deck, 1)[0]];
        let dealerHand = [this.dealCards(deck, 1)[0], this.dealCards(deck, 1)[0]];
        
        // Update displays
        this.updateBlackjackDisplay(playerHand, pCards, pScore);
        // Hide dealer's second card initially
        dCards.innerHTML = '';
        const firstCard = document.createElement('div');
        firstCard.className = 'poker-card';
        firstCard.textContent = dealerHand[0];
        dCards.appendChild(firstCard);
        const hiddenCard = document.createElement('div');
        hiddenCard.className = 'poker-card hidden-card';
        hiddenCard.textContent = '?';
        dCards.appendChild(hiddenCard);
        dScore.textContent = this.getBlackjackValue([dealerHand[0]]);

        hitBtn.disabled = false;
        standBtn.disabled = false;

        // Check for blackjack
        const playerBlackjack = this.getBlackjackValue(playerHand) === 21;
        const dealerBlackjack = this.getBlackjackValue(dealerHand) === 21;

        if (playerBlackjack) {
            if (dealerBlackjack) {
                // Both blackjack - tie
                dCards.innerHTML = '';
                dealerHand.forEach(card => {
                    const cardEl = document.createElement('div');
                    cardEl.className = 'poker-card';
                    cardEl.textContent = card;
                    dCards.appendChild(cardEl);
                });
                dScore.textContent = this.getBlackjackValue(dealerHand);
                
                this.updateTokens(20); // Return bet
                message.textContent = 'Both have Blackjack! Tie!';
                hitBtn.disabled = true;
                standBtn.disabled = true;
            } else {
                // Player blackjack
                dCards.innerHTML = '';
                dealerHand.forEach(card => {
                    const cardEl = document.createElement('div');
                    cardEl.className = 'poker-card';
                    cardEl.textContent = card;
                    dCards.appendChild(cardEl);
                });
                dScore.textContent = this.getBlackjackValue(dealerHand);
                
                const winAmount = 30; // 1.5x payout
                this.updateTokens(winAmount);
                message.textContent = `Blackjack! You win ${winAmount} tokens!`;
                message.style.color = '#00ff00';
                this.playWinAnimation();
                hitBtn.disabled = true;
                standBtn.disabled = true;
            }
            return;
        }

        // Hit button functionality
        hitBtn.onclick = () => {
            playerHand.push(this.dealCards(deck, 1)[0]);
            this.updateBlackjackDisplay(playerHand, pCards, pScore);
            
            const playerValue = this.getBlackjackValue(playerHand);
            if (playerValue > 21) {
                message.textContent = 'Bust! You lose.';
                message.style.color = '#ff0000';
                this.endBlackjackGame(playerHand, dealerHand, dCards, dScore, hitBtn, standBtn, message);
            }
        };

        // Stand button functionality
        standBtn.onclick = () => {
            this.endBlackjackGame(playerHand, dealerHand, dCards, dScore, hitBtn, standBtn, message, deck);
        };
    }

    getBlackjackValue(hand) {
        let value = 0;
        let aces = 0;

        for (const card of hand) {
            const rank = card.slice(0, -1);
            if (['J', 'Q', 'K'].includes(rank)) {
                value += 10;
            } else if (rank === 'A') {
                value += 11;
                aces++;
            } else {
                value += parseInt(rank);
            }
        }

        // Adjust for aces if value is over 21
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }

        return value;
    }

    updateBlackjackDisplay(hand, cardContainer, scoreElement) {
        cardContainer.innerHTML = '';
        hand.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'poker-card';
            cardEl.textContent = card;
            cardContainer.appendChild(cardEl);
        });
        scoreElement.textContent = this.getBlackjackValue(hand);
    }

    endBlackjackGame(playerHand, dealerHand, dCards, dScore, hitBtn, standBtn, message, deck) {
        hitBtn.disabled = true;
        standBtn.disabled = true;

        // Reveal dealer's hand
        dCards.innerHTML = '';
        dealerHand.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'poker-card';
            cardEl.textContent = card;
            dCards.appendChild(cardEl);
        });
        dScore.textContent = this.getBlackjackValue(dealerHand);

        // Dealer draws until 17 or higher
        if (this.getBlackjackValue(playerHand) <= 21) {
            while (this.getBlackjackValue(dealerHand) < 17) {
                dealerHand.push(this.dealCards(deck || this.createPokerDeck(), 1)[0]);
                dCards.innerHTML = '';
                dealerHand.forEach(card => {
                    const cardEl = document.createElement('div');
                    cardEl.className = 'poker-card';
                    cardEl.textContent = card;
                    dCards.appendChild(cardEl);
                });
                dScore.textContent = this.getBlackjackValue(dealerHand);
            }
        }

        const playerValue = this.getBlackjackValue(playerHand);
        const dealerValue = this.getBlackjackValue(dealerHand);

        if (playerValue > 21) {
            message.textContent = 'You bust! Dealer wins.';
            message.style.color = '#ff0000';
        } else if (dealerValue > 21) {
            const winAmount = 40;
            this.updateTokens(winAmount);
            message.textContent = `Dealer busts! You win ${winAmount} tokens!`;
            message.style.color = '#00ff00';
            this.playWinAnimation();
        } else if (playerValue > dealerValue) {
            const winAmount = 40;
            this.updateTokens(winAmount);
            message.textContent = `You win ${winAmount} tokens!`;
            message.style.color = '#00ff00';
            this.playWinAnimation();
        } else if (dealerValue > playerValue) {
            message.textContent = 'Dealer wins.';
            message.style.color = '#ff0000';
        } else {
            this.updateTokens(20); // Return bet
            message.textContent = 'Push! Bet returned.';
            message.style.color = '#ffff00';
        }
    }

    // Game: Cups
    createCupsGame(container) {
        container.innerHTML = `
            <div class="game-container cups">
                <h2>Cups Game</h2>
                <div class="cups-display">
                    <div class="cup" data-cup="0">☕</div>
                    <div class="cup" data-cup="1">☕</div>
                    <div class="cup" data-cup="2">☕</div>
                </div>
                <div class="controls">
                    <div class="bet-controls">
                        <label>Place Bet: <input type="number" id="cup-bet" value="15" min="1" max="${this.tokens}"></label>
                        <label>Guess Cup: 
                            <select id="cup-choice">
                                <option value="0">Cup 1</option>
                                <option value="1">Cup 2</option>
                                <option value="2">Cup 3</option>
                            </select>
                        </label>
                    </div>
                    <button class="btn-primary" id="start-cups-btn">Start Game</button>
                    <div class="win-message" id="cups-message"></div>
                </div>
            </div>
        `;

        const startBtn = document.getElementById('start-cups-btn');
        const betInput = document.getElementById('cup-bet');
        const choiceSelect = document.getElementById('cup-choice');
        const message = document.getElementById('cups-message');
        const cups = document.querySelectorAll('.cup');

        startBtn.addEventListener('click', () => {
            const betAmount = parseInt(betInput.value);
            if (betAmount > this.tokens) {
                alert('Not enough tokens!');
                return;
            }
            
            this.updateTokens(-betAmount);
            this.playCupsGame(parseInt(choiceSelect.value), betAmount, cups, message);
        });
    }

    playCupsGame(selectedCup, betAmount, cups, message) {
        message.textContent = '';
        
        // Randomly select winning cup
        const winningCup = Math.floor(Math.random() * 3);
        
        // Animate cups moving
        cups.forEach((cup, i) => {
            cup.textContent = '☕';
            cup.style.transform = 'scale(1)';
            cup.style.transition = 'transform 0.5s';
        });
        
        setTimeout(() => {
            // Check if player won
            if (selectedCup === winningCup) {
                // Player wins
                const winAmount = betAmount * 2;
                this.updateTokens(winAmount);
                message.textContent = `You win ${winAmount} tokens!`;
                message.style.color = '#00ff00';
                
                // Animate winning cup
                cups[winningCup].textContent = '💰';
                cups[winningCup].style.transform = 'scale(1.5)';
                this.playWinAnimation();
                this.showConfetti();
            } else {
                // Player loses
                message.textContent = `You lose! Ball was under cup ${winningCup + 1}.`;
                message.style.color = '#ff0000';
                
                // Show where ball was
                cups[winningCup].textContent = '⚽';
            }
        }, 1000);
    }

    // Utility: Show confetti effect
    showConfetti() {
        // Create confetti elements
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                position: fixed;
                top: 0;
                left: ${Math.random() * 100}vw;
                width: 10px;
                height: 10px;
                background-color: hsl(${Math.random() * 360}, 100%, 50%);
                pointer-events: none;
                z-index: 9999;
                animation: confetti-fall 3s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
    }
}

// Initialize the casino when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.casino = new RobloxCasino();
});

// CSS to be included in your HTML file:
/*
<style>
/* Basic Roblox-style Casino CSS */
body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    color: white;
    margin: 0;
    padding: 0;
    min-height: 100vh;
}

/* Token HUD */
.token-hud {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.7);
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 18px;
    font-weight: bold;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 10px;
}

.token-hud::before {
    content: '🪙';
    font-size: 24px;
}

/* Game layout */
.game-container {
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    margin: 20px;
    backdrop-filter: blur(10px);
    min-height: 500px;
}

.game-container h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #ffd700;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

/* Buttons */
.btn-primary, .btn-secondary {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    margin: 5px;
}

.btn-primary {
    background: linear-gradient(45deg, #ff6b6b, #ff8e53);
    color: white;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
}

.btn-secondary {
    background: linear-gradient(45deg, #4facfe, #00f2fe);
    color: white;
}

.btn-secondary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(79, 172, 254, 0.4);
}

/* Win animation */
@keyframes winAnimation {
    0% { background-color: rgba(255, 255, 255, 0.1); }
    25% { background-color: rgba(255, 215, 0, 0.3); }
    50% { background-color: rgba(0, 255, 0, 0.3); }
    75% { background-color: rgba(255, 215, 0, 0.3); }
    100% { background-color: rgba(255, 255, 255, 0.1); }
}

.win-animation {
    animation: winAnimation 1s ease-in-out;
}

/* Mystery Box */
.mystery-box-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.box-display {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin: 20px 0;
}

.box {
    font-size: 60px;
    cursor: pointer;
    transition: transform 0.3s;
}

.box:hover {
    transform: scale(1.1);
}

.mystery-box-item {
    text-align: center;
}

.item-icon {
    font-size: 80px;
    margin-bottom: 10px;
}

.item-value {
    font-size: 24px;
    font-weight: bold;
    color: gold;
}

/* Slots */
.slots-display {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 30px 0;
}

.slot-reel {
    width: 80px;
    height: 80px;
    background: rgba(0, 0, 0, 0.5);
    border: 3px solid gold;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
}

/* Roulette */
.roulette-wheel {
    text-align: center;
    margin: 30px 0;
}

.wheel-display {
    font-size: 60px;
    background: black;
    padding: 20px;
    border-radius: 10px;
    display: inline-block;
}

.betting-options {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 20px 0;
    flex-wrap: wrap;
}

.bet-option {
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
}

.bet-option.selected {
    background: gold;
    color: black;
    font-weight: bold;
}

.bet-option:hover {
    background: rgba(255, 255, 255, 0.3);
}

/* Crash */
.crash-display {
    text-align: center;
    margin: 30px 0;
}

.multiplier {
    font-size: 60px;
    font-weight: bold;
    color: lime;
    text-shadow: 0 0 10px lime;
}

/* Mines */
.mines-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    max-width: 400px;
    margin: 20px auto;
}

.mines-cell {
    height: 60px;
    background: #4a90e2;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.3s;
}

.mines-cell:hover {
    background: #357abd;
    transform: scale(1.05);
}

/* Towers */
.towers-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    max-width: 300px;
    margin: 20px auto;
}

.tower-cell {
    height: 80px;
    background: #8b4513;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    cursor: pointer;
    transition: all 0.3s;
}

.tower-cell:hover {
    background: #a0522d;
    transform: scale(1.05);
}

/* Poker/Blackjack cards */
.poker-card {
    width: 60px;
    height: 80px;
    background: white;
    color: black;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    margin: 5px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16);
}

.hidden-card {
    background: #1e3a8a;
    color: white;
}

.hand {
    margin: 20px 0;
    text-align: center;
}

.hand h3 {
    margin-bottom: 10px;
    color: #ffd700;
}

.cards {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

/* Cups */
.cups-display {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin: 40px 0;
}

.cup {
    font-size: 60px;
    cursor: pointer;
    transition: all 0.3s;
}

.cup:hover {
    transform: scale(1.1);
}

/* Win message */
.win-message {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    margin-top: 20px;
    min-height: 30px;
}

/* Controls */
.controls {
    text-align: center;
    margin-top: 20px;
}

.bet-controls {
    margin-bottom: 15px;
}

.bet-controls label {
    display: block;
    margin: 5px 0;
}

/* Animations */
@keyframes floatUp {
    0% {
        transform: translateY(0);
        opacity: 1;
    }
    100% {
        transform: translateY(-100px);
        opacity: 0;
    }
}

@keyframes confetti-fall {
    0% {
        transform: translateY(-100px) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
    }
}

/* Responsive */
@media (max-width: 768px) {
    .game-container {
        margin: 10px;
        padding: 15px;
    }
    
    .slot-reel {
        width: 60px;
        height: 60px;
        font-size: 30px;
    }
    
    .poker-card {
        width: 50px;
        height: 70px;
        font-size: 16px;
    }
}
</style>
*/