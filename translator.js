const startBtn = document.getElementById('start-btn');
const translatedText = document.getElementById('translated-text');
let lastNonEnglishLanguage = 'en';

startBtn.addEventListener('click', () => {
    startListening();
});

function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        detectLanguageAndTranslate(transcript);
    };

    recognition.onspeechend = () => {
        recognition.stop();
    };

    recognition.onerror = (event) => {
        translatedText.textContent = 'Error occurred in recognition: ' + event.error;
    };
}

function detectLanguageAndTranslate(text) {
    const detectedLang = detectLanguage(text);
    if (detectedLang === 'en') {
        translateToLastNonEnglishLanguage(text);
    } else {
        lastNonEnglishLanguage = detectedLang;
        translateToEnglish(text, detectedLang);
    }
}

function detectLanguage(text) {
    // Dummy language detection function
    // Replace this with a proper language detection API
    return text.match(/[а-яА-Я]/) ? 'ru' : 'en';
}

function translateToEnglish(text, lang) {
    // Dummy translation function
    // Replace this with a proper translation API
    const translated = `Translated from ${lang}: ${text}`;
    translatedText.textContent = translated;
}

function translateToLastNonEnglishLanguage(text) {
    // Dummy translation function
    // Replace this with a proper translation API
    const translated = `Translated to ${lastNonEnglishLanguage}: ${text}`;
    translatedText.textContent = translated;
}
