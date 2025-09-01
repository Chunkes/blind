// Braille Translator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Словарь для перевода в Брайль
    const englishToBrailleMap = {
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
    const mainInput = document.getElementById('mainInput');
    const mainOutput = document.getElementById('mainOutput');
    const swapBtn = document.getElementById('swapBtn');
    const copyBtn = document.getElementById('copyBtn');
    const charCount = document.getElementById('charCount');
    const leftLanguage = document.getElementById('leftLanguage');
    const rightLanguage = document.getElementById('rightLanguage');
    
    // Состояние направления перевода
    let isEnglishToBraille = true;

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
            if (englishToBrailleMap[lowerChar]) {
                result += englishToBrailleMap[lowerChar];
            } else {
                result += char;
            }
        }
        
        return result;
    }

    // Функция перевода из Брайля в английский (базовая)
    function translateFromBraille(brailleText) {
        const brailleToEnglish = {};
        // Создаем обратный словарь
        for (const [english, braille] of Object.entries(englishToBrailleMap)) {
            if (braille !== ' ' && braille !== '\n') {
                brailleToEnglish[braille] = english;
            }
        }
        
        let result = '';
        let i = 0;
        
        while (i < brailleText.length) {
            const char = brailleText[i];
            
            if (char === ' ') {
                result += ' ';
                i++;
            } else if (char === '\n') {
                result += '\n';
                i++;
            } else if (char === '⠠') { // Заглавная буква
                i++;
                if (i < brailleText.length) {
                    const nextChar = brailleText[i];
                    const letter = brailleToEnglish[nextChar];
                    if (letter) {
                        result += letter.toUpperCase();
                    }
                    i++;
                }
            } else {
                const letter = brailleToEnglish[char];
                if (letter) {
                    result += letter;
                } else {
                    result += char; // Если не найден, оставляем как есть
                }
                i++;
            }
        }
        
        return result;
    }

    // Функция обновления счетчика символов
    function updateCharCount() {
        const count = mainInput.value.length;
        charCount.textContent = count;
        
        if (count >= 450) {
            charCount.style.color = '#ff6b6b';
        } else if (count >= 400) {
            charCount.style.color = '#ffa500';
        } else {
            charCount.style.color = '#666666';
        }
    }

    // Функция перевода в реальном времени
    function performRealTimeTranslation() {
        const inputText = mainInput.value;
        
        if (!inputText) {
            mainOutput.innerHTML = '<div class="placeholder">Translation will appear here</div>';
            copyBtn.disabled = true;
            return;
        }

        let translatedText;
        if (isEnglishToBraille) {
            translatedText = translateToBraille(inputText);
        } else {
            translatedText = translateFromBraille(inputText);
        }
        
        mainOutput.textContent = translatedText;
        copyBtn.disabled = false;
    }

    // Функция смены языков
    function swapLanguages() {
        isEnglishToBraille = !isEnglishToBraille;
        
        // Меняем подписи языков
        if (isEnglishToBraille) {
            leftLanguage.textContent = 'English';
            rightLanguage.textContent = 'Braille';
            mainInput.placeholder = 'Enter text';
        } else {
            leftLanguage.textContent = 'Braille';
            rightLanguage.textContent = 'English';
            mainInput.placeholder = 'Enter Braille text';
        }
        
        // Меняем содержимое местами
        const inputContent = mainInput.value;
        const outputContent = mainOutput.textContent;
        
        if (outputContent && !outputContent.includes('Translation will appear here')) {
            mainInput.value = outputContent;
            mainOutput.textContent = inputContent;
        }
        
        // Обновляем перевод
        performRealTimeTranslation();
        updateCharCount();
        
        // Звуковой эффект
        if (window.playBeep) {
            playBeep(600, 100, 0.1);
            setTimeout(() => playBeep(800, 100, 0.1), 150);
        }
    }

    // Функция копирования
    function copyToClipboard() {
        const outputText = mainOutput.textContent;
        
        if (!outputText || outputText.includes('Translation will appear here')) {
            return;
        }

        navigator.clipboard.writeText(outputText).then(() => {
            // Показываем уведомление
            copyBtn.style.color = '#4ade80';
            
            setTimeout(() => {
                copyBtn.style.color = '';
            }, 2000);

            // Звуковой эффект
            if (window.playBeep) {
                playBeep(1000, 150, 0.08);
            }
        }).catch(() => {
            copyBtn.style.color = '#ef4444';
            setTimeout(() => {
                copyBtn.style.color = '';
            }, 2000);
        });
    }

    // Обработчики событий
    mainInput.addEventListener('input', function() {
        updateCharCount();
        performRealTimeTranslation();
    });
    
    mainInput.addEventListener('keydown', function(e) {
        if (e.key === 'Tab' && e.ctrlKey) {
            e.preventDefault();
            swapLanguages();
        }
    });

    swapBtn.addEventListener('click', swapLanguages);
    copyBtn.addEventListener('click', copyToClipboard);

    // Инициализация
    updateCharCount();
    mainInput.focus();
    
    // Добавляем подсказки
    mainInput.setAttribute('title', 'Press Ctrl+Tab to swap languages');
    swapBtn.setAttribute('title', 'Swap languages');

    console.log('🔄 Real-time Braille Translator loaded!');
});