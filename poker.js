document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM elements
    const playerCards = document.getElementById('playerCards');
    const communityCards = document.getElementById('communityCards');
    const dealButton = document.getElementById('dealButton');
    const result = document.getElementById('result');
    const handRank = document.getElementById('handRank');
    const handsPlayed = document.getElementById('handsPlayed');
    const bestHand = document.getElementById('bestHand');

    // Initialize deck
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let deck = [];

    // Sound effect
    const cardSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3');
    cardSound.volume = 0.3;

    function createDeck() {
        deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value });
            }
        }
        shuffleDeck();
    }

    function shuffleDeck() {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function createCardElement(card, isHidden = false) {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${isHidden ? 'hidden' : ''}`;
        
        if (isHidden) {
            // Create and add eye emoji
            const eyeEmoji = document.createElement('div');
            eyeEmoji.className = 'eye-emoji';
            eyeEmoji.textContent = '👁️';
            cardElement.appendChild(eyeEmoji);
            
            // Add click handler for hidden cards
            cardElement.addEventListener('click', function() {
                if (this.classList.contains('hidden')) {
                    if (this === communityCards.children[3]) {
                        revealFourthCard();
                    } else if (this === communityCards.children[4]) {
                        revealFifthCard();
                    }
                }
            });
        } else {
            cardElement.classList.add(['♥', '♦'].includes(card.suit) ? 'red' : 'black');
            
            const topRank = document.createElement('div');
            topRank.className = 'card-rank top';
            topRank.textContent = card.value;

            const bottomRank = document.createElement('div');
            bottomRank.className = 'card-rank bottom';
            bottomRank.textContent = card.value;

            const centerSuit = document.createElement('div');
            centerSuit.className = 'card-suit';
            centerSuit.textContent = card.suit;

            cardElement.appendChild(topRank);
            cardElement.appendChild(centerSuit);
            cardElement.appendChild(bottomRank);
        }
        
        return cardElement;
    }

    function playCardSound() {
        cardSound.currentTime = 0;
        cardSound.play();
    }

    function dealNewHand() {
        console.log('Dealing new hand...'); // Debug log
        createDeck();
        playerCards.innerHTML = '';
        communityCards.innerHTML = '';
        result.textContent = '';
        handRank.textContent = '';

        // Deal player cards
        for (let i = 0; i < 2; i++) {
            const card = deck.pop();
            playerCards.appendChild(createCardElement(card));
            playCardSound();
        }

        // Deal first three community cards
        for (let i = 0; i < 3; i++) {
            const card = deck.pop();
            communityCards.appendChild(createCardElement(card));
            playCardSound();
        }

        // Add hidden fourth and fifth cards
        communityCards.appendChild(createCardElement(null, true));
        communityCards.appendChild(createCardElement(null, true));

        if (handsPlayed) {
            handsPlayed.textContent = parseInt(handsPlayed.textContent) + 1;
        }
    }

    function revealFourthCard() {
        const fourthCard = deck.pop();
        const cardElement = communityCards.children[3];
        
        cardElement.classList.add('reveal');
        playCardSound();
        
        setTimeout(() => {
            cardElement.innerHTML = '';
            cardElement.classList.remove('hidden');
            cardElement.classList.add(['♥', '♦'].includes(fourthCard.suit) ? 'red' : 'black');
            
            const topRank = document.createElement('div');
            topRank.className = 'card-rank top';
            topRank.textContent = fourthCard.value;

            const bottomRank = document.createElement('div');
            bottomRank.className = 'card-rank bottom';
            bottomRank.textContent = fourthCard.value;

            const centerSuit = document.createElement('div');
            centerSuit.className = 'card-suit';
            centerSuit.textContent = fourthCard.suit;

            cardElement.appendChild(topRank);
            cardElement.appendChild(centerSuit);
            cardElement.appendChild(bottomRank);
            
            evaluateHand(); // Evaluate hand after revealing card
        }, 300);
    }

    function revealFifthCard() {
        const fifthCard = deck.pop();
        const cardElement = communityCards.children[4];
        
        cardElement.classList.add('reveal');
        playCardSound();
        
        setTimeout(() => {
            cardElement.innerHTML = '';
            cardElement.classList.remove('hidden');
            cardElement.classList.add(['♥', '♦'].includes(fifthCard.suit) ? 'red' : 'black');
            
            const topRank = document.createElement('div');
            topRank.className = 'card-rank top';
            topRank.textContent = fifthCard.value;

            const bottomRank = document.createElement('div');
            bottomRank.className = 'card-rank bottom';
            bottomRank.textContent = fifthCard.value;

            const centerSuit = document.createElement('div');
            centerSuit.className = 'card-suit';
            centerSuit.textContent = fifthCard.suit;

            cardElement.appendChild(topRank);
            cardElement.appendChild(centerSuit);
            cardElement.appendChild(bottomRank);
            
            evaluateHand(); // Evaluate hand after revealing card
        }, 300);
    }

    // Add click event listener for the deal button
    dealButton.addEventListener('click', dealNewHand);

    // Initial deal
    dealNewHand();

    function evaluateHand() {
        // Clear previous highlights
        clearHighlights();
        
        // Get all visible cards with their DOM elements
        const allCards = [];
        const cardElements = [];
        
        // Add player's hole cards
        Array.from(playerCards.children).forEach(cardElement => {
            const rankElement = cardElement.querySelector('.card-rank');
            const suitElement = cardElement.querySelector('.card-suit');
            if (rankElement && suitElement) {
                allCards.push({
                    value: rankElement.textContent,
                    suit: suitElement.textContent,
                    element: cardElement
                });
                cardElements.push(cardElement);
            }
        });
        
        // Add visible community cards
        Array.from(communityCards.children).forEach(cardElement => {
            if (!cardElement.classList.contains('hidden')) {
                const rankElement = cardElement.querySelector('.card-rank');
                const suitElement = cardElement.querySelector('.card-suit');
                if (rankElement && suitElement) {
                    allCards.push({
                        value: rankElement.textContent,
                        suit: suitElement.textContent,
                        element: cardElement
                    });
                    cardElements.push(cardElement);
                }
            }
        });

        const handRanking = findBestHand(allCards);
        displayHandResult(handRanking);
        
        // Highlight the cards that make up the best hand
        if (handRanking.cards) {
            highlightCards(handRanking.cards);
        }
    }

    function clearHighlights() {
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => {
            card.classList.remove('winning-card');
        });
    }

    function highlightCards(cards) {
        cards.forEach(card => {
            if (card.element) {
                card.element.classList.add('winning-card');
            }
        });
    }

    function findBestHand(cards) {
        if (cards.length < 5) {
            return { rank: 'Waiting for more cards...', score: 0 };
        }

        // Check for each hand ranking and return the cards involved
        if (hasRoyalFlush(cards)) 
            return { rank: 'Royal Flush! 🎰', score: 10, cards: getRoyalFlushCards(cards) };
        if (hasStraightFlush(cards)) 
            return { rank: 'Straight Flush! 🔥', score: 9, cards: getStraightFlushCards(cards) };
        if (hasFourOfAKind(cards)) 
            return { rank: 'Four of a Kind! 🎲', score: 8, cards: getFourOfAKindCards(cards) };
        if (hasFullHouse(cards)) 
            return { rank: 'Full House! 🏠', score: 7, cards: getFullHouseCards(cards) };
        if (hasFlush(cards)) 
            return { rank: 'Flush! 💫', score: 6, cards: getFlushCards(cards) };
        if (hasStraight(cards)) 
            return { rank: 'Straight! ➡️', score: 5, cards: getStraightCards(cards) };
        if (hasThreeOfAKind(cards)) 
            return { rank: 'Three of a Kind! 🎯', score: 4, cards: getThreeOfAKindCards(cards) };
        if (hasTwoPair(cards)) 
            return { rank: 'Two Pair! 👥', score: 3, cards: getTwoPairCards(cards) };
        if (hasOnePair(cards)) 
            return { rank: 'One Pair! 🎭', score: 2, cards: getOnePairCards(cards) };
        return { rank: 'High Card 🃏', score: 1, cards: getHighCardCards(cards) };
    }

    function displayHandResult(handRanking) {
        const handRankElement = document.getElementById('handRank');
        handRankElement.textContent = handRanking.rank;
        
        // Update best hand if current hand is better
        const bestHandElement = document.getElementById('bestHand');
        if (!bestHandElement.dataset.score || 
            parseInt(bestHandElement.dataset.score) < handRanking.score) {
            bestHandElement.textContent = handRanking.rank;
            bestHandElement.dataset.score = handRanking.score;
        }
    }

    // Helper functions for checking hand rankings
    function hasRoyalFlush(cards) {
        const flush = hasFlush(cards);
        if (!flush) return false;
        
        const royalValues = ['10', 'J', 'Q', 'K', 'A'];
        const flushCards = cards.filter(card => card.suit === flush.suit);
        return royalValues.every(value => 
            flushCards.some(card => card.value === value)
        );
    }

    function hasStraightFlush(cards) {
        const flush = hasFlush(cards);
        if (!flush) return false;
        
        const flushCards = cards.filter(card => card.suit === flush.suit);
        return hasStraight(flushCards);
    }

    function hasFourOfAKind(cards) {
        const counts = getValueCounts(cards);
        return Object.values(counts).some(count => count === 4);
    }

    function hasFullHouse(cards) {
        const counts = getValueCounts(cards);
        const values = Object.values(counts);
        return values.includes(3) && values.includes(2);
    }

    function hasFlush(cards) {
        const suitCounts = {};
        cards.forEach(card => {
            suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
        });
        
        for (const [suit, count] of Object.entries(suitCounts)) {
            if (count >= 5) return { suit };
        }
        return false;
    }

    function hasStraight(cards) {
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const cardValues = [...new Set(cards.map(card => card.value))].sort(
            (a, b) => values.indexOf(a) - values.indexOf(b)
        );
        
        for (let i = 0; i <= cardValues.length - 5; i++) {
            const straight = cardValues.slice(i, i + 5);
            if (straight.length === 5) {
                const indexes = straight.map(v => values.indexOf(v));
                if (indexes[4] - indexes[0] === 4) return true;
            }
        }
        return false;
    }

    function hasThreeOfAKind(cards) {
        const counts = getValueCounts(cards);
        return Object.values(counts).some(count => count === 3);
    }

    function hasTwoPair(cards) {
        const counts = getValueCounts(cards);
        const pairs = Object.values(counts).filter(count => count === 2);
        return pairs.length >= 2;
    }

    function hasOnePair(cards) {
        const counts = getValueCounts(cards);
        return Object.values(counts).some(count => count === 2);
    }

    function getValueCounts(cards) {
        const counts = {};
        cards.forEach(card => {
            counts[card.value] = (counts[card.value] || 0) + 1;
        });
        return counts;
    }

    // Helper functions to get the cards involved in each hand type
    function getRoyalFlushCards(cards) {
        const flush = hasFlush(cards);
        if (!flush) return [];
        
        const royalValues = ['10', 'J', 'Q', 'K', 'A'];
        const flushCards = cards.filter(card => card.suit === flush.suit);
        return flushCards.filter(card => royalValues.includes(card.value));
    }

    function getStraightFlushCards(cards) {
        const flush = hasFlush(cards);
        if (!flush) return [];
        
        const flushCards = cards.filter(card => card.suit === flush.suit);
        return getStraightCards(flushCards);
    }

    function getFourOfAKindCards(cards) {
        const counts = getValueCounts(cards);
        const value = Object.entries(counts).find(([_, count]) => count === 4)?.[0];
        return value ? cards.filter(card => card.value === value) : [];
    }

    function getFullHouseCards(cards) {
        const counts = getValueCounts(cards);
        const three = Object.entries(counts).find(([_, count]) => count === 3)?.[0];
        const two = Object.entries(counts).find(([v, count]) => count === 2 && v !== three)?.[0];
        return cards.filter(card => card.value === three || card.value === two);
    }

    function getFlushCards(cards) {
        const flush = hasFlush(cards);
        if (!flush) return [];
        return cards.filter(card => card.suit === flush.suit).slice(0, 5);
    }

    function getStraightCards(cards) {
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const cardValues = [...new Set(cards.map(card => card.value))].sort(
            (a, b) => values.indexOf(a) - values.indexOf(b)
        );
        
        for (let i = 0; i <= cardValues.length - 5; i++) {
            const straight = cardValues.slice(i, i + 5);
            if (straight.length === 5) {
                const indexes = straight.map(v => values.indexOf(v));
                if (indexes[4] - indexes[0] === 4) {
                    return cards.filter(card => straight.includes(card.value)).slice(0, 5);
                }
            }
        }
        return [];
    }

    function getThreeOfAKindCards(cards) {
        const counts = getValueCounts(cards);
        const value = Object.entries(counts).find(([_, count]) => count === 3)?.[0];
        return value ? cards.filter(card => card.value === value) : [];
    }

    function getTwoPairCards(cards) {
        const counts = getValueCounts(cards);
        const pairs = Object.entries(counts).filter(([_, count]) => count === 2);
        if (pairs.length < 2) return [];
        return cards.filter(card => pairs.some(([v, _]) => card.value === v));
    }

    function getOnePairCards(cards) {
        const counts = getValueCounts(cards);
        const value = Object.entries(counts).find(([_, count]) => count === 2)?.[0];
        return value ? cards.filter(card => card.value === value) : [];
    }

    function getHighCardCards(cards) {
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        return [cards.sort((a, b) => values.indexOf(b.value) - values.indexOf(a.value))[0]];
    }
});