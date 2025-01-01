document.addEventListener('DOMContentLoaded', () => {
    const dice = document.getElementById('dice');
    const rollButton = document.getElementById('rollButton');
    const result = document.getElementById('result');
    const lastRoll = document.getElementById('lastRoll');
    const totalRolls = document.getElementById('totalRolls');
    
    const diceIcons = [
        'fa-dice-one',
        'fa-dice-two',
        'fa-dice-three',
        'fa-dice-four',
        'fa-dice-five',
        'fa-dice-six'
    ];

    let rolls = 0;
    const rollSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3');
    rollSound.volume = 0.3;

    function updateStats(number) {
        rolls++;
        lastRoll.textContent = number;
        totalRolls.textContent = rolls;
    }

    function rollDice() {
        if (rollButton.disabled) return;
        
        // Disable button and start animation
        rollButton.disabled = true;
        dice.classList.add('rolling');
        rollSound.currentTime = 0;
        rollSound.play();
        
        // Clear previous result
        result.textContent = '';
        
        // Simulate rolling animation
        let rollInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * 6);
            dice.innerHTML = `<i class="fas ${diceIcons[randomIndex]}"></i>`;
        }, 100);

        // Stop animation and show final result
        setTimeout(() => {
            clearInterval(rollInterval);
            const finalRoll = Math.floor(Math.random() * 6) + 1;
            dice.innerHTML = `<i class="fas ${diceIcons[finalRoll - 1]}"></i>`;
            
            // Update result with animation
            setTimeout(() => {
                result.textContent = `You rolled a ${finalRoll}!`;
                result.style.animation = 'pulse 0.5s ease';
                updateStats(finalRoll);
            }, 200);

            // Reset animations and enable button
            dice.classList.remove('rolling');
            rollButton.disabled = false;
        }, 1000);
    }

    rollButton.addEventListener('click', rollDice);

    // Add keyboard support
    document.addEventListener('keyup', (e) => {
        if (e.code === 'Space' && !rollButton.disabled) {
            rollDice();
        }
    });
}); 