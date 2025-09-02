
document.addEventListener('DOMContentLoaded', function() {
    

    let audioContext;
    

    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }


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


    const sounds = {
        header: () => playBeep(800, 300, 0.1),
        h2: () => playBeep(600, 200, 0.08),
        p: () => playBeep(400, 150, 0.06),
        li: () => playBeep(500, 100, 0.05),
        braille: () => playBeep(300, 400, 0.12),
        button: () => playBeep(1000, 250, 0.15),
        blockquote: () => playBeep(350, 300, 0.08)
    };


    let readingArea = null;
    let originalTexts = new Map();


     function initializeLayers(element, englishText) {
         if (element.dataset.layered) return;
         
         const brailleText = element.textContent;
         

         const tempDiv = document.createElement('div');
         tempDiv.style.cssText = `
             position: absolute;
             visibility: hidden;
             width: ${element.offsetWidth}px;
             font-family: ${window.getComputedStyle(element).fontFamily};
             font-size: ${window.getComputedStyle(element).fontSize};
             line-height: ${window.getComputedStyle(element).lineHeight};
             letter-spacing: ${window.getComputedStyle(element).letterSpacing};
             padding: 0.8rem;
             box-sizing: border-box;
             word-wrap: break-word;
             white-space: normal;
         `;
         tempDiv.textContent = Math.max(brailleText.length, englishText.length) > brailleText.length ? englishText : brailleText;
         document.body.appendChild(tempDiv);
         const contentHeight = tempDiv.offsetHeight;
         document.body.removeChild(tempDiv);
         

         element.style.minHeight = contentHeight + 'px';
         element.innerHTML = '';
         element.style.position = 'relative';
         

         const englishLayer = document.createElement('div');
         englishLayer.className = 'english-layer';
         englishLayer.textContent = englishText;
         

         const brailleLayer = document.createElement('div');
         brailleLayer.className = 'braille-layer';
         brailleLayer.textContent = brailleText;
         
         element.appendChild(englishLayer);
         element.appendChild(brailleLayer);
         element.dataset.layered = 'true';
     }

     function updateLayers(element, mouseX, mouseY) {
         const brailleLayer = element.querySelector('.braille-layer');
         if (!brailleLayer) return;
         

         const elementRect = element.getBoundingClientRect();
         const relativeX = mouseX - elementRect.left;
         const relativeY = mouseY - elementRect.top;
         const radius = 40; // Радиус круга
         

         const brailleMask = `radial-gradient(circle ${radius}px at ${relativeX}px ${relativeY}px, transparent 0%, transparent ${radius}px, black ${radius + 1}px)`;
         

         brailleLayer.style.mask = brailleMask;
         brailleLayer.style.webkitMask = brailleMask;
     }

     function restoreLayers(element) {
         const brailleLayer = element.querySelector('.braille-layer');
         if (brailleLayer) {
             brailleLayer.style.mask = 'none';
             brailleLayer.style.webkitMask = 'none';
         }
     }

     function createReadingArea() {
         readingArea = document.createElement('div');
         readingArea.style.cssText = `
             position: fixed;
             width: 80px;
             height: 80px;
             pointer-events: none;
             z-index: 1000;
             background: transparent;
             opacity: 0;
         `;
         document.body.appendChild(readingArea);
     }

     function showReadingArea(e) {
         if (!readingArea) createReadingArea();
         readingArea.style.left = (e.clientX - 40) + 'px';
         readingArea.style.top = (e.clientY - 40) + 'px';
         readingArea.style.opacity = '1';
     }

     function hideReadingArea() {
         if (readingArea) {
             readingArea.style.opacity = '0';
         }
     }


    function addSoundEffects() {

        document.querySelectorAll('h1, header').forEach(el => {
            el.addEventListener('mouseenter', sounds.header);
        });

         document.querySelectorAll('.braille-text').forEach(el => {
             el.addEventListener('mouseenter', (e) => {
                 sounds.braille();
                 const englishText = el.getAttribute('data-english');
                 if (englishText) {
                     showReadingArea(e);
                     initializeLayers(el, englishText);
                     updateLayers(el, e.clientX, e.clientY);
                 }
             });
             
             el.addEventListener('mousemove', (e) => {
                 if (readingArea && readingArea.style.opacity === '1') {
                     readingArea.style.left = (e.clientX - 40) + 'px';
                     readingArea.style.top = (e.clientY - 40) + 'px';
                     
                     updateLayers(el, e.clientX, e.clientY);
                 }
             });
             
             el.addEventListener('mouseleave', () => {
                 hideReadingArea();
                 restoreLayers(el);
             });
         });


        document.querySelectorAll('.braille').forEach(el => {
            el.addEventListener('mouseenter', sounds.braille);
        });

        document.querySelectorAll('.sound-button').forEach(el => {
            el.addEventListener('mouseenter', sounds.button);
            el.addEventListener('click', () => {
                playBeep(1200, 500, 0.2);
                showMessage("Sound is working! 🔊");
            });
        });
    }


    function showMessage(text) {

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


        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 2000);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20%, 80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
    `;
    document.head.appendChild(style);


    let mouseTimer;
    let mouseInactive = false;

    function resetMouseTimer() {
        clearTimeout(mouseTimer);
        mouseInactive = false;
        
        mouseTimer = setTimeout(() => {
            mouseInactive = true;
            showMessage("🦯 Where is your mouse? We can't see it!");
            playBeep(200, 1000, 0.1);
        }, 10000); 
    }

    document.addEventListener('mousemove', resetMouseTimer);
    resetMouseTimer();


    let konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;

    document.addEventListener('keydown', function(e) {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                showMessage("🎉 Secret code activated! Now you can see everything!");
                document.body.style.background = 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)';
                document.body.style.color = '#ffffff';
                

                setTimeout(() => playBeep(523, 200), 0);    // C
                setTimeout(() => playBeep(659, 200), 200);  // E
                setTimeout(() => playBeep(784, 200), 400);  // G
                setTimeout(() => playBeep(1047, 400), 600); // C
                
                konamiIndex = 0;
                

                setTimeout(() => {
                    document.body.style.background = '#000000';
                    document.body.style.color = '#333333';
                }, 5000);
            }
        } else {
            konamiIndex = 0;
        }
    });



    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
        }
    `;
    document.head.appendChild(pulseStyle);


    addSoundEffects();




    let screenReader = false;
    document.addEventListener('keydown', function(e) {

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
