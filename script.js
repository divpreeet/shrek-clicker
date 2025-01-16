const game = {
    score: 0,
    level: 1,
    clickPower: 1,
    multiplier: 1,
    autoClickerInterval: null,
    autoClickerCount: 0,
    upgradeCosts: {
        clickUpgrade: 10,
        multiplier: 50,
        autoClick: 100,
        megaBoost: 500
    }
};

const elements = {
    score: document.getElementById('score'),
    level: document.getElementById('level'),
    perClick: document.getElementById('per-click'),
    shrek: document.getElementById('shrek'),
    clickUpgrade: document.getElementById('click-upgrade'),
    multiplierUpgrade: document.getElementById('multiplier-upgrade'),
    autoClick: document.getElementById('auto-click'),
    megaBoost: document.getElementById('mega-boost')
};

function updateDisplay() {
    elements.score.textContent = Math.floor(game.score);
    elements.level.textContent = game.level;
    elements.perClick.textContent = (game.clickPower * game.multiplier).toFixed(1);
    
    elements.clickUpgrade.disabled = game.score < game.upgradeCosts.clickUpgrade;
    elements.multiplierUpgrade.disabled = game.score < game.upgradeCosts.multiplier;
    elements.autoClick.disabled = game.score < game.upgradeCosts.autoClick;
    elements.megaBoost.disabled = game.score < game.upgradeCosts.megaBoost;

    elements.clickUpgrade.textContent = `UPGRADE CLICK (${game.upgradeCosts.clickUpgrade})`;
    elements.multiplierUpgrade.textContent = `MULTIPLIER (${game.upgradeCosts.multiplier})`;
    elements.autoClick.textContent = `AUTO CLICKER (${game.upgradeCosts.autoClick})`;
    elements.megaBoost.textContent = `MEGA BOOST (${game.upgradeCosts.megaBoost})`;
}

function createScorePopup(x, y, amount) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = `+${amount.toFixed(1)}`;
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
}

function checkLevelUp() {
    const nextLevel = Math.floor(Math.log10(game.score) / Math.log10(5)) + 1;
    if (nextLevel > game.level) {
        game.level = nextLevel;
        game.multiplier *= 1.2;
        elements.shrek.classList.add('level-up-effect');
        setTimeout(() => elements.shrek.classList.remove('level-up-effect'), 500);
        
        const levelUpText = document.createElement('div');
        levelUpText.className = 'score-popup';
        levelUpText.textContent = `LEVEL UP!`;
        levelUpText.style.left = '50%';
        levelUpText.style.top = '50%';
        levelUpText.style.transform = 'translate(-50%, -50%)';
        levelUpText.style.fontSize = '2rem';
        levelUpText.style.color = '#32CD32';
        document.body.appendChild(levelUpText);
        setTimeout(() => levelUpText.remove(), 1000);
    }
}

elements.shrek.addEventListener('click', (e) => {
    const scoreIncrease = game.clickPower * game.multiplier;
    game.score += scoreIncrease;
    createScorePopup(e.pageX, e.pageY, scoreIncrease);
    checkLevelUp();
    updateDisplay();
});

elements.clickUpgrade.addEventListener('click', () => {
    if (game.score >= game.upgradeCosts.clickUpgrade) {
        game.score -= game.upgradeCosts.clickUpgrade;
        game.clickPower += 1;
        game.upgradeCosts.clickUpgrade = Math.ceil(game.upgradeCosts.clickUpgrade * 1.5);
        updateDisplay();
    }
});

elements.multiplierUpgrade.addEventListener('click', () => {
    if (game.score >= game.upgradeCosts.multiplier) {
        game.score -= game.upgradeCosts.multiplier;
        game.multiplier *= 1.5;
        game.upgradeCosts.multiplier = Math.ceil(game.upgradeCosts.multiplier * 2);
        updateDisplay();
    }
});

elements.autoClick.addEventListener('click', () => {
    if (game.score >= game.upgradeCosts.autoClick) {
        game.score -= game.upgradeCosts.autoClick;
        game.autoClickerCount++;
        game.upgradeCosts.autoClick = Math.ceil(game.upgradeCosts.autoClick * 2);
        
        if (game.autoClickerInterval) clearInterval(game.autoClickerInterval);
        game.autoClickerInterval = setInterval(() => {
            game.score += (game.clickPower * game.multiplier * game.autoClickerCount) / 10;
            checkLevelUp();
            updateDisplay();
        }, 100);
        
        updateDisplay();
    }
});

elements.megaBoost.addEventListener('click', () => {
    if (game.score >= game.upgradeCosts.megaBoost) {
        game.score -= game.upgradeCosts.megaBoost;
        game.clickPower *= 2;
        game.multiplier *= 2;
        game.upgradeCosts.megaBoost = Math.ceil(game.upgradeCosts.megaBoost * 3);
        updateDisplay();
    }
});

updateDisplay();

const backgroundAudio = document.getElementById('background-audio');
const soundToggle = document.getElementById('sound-toggle');

backgroundAudio.volume = 0.2;

function toggleSound() {
    if (backgroundAudio.paused) {
        backgroundAudio.play();
        soundToggle.textContent = 'SOUND: ON';
        soundToggle.setAttribute('aria-pressed', 'false');
    } else {
        backgroundAudio.pause();
        soundToggle.textContent = 'SOUND: OFF';
        soundToggle.setAttribute('aria-pressed', 'true');
    }
}

window.addEventListener('load', () => {
    backgroundAudio.play().catch(error => {
        console.log('Autoplay prevented. User must interact with the document first.');
    });
});


soundToggle.addEventListener('click', toggleSound);