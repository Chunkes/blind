// Braille Translator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Словарь для перевода в Брайль (упрощенная версия)
    const brailleMap = {
        'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑',
        'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
        'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕',
        'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
        'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵',
        
        '1': '⠼⠁', '2': '⠼⠃', '3': '⠼⠉', '4': '⠼⠙', '5': '⠼⠑',
        '6': '⠼⠋', '7': '⠼⠛', '8': '⠼⠓', '9': '⠼⠊', '0': '⠼⠚',
        
        '.': '⠲', ',': '⠂', '?': '⠦', '!': '⠖', ';': '⠆',
        ':': '⠒', '-': '⠤', '(': '⠐⠣', ')': '⠐⠜',
        '"': '⠦', "'": '⠄', '/': '⠸⠌', '@': '⠈⠁',
        
        ' ': ' ', '\n': '\n', '\r': '', '\t': ' '
    };

    // Элементы DOM
    const englishInput = document.getElementById('englishInput');
    const brailleOutput = document.getElementById('brailleOutput');
    const translateBtn = document.getElementById('translateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const charCount = document.getElementById('charCount');

    // Функция перевода в Брайль
    function translateToBraille(text) {
        let result = '';
        let capitalNext = false;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const lowerChar = char.toLowerCase();
            
            // Обработка заглавных букв
            if (char !== lowerChar && /[a-z]/.test(lowerChar)) {
                if (!capitalNext) {
                    result += '⠠'; // Индикатор заглавной буквы
                    capitalNext = true;
                }
            } else {
                capitalNext = false;
            }
            
            // Перевод символа
            if (brailleMap[lowerChar]) {
                result += brailleMap[lowerChar];
            } else {
                // Неизвестный символ - добавляем как есть
                result += char;
            }
        }
        
        return result;
    }

    // Обновление счетчика символов
    function updateCharCount() {
        const count = englishInput.value.length;
        charCount.textContent = count;
        
        if (count > 450) {
            charCount.style.color = '#ff6666';
        } else if (count > 400) {
            charCount.style.color = '#ffaa66';
        } else {
            charCount.style.color = '#666666';
        }
    }

    // Функция перевода
    function performTranslation() {
        const inputText = englishInput.value.trim();
        
        if (!inputText) {
            brailleOutput.innerHTML = '<div class="placeholder">Enter some text to translate...</div>';
            brailleOutput.classList.add('empty');
            copyBtn.disabled = true;
            return;
        }

        // Добавляем эффект загрузки
        translateBtn.style.transform = 'scale(0.95)';
        translateBtn.querySelector('span').textContent = '⏳ Translating...';
        translateBtn.disabled = true;

        // Имитация процесса перевода
        setTimeout(() => {
            const brailleText = translateToBraille(inputText);
            brailleOutput.textContent = brailleText;
            brailleOutput.classList.remove('empty');
            copyBtn.disabled = false;

            // Восстанавливаем кнопку
            translateBtn.style.transform = '';
            translateBtn.querySelector('span').textContent = '🔄 Translate';
            translateBtn.disabled = false;

            // Добавляем звуковой эффект
            if (window.playBeep) {
                playBeep(800, 200, 0.1);
            }
        }, 800);
    }

    // Функция копирования
    function copyToClipboard() {
        const brailleText = brailleOutput.textContent;
        
        if (!brailleText || brailleOutput.classList.contains('empty')) {
            return;
        }

        navigator.clipboard.writeText(brailleText).then(() => {
            // Показываем уведомление
            const originalText = copyBtn.querySelector('span').textContent;
            copyBtn.querySelector('span').textContent = '✅ Copied!';
            copyBtn.style.background = '#4a7c4a';
            
            setTimeout(() => {
                copyBtn.querySelector('span').textContent = originalText;
                copyBtn.style.background = '';
            }, 2000);

            // Звуковой эффект
            if (window.playBeep) {
                playBeep(1000, 150, 0.08);
            }
        }).catch(() => {
            copyBtn.querySelector('span').textContent = '❌ Failed';
            setTimeout(() => {
                copyBtn.querySelector('span').textContent = '📋 Copy';
            }, 2000);
        });
    }

    // Функция очистки
    function clearAll() {
        englishInput.value = '';
        brailleOutput.innerHTML = '<div class="placeholder">Your Braille translation will appear here...</div>';
        brailleOutput.classList.add('empty');
        copyBtn.disabled = true;
        updateCharCount();
        englishInput.focus();

        // Звуковой эффект
        if (window.playBeep) {
            playBeep(600, 100, 0.06);
        }
    }

    // Обработчики событий
    englishInput.addEventListener('input', updateCharCount);
    
    englishInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            performTranslation();
        }
    });

    translateBtn.addEventListener('click', performTranslation);
    copyBtn.addEventListener('click', copyToClipboard);
    clearBtn.addEventListener('click', clearAll);

    // Инициализация
    updateCharCount();
    englishInput.focus();

    // Добавляем подсказку для быстрого перевода
    englishInput.setAttribute('title', 'Press Ctrl+Enter to translate quickly');

    // Автоперевод при вводе (опционально)
    let autoTranslateTimeout;
    englishInput.addEventListener('input', function() {
        clearTimeout(autoTranslateTimeout);
        autoTranslateTimeout = setTimeout(() => {
            if (englishInput.value.trim() && englishInput.value.trim().length > 2) {
                // Автоматический перевод для коротких фраз
                const brailleText = translateToBraille(englishInput.value);
                if (brailleText.length < 100) {
                    brailleOutput.textContent = brailleText;
                    brailleOutput.classList.remove('empty');
                    copyBtn.disabled = false;
                }
            }
        }, 1500); // Задержка 1.5 секунды
    });

    console.log('🦯 Braille Translator loaded successfully!');
});
