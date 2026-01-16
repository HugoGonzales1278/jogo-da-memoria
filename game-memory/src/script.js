const emojis = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎹'];
        let cards = [...emojis, ...emojis];
        let flippedCards = [];
        let matchedPairs = 0;
        let moves = 0;
        let timerInterval;
        let seconds = 0;
        let gameStarted = false;

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function startTimer() {
            if (!gameStarted) {
                gameStarted = true;
                timerInterval = setInterval(() => {
                    seconds++;
                    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
                    const secs = (seconds % 60).toString().padStart(2, '0');
                    document.getElementById('timer').textContent = `${mins}:${secs}`;
                }, 1000);
            }
        }

        function stopTimer() {
            clearInterval(timerInterval);
        }

        function createBoard() {
            const gameDiv = document.getElementById('game');
            gameDiv.innerHTML = '';
            const shuffledCards = shuffle(cards);

            shuffledCards.forEach((emoji, index) => {
                const card = document.createElement('div');
                card.className = 'card';
                card.dataset.emoji = emoji;
                card.dataset.index = index;
                
                card.innerHTML = `
                    <div class="card-front">?</div>
                    <div class="card-back">${emoji}</div>
                `;
                
                card.addEventListener('click', flipCard);
                gameDiv.appendChild(card);
            });
        }

        function flipCard() {
            if (!gameStarted) startTimer();
            
            if (flippedCards.length >= 2) return;
            if (this.classList.contains('flipped') || this.classList.contains('matched')) return;

            this.classList.add('flipped');
            flippedCards.push(this);

            if (flippedCards.length === 2) {
                moves++;
                document.getElementById('moves').textContent = moves;
                checkMatch();
            }
        }

        function checkMatch() {
            const [card1, card2] = flippedCards;
            const emoji1 = card1.dataset.emoji;
            const emoji2 = card2.dataset.emoji;

            if (emoji1 === emoji2) {
                setTimeout(() => {
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    matchedPairs++;
                    document.getElementById('matches').textContent = matchedPairs;
                    flippedCards = [];

                    if (matchedPairs === emojis.length) {
                        stopTimer();
                        showWinMessage();
                    }
                }, 600);
            } else {
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    flippedCards = [];
                }, 1000);
            }
        }

        function showWinMessage() {
            const winMsg = document.getElementById('win-msg');
            winMsg.className = 'win-message';
            winMsg.textContent = `🎉 Parabéns! Você venceu em ${moves} movimentos e ${document.getElementById('timer').textContent}!`;
        }

        function resetGame() {
            stopTimer();
            flippedCards = [];
            matchedPairs = 0;
            moves = 0;
            seconds = 0;
            gameStarted = false;
            document.getElementById('moves').textContent = '0';
            document.getElementById('matches').textContent = '0';
            document.getElementById('timer').textContent = '00:00';
            document.getElementById('win-msg').textContent = '';
            createBoard();
        }

        createBoard();