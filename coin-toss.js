document.addEventListener('DOMContentLoaded', () => {
    const coin = document.getElementById('coin');
    const tossButton = document.getElementById('tossButton');
    const predictHeadsButton = document.getElementById('predictHeads');
    const predictTailsButton = document.getElementById('predictTails');
    const resultDisplay = document.getElementById('result');
    const balanceDisplay = document.getElementById('balance');
    const betDisplay = document.getElementById('betAmount');
    const decreaseBetBtn = document.getElementById('decreaseBet');
    const increaseBetBtn = document.getElementById('increaseBet');
    const streakDisplay = document.getElementById('streak');
    const gamesPlayedDisplay = document.getElementById('gamesPlayed');
    const winRateDisplay = document.getElementById('winRate');

    let balance = 1000;
    let currentBet = 10;
    let playerPrediction = null;
    let streak = 0;
    let gamesPlayed = 0;
    let wins = 0;

    const coinSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3');
    const winSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3');
    const bonusSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3');
    coinSound.volume = 0.3;
    winSound.volume = 0.3;
    bonusSound.volume = 0.3;

    function tossCoin() {
        if (balance < currentBet || playerPrediction === null) {
            resultDisplay.textContent = 'Please make a prediction and ensure you have enough balance!';
            return;
        }

        balance -= currentBet;
        balanceDisplay.textContent = balance;
        coinSound.currentTime = 0;
        coinSound.play();

        const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
        coin.style.animation = 'coinFlip 1s ease-out';

        setTimeout(() => {
            coin.style.animation = 'none';
            coin.style.transform = outcome === 'heads' ? 'rotateY(0deg)' : 'rotateY(180deg)';
            resultDisplay.textContent = `It's ${outcome}!`;

            gamesPlayed++;
            gamesPlayedDisplay.textContent = gamesPlayed;

            if (playerPrediction === outcome) {
                balance += currentBet * 2;
                balanceDisplay.textContent = balance;
                winSound.currentTime = 0;
                winSound.play();
                resultDisplay.textContent += ' You win!';
                streak++;
                wins++;
                if (Math.random() < 0.1) triggerBonusRound();
            } else {
                resultDisplay.textContent += ' You lose!';
                streak = 0;
            }

            streakDisplay.textContent = streak;
            winRateDisplay.textContent = ((wins / gamesPlayed) * 100).toFixed(2) + '%';
            playerPrediction = null;
        }, 1000);
    }

    function triggerBonusRound() {
        bonusSound.currentTime = 0;
        bonusSound.play();
        resultDisplay.textContent += ' Bonus Round! Double or Nothing!';
        // Simple bonus round logic: double the winnings if the player wins again
        const bonusOutcome = Math.random() < 0.5 ? 'heads' : 'tails';
        if (playerPrediction === bonusOutcome) {
            balance += currentBet * 2;
            balanceDisplay.textContent = balance;
            resultDisplay.textContent += ' Bonus win!';
        } else {
            resultDisplay.textContent += ' Bonus lose!';
        }
    }

    function clearSelection() {
        predictHeadsButton.classList.remove('selected');
        predictTailsButton.classList.remove('selected');
    }

    tossButton.addEventListener('click', tossCoin);
    predictHeadsButton.addEventListener('click', () => {
        playerPrediction = 'heads';
        resultDisplay.textContent = 'Prediction: Heads';
        clearSelection();
        predictHeadsButton.classList.add('selected');
    });
    predictTailsButton.addEventListener('click', () => {
        playerPrediction = 'tails';
        resultDisplay.textContent = 'Prediction: Tails';
        clearSelection();
        predictTailsButton.classList.add('selected');
    });

    decreaseBetBtn.addEventListener('click', () => {
        if (currentBet > 10) {
            currentBet -= 10;
            betDisplay.textContent = currentBet;
        }
    });

    increaseBetBtn.addEventListener('click', () => {
        if (currentBet < balance) {
            currentBet += 10;
            betDisplay.textContent = currentBet;
        }
    });
}); 