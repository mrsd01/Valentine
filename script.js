// Elements
const character = document.getElementById('character');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const celebration = document.getElementById('celebration');
const heartsBg = document.querySelector('.hearts-bg');
const mouth = document.querySelector('.mouth');

// Detect mobile device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || window.innerWidth <= 768;

// Add tears to character
const tearLeft = document.createElement('div');
tearLeft.className = 'tear left';
const tearRight = document.createElement('div');
tearRight.className = 'tear right';
character.appendChild(tearLeft);
character.appendChild(tearRight);

// Create floating hearts background (fewer on mobile for performance)
function createFloatingHearts() {
    const hearts = ['💕', '💖', '💗', '💓', '💝', '❤️', '💘'];
    const interval = isMobile ? 500 : 300; // Slower on mobile
    
    setInterval(() => {
        // Limit total hearts on screen for mobile performance
        if (isMobile && heartsBg.children.length > 15) return;
        if (!isMobile && heartsBg.children.length > 30) return;
        
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (4 + Math.random() * 4) + 's';
        heart.style.fontSize = isMobile ? (12 + Math.random() * 15) + 'px' : (15 + Math.random() * 20) + 'px';
        heartsBg.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 8000);
    }, interval);
}

createFloatingHearts();

// Shared function to update character state based on position
function updateCharacterState(posX, posY) {
    // Get button positions
    const noBtnRect = noBtn.getBoundingClientRect();
    const yesBtnRect = yesBtn.getBoundingClientRect();
    
    // Calculate distance to No button
    const noBtnCenterX = noBtnRect.left + noBtnRect.width / 2;
    const noBtnCenterY = noBtnRect.top + noBtnRect.height / 2;
    const distanceToNo = Math.sqrt(
        Math.pow(posX - noBtnCenterX, 2) + 
        Math.pow(posY - noBtnCenterY, 2)
    );
    
    // Calculate distance to Yes button
    const yesBtnCenterX = yesBtnRect.left + yesBtnRect.width / 2;
    const yesBtnCenterY = yesBtnRect.top + yesBtnRect.height / 2;
    const distanceToYes = Math.sqrt(
        Math.pow(posX - yesBtnCenterX, 2) + 
        Math.pow(posY - yesBtnCenterY, 2)
    );
    
    // Adjust thresholds for mobile (larger touch areas)
    const noThreshold = isMobile ? 120 : 150;
    const noPanicThreshold = isMobile ? 60 : 80;
    const yesThreshold = isMobile ? 120 : 150;
    
    // Update character based on proximity
    if (distanceToNo < noThreshold) {
        // Getting close to No - character gets upset
        character.classList.remove('happy');
        character.classList.add('upset');
        
        if (distanceToNo < noPanicThreshold) {
            character.classList.add('panic');
            mouth.className = 'mouth crying';
        } else {
            character.classList.remove('panic');
            mouth.className = 'mouth sad';
        }
    } else if (distanceToYes < yesThreshold) {
        // Getting close to Yes - character gets happy
        character.classList.remove('upset', 'panic');
        character.classList.add('happy');
        mouth.className = 'mouth happy';
    } else {
        // Neutral state
        character.classList.remove('upset', 'happy', 'panic');
        mouth.className = 'mouth happy';
    }
    
    // Make pupils follow position
    const pupils = document.querySelectorAll('.pupil');
    pupils.forEach(pupil => {
        const eye = pupil.parentElement;
        const eyeRect = eye.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;
        
        const angle = Math.atan2(posY - eyeCenterY, posX - eyeCenterX);
        const maxPupilMove = isMobile ? 3 : 5;
        const distance = Math.min(maxPupilMove, Math.sqrt(
            Math.pow(posX - eyeCenterX, 2) + 
            Math.pow(posY - eyeCenterY, 2)
        ) / 20);
        
        const pupilX = Math.cos(angle) * distance;
        const pupilY = Math.sin(angle) * distance;
        
        pupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
    });
}

// Track mouse position relative to buttons (desktop)
document.addEventListener('mousemove', (e) => {
    updateCharacterState(e.clientX, e.clientY);
});

// No button escape behavior
let escapeCount = 0;
const maxEscapes = 5;
const messages = [
    "No 💔",
    "Are you sure? 🥺",
    "Please? 🥹",
    "Pretty please? 😢",
    "I'll be sad... 😭",
    "NOOOO! 😱"
];

noBtn.addEventListener('mouseenter', () => {
    escapeButton();
});

noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    escapeButton();
});

function escapeButton() {
    escapeCount++;
    
    // Update button text
    if (escapeCount < messages.length) {
        noBtn.textContent = messages[escapeCount];
    }
    
    // Get viewport dimensions (accounting for mobile safe areas)
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Get button dimensions
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;
    
    // Calculate safe boundaries with more padding on mobile
    const padding = isMobile ? 10 : 20;
    const topPadding = isMobile ? 50 : 20; // Extra top padding for mobile status bar
    const maxX = viewportWidth - btnWidth - padding;
    const maxY = viewportHeight - btnHeight - padding;
    
    // Generate random position
    let newX = padding + Math.random() * (maxX - padding);
    let newY = topPadding + Math.random() * (maxY - topPadding);
    
    // Make sure it's not too close to the Yes button
    const yesBtnRect = yesBtn.getBoundingClientRect();
    const minDistance = isMobile ? 100 : 150;
    
    let attempts = 0;
    while (attempts < 15) {
        const distance = Math.sqrt(
            Math.pow(newX - yesBtnRect.left, 2) + 
            Math.pow(newY - yesBtnRect.top, 2)
        );
        
        if (distance > minDistance) break;
        
        newX = padding + Math.random() * (maxX - padding);
        newY = topPadding + Math.random() * (maxY - topPadding);
        attempts++;
    }
    
    // Apply new position with smooth transition on mobile
    noBtn.style.position = 'fixed';
    noBtn.style.transition = isMobile ? 'left 0.15s ease, top 0.15s ease' : 'none';
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
    noBtn.style.zIndex = '50';
    
    // Make the Yes button bigger over time (smaller increments on mobile)
    const scaleIncrement = isMobile ? 0.08 : 0.1;
    const maxScale = isMobile ? 1.5 : 2;
    const currentScale = Math.min(1 + (escapeCount * scaleIncrement), maxScale);
    yesBtn.style.transform = `scale(${currentScale})`;
    
    // Add shake animation to character
    character.classList.add('panic');
    setTimeout(() => {
        if (!character.classList.contains('upset')) {
            character.classList.remove('panic');
        }
    }, 500);
    
    // Vibrate on mobile for feedback (if supported)
    if (isMobile && navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// Yes button click - CELEBRATE!
yesBtn.addEventListener('click', () => {
    celebrate();
});

function celebrate() {
    celebration.classList.add('show');
    
    // Vibrate on mobile for celebration feedback
    if (isMobile && navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
    }
    
    // Create confetti (fewer on mobile for performance)
    const shapes = ['❤️', '💕', '💖', '💗', '✨', '🎉', '🎊', '💝'];
    const confettiCount = isMobile ? 50 : 100;
    const confettiDelay = isMobile ? 80 : 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.fontSize = isMobile ? (12 + Math.random() * 18) + 'px' : (15 + Math.random() * 25) + 'px';
            confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }, i * confettiDelay);
    }
    
    // Play celebration sound effect (if browser allows)
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        
        notes.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = freq;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            }, index * 150);
        });
    } catch (e) {
        // Audio not supported, continue without sound
    }
}

// Enhanced touch support for mobile
let lastTouchTime = 0;

noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Debounce rapid touches
    const now = Date.now();
    if (now - lastTouchTime < 200) return;
    lastTouchTime = now;
    
    escapeButton();
}, { passive: false });

noBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
}, { passive: false });

yesBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    yesBtn.style.transform = 'scale(1.3)';
}, { passive: false });

yesBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    celebrate();
}, { passive: false });

// Prevent selecting the No button text
noBtn.style.userSelect = 'none';
noBtn.style.webkitUserSelect = 'none';

// Handle touch move for character reactions on mobile
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateCharacterState(touch.clientX, touch.clientY);
    }
}, { passive: true });

document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateCharacterState(touch.clientX, touch.clientY);
    }
}, { passive: true });

// Prevent double-tap zoom on buttons
document.addEventListener('dblclick', (e) => {
    if (e.target === noBtn || e.target === yesBtn) {
        e.preventDefault();
    }
});

// Handle orientation change
window.addEventListener('orientationchange', () => {
    // Reset No button position on orientation change
    if (noBtn.style.position === 'fixed') {
        setTimeout(() => {
            escapeButton();
        }, 100);
    }
});

// Handle resize for desktop/tablet
window.addEventListener('resize', () => {
    // Ensure No button stays in viewport after resize
    if (noBtn.style.position === 'fixed') {
        const rect = noBtn.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        if (rect.right > viewportWidth || rect.bottom > viewportHeight || rect.left < 0 || rect.top < 0) {
            escapeButton();
        }
    }
});
