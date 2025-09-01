// JavaScript для сайта слепых людей
document.addEventListener('DOMContentLoaded', function() {
    
    // Создаем аудио контекст для звуковых эффектов
    let audioContext;
    
    // Инициализация аудио контекста при первом взаимодействии
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Функция для создания звукового сигнала
    function playBeep(frequency = 440, duration = 200, volume = 0.1) {
        initAudio();
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    }

    // Звуки для разных элементов
    const sounds = {
        header: () => playBeep(800, 300, 0.1),
        h2: () => playBeep(600, 200, 0.08),
        p: () => playBeep(400, 150, 0.06),
        li: () => playBeep(500, 100, 0.05),
        braille: () => playBeep(300, 400, 0.12),
        button: () => playBeep(1000, 250, 0.15),
        blockquote: () => playBeep(350, 300, 0.08)
    };

    // Добавляем звуковые эффекты к элементам
    function addSoundEffects() {
        // Заголовки
        document.querySelectorAll('h1, header').forEach(el => {
            el.addEventListener('mouseenter', sounds.header);
        });

        document.querySelectorAll('h2').forEach(el => {
            el.addEventListener('mouseenter', sounds.h2);
        });

        // Параграфы
        document.querySelectorAll('p').forEach(el => {
            el.addEventListener('mouseenter', sounds.p);
        });

        // Списки
        document.querySelectorAll('li').forEach(el => {
            el.addEventListener('mouseenter', sounds.li);
        });

        // Шрифт Брайля
        document.querySelectorAll('.braille').forEach(el => {
            el.addEventListener('mouseenter', sounds.braille);
        });

        // Цитаты
        document.querySelectorAll('blockquote').forEach(el => {
            el.addEventListener('mouseenter', sounds.blockquote);
        });

        // Специальная кнопка
        document.querySelectorAll('.sound-button').forEach(el => {
            el.addEventListener('mouseenter', sounds.button);
            el.addEventListener('click', () => {
                playBeep(1200, 500, 0.2);
                showMessage("Sound is working! 🔊");
            });
        });
    }

    // Функция для показа сообщений
    function showMessage(text) {
        // Удаляем предыдущее сообщение если есть
        const existingMessage = document.querySelector('.floating-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const message = document.createElement('div');
        message.className = 'floating-message';
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.9);
            color: #000;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 1.2rem;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
            animation: fadeInOut 2s ease-in-out;
        `;

        document.body.appendChild(message);

        // Удаляем сообщение через 2 секунды
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 2000);
    }

    // Добавляем CSS анимацию для сообщений
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20%, 80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
    `;
    document.head.appendChild(style);

    // Секретная функция: если пользователь долго не двигает мышь
    let mouseTimer;
    let mouseInactive = false;

    function resetMouseTimer() {
        clearTimeout(mouseTimer);
        mouseInactive = false;
        
        mouseTimer = setTimeout(() => {
            mouseInactive = true;
            showMessage("🦯 Where is your mouse? We can't see it!");
            playBeep(200, 1000, 0.1);
        }, 10000); // 10 seconds without mouse movement
    }

    document.addEventListener('mousemove', resetMouseTimer);
    resetMouseTimer();

    // Special easter egg: konami code for "sighted" people
    let konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑ ↑ ↓ ↓ ← → ← → B A
    let konamiIndex = 0;

    document.addEventListener('keydown', function(e) {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                showMessage("🎉 Secret code activated! Now you can see everything!");
                document.body.style.background = 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)';
                document.body.style.color = '#ffffff';
                
                // Musical melody
                setTimeout(() => playBeep(523, 200), 0);    // C
                setTimeout(() => playBeep(659, 200), 200);  // E
                setTimeout(() => playBeep(784, 200), 400);  // G
                setTimeout(() => playBeep(1047, 400), 600); // C
                
                konamiIndex = 0;
                
                // Return to normal view after 5 seconds
                setTimeout(() => {
                    document.body.style.background = '#000000';
                    document.body.style.color = '#333333';
                }, 5000);
            }
        } else {
            konamiIndex = 0;
        }
    });



    // Add CSS for pulse animation
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
        }
    `;
    document.head.appendChild(pulseStyle);

    // Initialize sound effects
    addSoundEffects();

    // Welcome message
    setTimeout(() => {
        showMessage("🦯 Welcome! Hover over elements for audio guidance");
        playBeep(440, 500, 0.1);
    }, 1000);

    // "Virtual screen" effect
    let screenReader = false;
    document.addEventListener('keydown', function(e) {
        // Space key activates "screen reading"
        if (e.code === 'Space' && e.ctrlKey) {
            e.preventDefault();
            screenReader = !screenReader;
            
            if (screenReader) {
                showMessage("📢 Screen reader mode ON!");
                document.body.style.filter = 'invert(1)';
                playBeep(800, 300, 0.1);
            } else {
                showMessage("📢 Screen reader mode OFF!");
                document.body.style.filter = 'none';
                playBeep(400, 300, 0.1);
            }
        }
    });

    console.log('🦯 Website for blind people loaded! Use Ctrl+Space to toggle screen mode.');
});
