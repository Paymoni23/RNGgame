document.addEventListener('DOMContentLoaded', () => {
    // Initialize game elements
    const reels = document.querySelectorAll('.reel');
    const spinButton = document.getElementById('spinButton');
    const balanceDisplay = document.getElementById('balance');
    const betDisplay = document.getElementById('betAmount');
    const resultDisplay = document.getElementById('result');
    const totalSpinsDisplay = document.getElementById('totalSpins');
    const biggestWinDisplay = document.getElementById('biggestWin');
    const decreaseBetBtn = document.getElementById('decreaseBet');
    const increaseBetBtn = document.getElementById('increaseBet');

    // Game state
    let balance = 1000;
    let currentBet = 10;
    let isSpinning = false;
    let totalSpins = 0;
    let biggestWin = 0;

    // Sound effects
    const spinSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3');
    const winSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3');
    spinSound.volume = 0.3;
    winSound.volume = 0.3;

    // Initialize reels with numbers
    function initializeReels() {
        reels.forEach(reel => {
            const container = reel.querySelector('.number-container');
            for (let i = 1; i <= 9; i++) {
                const number = document.createElement('div');
                number.className = 'number';
                number.textContent = i;
                container.appendChild(number);
            }
        });
    }

    // Bet controls
    decreaseBetBtn.addEventListener('click', () => {
        if (currentBet > 10 && !isSpinning) {
            currentBet -= 10;
            betDisplay.textContent = currentBet;
        }
    });

    increaseBetBtn.addEventListener('click', () => {
        if (currentBet < balance && !isSpinning) {
            currentBet += 10;
            betDisplay.textContent = currentBet;
        }
    });

    // Spin function
    function spin() {
        if (isSpinning || balance < currentBet) return;

        isSpinning = true;
        spinButton.disabled = true;
        balance -= currentBet;
        balanceDisplay.textContent = balance;
        totalSpins++;
        totalSpinsDisplay.textContent = totalSpins;
        resultDisplay.textContent = '';
        
        // Play spin sound
        spinSound.currentTime = 0;
        spinSound.play();

        // Add spinning animation to reels with different speeds and durations
        const spinDurations = [2000, 2500, 3000]; // Different duration for each reel
        const finalNumbers = [];

        reels.forEach((reel, index) => {
            const container = reel.querySelector('.number-container');
            container.style.transition = 'none';
            container.classList.add('spinning');

            // Variable speed during spin
            let currentSpeed = 0.1;
            const maxSpeed = 0.2;
            const acceleration = 0.01;
            
            // Spinning interval with variable speed
            let spinInterval = setInterval(() => {
                if (currentSpeed < maxSpeed) {
                    currentSpeed += acceleration;
                }
                container.style.animationDuration = `${currentSpeed}s`;
            }, 100);

            // Stop spinning with deceleration
            setTimeout(() => {
                clearInterval(spinInterval);
                container.classList.remove('spinning');
                
                // Add deceleration effect
                container.style.transition = `transform 0.5s cubic-bezier(0.5, 0, 0.5, 1)`;
                
                // Generate random number and calculate final position
                const randomNumber = Math.floor(Math.random() * 9) + 1;
                finalNumbers[index] = randomNumber;
                
                // Add stop flash effect
                reel.classList.add('reel-stop-flash');
                setTimeout(() => reel.classList.remove('reel-stop-flash'), 300);
                
                // Position the reel
                container.style.transform = `translateY(${-(randomNumber - 1) * 170}px)`;

                // Play stop sound
                if (index === reels.length - 1) {
                    setTimeout(() => {
                        evaluateWin(finalNumbers);
                    }, 500);
                }
            }, spinDurations[index]);
        });
    }

    // Evaluate win function
    function evaluateWin(numbers) {
        const sum = numbers.reduce((a, b) => a + b, 0);
        let multiplier = 0;
        let winMessage = '';

        // New sum-based winning conditions
        if (sum >= 20) {
            multiplier = 8;
            winMessage = `Amazing! Sum of ${sum}! 🎰`;
        } else if (sum >= 15) {
            multiplier = 5;
            winMessage = `Great! Sum of ${sum}! 🎯`;
        } else if (sum >= 10) {
            multiplier = 3;
            winMessage = `Nice! Sum of ${sum}! 🎲`;
        } else if (sum >= 5) {
            multiplier = 1.5;
            winMessage = `Good! Sum of ${sum}! 🎮`;
        } else {
            multiplier = 0.5;
            winMessage = `Consolation! Sum of ${sum}! 🎱`;
        }

        const winAmount = Math.floor(currentBet * multiplier);
        
        balance += winAmount;
        winSound.currentTime = 0;
        winSound.play();
        resultDisplay.innerHTML = `${winMessage}<br>You won ${winAmount}!`;
        resultDisplay.classList.add('win-animation');
        
        if (winAmount > biggestWin) {
            biggestWin = winAmount;
            biggestWinDisplay.textContent = biggestWin;
        }

        balanceDisplay.textContent = balance;
        isSpinning = false;
        spinButton.disabled = false;
    }

    // Helper function to check if numbers are sequential
    function isSequential(numbers) {
        const sorted = [...numbers].sort((a, b) => a - b);
        return sorted.every((num, i) => i === 0 || num === sorted[i - 1] + 1);
    }

    // Event listeners
    spinButton.addEventListener('click', spin);

    // Initialize the game
    initializeReels();

    // Add elastic bounce effect when revealing final numbers
    function revealFinalNumber(container, number) {
        return new Promise(resolve => {
            container.style.transition = 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            container.style.transform = `translateY(${-(number - 1) * 170}px)`;
            setTimeout(resolve, 800);
        });
    }

    // Enhance win animation
    function enhanceWinAnimation(winAmount) {
        const result = document.getElementById('result');
        result.style.animation = 'none';
        result.offsetHeight; // Trigger reflow
        result.style.animation = 'winPulse 1.5s ease infinite';
        
        // Add particles for big wins
        if (winAmount > currentBet * 3) {
            createWinParticles();
        }
    }

    // Create particle effects for big wins
    function createWinParticles() {
        const particles = 30;
        const container = document.querySelector('.slot-machine');
        
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.className = 'win-particle';
            particle.style.setProperty('--angle', `${(360 / particles) * i}deg`);
            container.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => particle.remove(), 2000);
        }
    }
}); 