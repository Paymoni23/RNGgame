document.addEventListener('DOMContentLoaded', () => {
    // Game card click handlers
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('click', () => {
            const gameType = card.dataset.game;
            launchGame(gameType);
        });
    });

    // Random number generator function
    function generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Launch game function
    function launchGame(gameType) {
        switch(gameType) {
            case 'dice':
                const diceResult = generateRandomNumber(1, 6);
                alert(`You rolled a ${diceResult}!`);
                break;
            case 'wheel':
                const wheelResult = generateRandomNumber(1, 360);
                alert(`Wheel stopped at ${wheelResult} degrees!`);
                break;
            case 'cards':
                const cardResult = generateRandomNumber(1, 52);
                alert(`You drew card number ${cardResult}!`);
                break;
        }
    }

    // Animation for the CTA button
    const ctaButton = document.querySelector('.cta-btn');
    ctaButton.addEventListener('mouseover', () => {
        ctaButton.style.transform = 'scale(1.1)';
    });
    ctaButton.addEventListener('mouseout', () => {
        ctaButton.style.transform = 'scale(1)';
    });
}); 