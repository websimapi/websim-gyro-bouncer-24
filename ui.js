import QRCode from 'qrcode';

export const canvas = document.getElementById('game-canvas');
export const replayCanvas = document.getElementById('replay-canvas');
export const replayCtx = replayCanvas.getContext('2d');

export const loadingScreen = document.getElementById('loading-screen');
export const loadingStatus = document.getElementById('loading-status');
export const startScreen = document.getElementById('start-screen');
export const gameOverScreen = document.getElementById('game-over-screen');
export const startButton = document.getElementById('start-button');
export const restartButton = document.getElementById('restart-button');
export const scoreDisplay = document.getElementById('score-display');
export const scoreEl = document.getElementById('score');
export const finalScoreEl = document.getElementById('final-score');
export const highScoreEl = document.getElementById('high-score');
export const jumpPowerIndicator = document.getElementById('jump-power-indicator');
export const jumpPowerBar = document.getElementById('jump-power-bar');

export function setupDesktopUI() {
    document.body.classList.add('is-desktop');
    const qrCanvas = document.getElementById('qr-code');
    if (qrCanvas) {
         QRCode.toCanvas(qrCanvas, 'https://bouncer.on.websim.com', { width: 180, margin: 1 }, function (error) {
            if (error) console.error(error);
            console.log('QR code generated!');
        });
    }
}

export function updateLoadingStatus(text) {
    loadingStatus.textContent = text;
}

export function resizeCanvases() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const replayRect = replayCanvas.getBoundingClientRect();
    replayCanvas.width = replayRect.width * window.devicePixelRatio;
    replayCanvas.height = replayRect.height * window.devicePixelRatio;
}

export function showScreen(state, score = 0, replay) {
    loadingScreen.classList.add('hidden');
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    scoreDisplay.classList.add('hidden');
    jumpPowerIndicator.classList.add('hidden');

    if (state === 'loading') {
        loadingScreen.classList.remove('hidden');
    } else if (state === 'start') {
        startScreen.classList.remove('hidden');
    } else if (state === 'game') {
        scoreDisplay.classList.remove('hidden');
        jumpPowerIndicator.classList.remove('hidden');
    } else if (state === 'over') {
        finalScoreEl.textContent = score;
        let highScore = parseInt(localStorage.getItem('gyroBouncerHighScore')) || 0;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('gyroBouncerHighScore', highScore);
        }
        highScoreEl.textContent = highScore;
        gameOverScreen.classList.remove('hidden');
        resizeCanvases(); // Ensure replay canvas is sized correctly when shown
        if (replay) {
            replay.startPlayback();
        }
    }
}

export function updateScore(score) {
    scoreEl.textContent = score;
}

export function updateJumpIndicator(power) {
    if (!jumpPowerBar) return;
    const normalizedPower = Math.min(Math.max(power, 0), 1); // Clamp power between 0 and 1

    jumpPowerBar.style.transform = `scaleX(${normalizedPower})`;
    jumpPowerBar.style.transformOrigin = 'left'; // Animate from the left

    if (power > 0.75) {
        jumpPowerBar.style.backgroundColor = '#ee6c4d'; // Power jump color
    } else {
        jumpPowerBar.style.backgroundColor = '#e0fbfc'; // Normal color
    }
}

export function flashJumpIndicator() {
     if (!jumpPowerBar) return;
    jumpPowerBar.style.backgroundColor = '#ee6c4d';
    setTimeout(() => {
        if(jumpPowerBar.style.backgroundColor === 'rgb(238, 108, 77)') { // #ee6c4d
             jumpPowerBar.style.backgroundColor = '#e0fbfc';
        }
    }, 200);
}