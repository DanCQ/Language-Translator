const nav = document.querySelector('nav');
const microphone = document.querySelector('.oval');
const title = document.querySelector('h1');
const transcript = document.getElementById('transcript');

let allow = true; //used for interval
let countdown; //used for interval
let fade; //used for interval
let power = false; //toggle on/off
let recognition; //used for detected speech
let timer; //used for interval

const supportedLanguages = [ 
    'Abaza', 'Abkhaz', 'Acehnese', 'Adyghe', 'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Avar', 'Azerbaijani', 
    'Bakhtiari', 'Balinese', 'Balochi', 'Balti', 'Baluchi', 'Bashkir', 'Basque', 'Bengali', 'Bosnian', 'Brahui', 
    'Brokskat', 'Bulgarian', 'Burmese', 'Burushaski', 'Buryat', 'Catalan', 'Chechen', 'Cherkess', 
    'Chinese (Simplified)', 'Chinese (Traditional)', 'Chuvash', 'Circassian', 'Croatian', 'Czech', 'Danish', 
    'Dargwa', 'Dari', 'Dutch', 'English', 'Estonian', 'Farsi', 'Filipino', 'Finnish', 'French', 'Galician', 
    'Gawar-Bati', 'Georgian', 'German', 'Gilaki', 'Gowro', 'Greek', 'Gujarati', 'Gujari', 'Haitian Creole', 
    'Hausa', 'Hazaragi', 'Hebrew', 'Hindi', 'Hindko', 'Hungarian', 'Icelandic', 'Igbo', 'Indonesian', 'Ingush', 
    'Irish', 'Italian', 'Japanese', 'Javanese', 'Kabardian', 'Kalami', 'Kalasha', 'Kalmyk', 'Kannada', 
    'Karachay-Balkar', 'Kashmiri', 'Kazakh', 'Khmer', 'Khowar', 'Korean', 'Kumyk', 'Kurdish', 'Kyrgyz', 
    'Ladakhi', 'Lao', 'Latvian', 'Laz', 'Lezgian', 'Lithuanian', 'Luri', 'Luxembourgish', 'Macedonian', 
    'Madurese', 'Malay', 'Malayalam', 'Maltese', 'Marathi', 'Mazanderani', 'Mingrelian', 'Mongolian', 'Nogai', 
    'Norwegian', 'Nuristani', 'Ossetic', 'Pashayi', 'Pashto', 'Persian', 'Polish', 'Portuguese', 'Punjabi', 
    'Purgi', 'Purki', 'Pushto', 'Romanian', 'Russian', 'Saraiki', 'Serbian', 'Shina', 'Shughni', 'Sindhi', 
    'Sinhala', 'Slovak', 'Slovenian', 'Somali', 'Sorani', 'Spanish', 'Sundanese', 'Svan', 'Swahili', 'Swedish', 
    'Tabasaran', 'Tajik', 'Talysh', 'Tamil', 'Tat', 'Tatar', 'Telugu', 'Thai', 'Torwali', 'Turkish', 'Turkmen', 
    'Tuvan', 'Uighur', 'Ukrainian', 'Urdu', 'Uzbek', 'Vietnamese', 'Wakhi', 'Welsh', 'Xhosa', 'Yakut', 'Yazgulyam',
    'Yidgha', 'Yoruba', 'Zulu'
];

//const alphebeticalLanguages = supportedLanguages.sort(); //.sort().split("', '"); formating hint


function titleFade() {
    
    let opacity = 0.0;

    setTimeout( () => {

        fade = setInterval(fadeIn, 175); //fades in title

    }, 1500); //waits 1.5 seconds


    function fadeIn() {

        title.style.opacity = Math.round(opacity += 0.1 * 100) / 100; //prevents decimal number bug

        if(title.style.opacity >= 1) {

            clearInterval(fade);

            setTimeout( () => {

                fade = setInterval(fadeOut, 175); //fades out title

            }, 7500); //waits this much
        }   
    }

    function fadeOut() {

        title.style.opacity = Math.round(opacity -= 0.1 * 100) / 100; //prevents decimal number bug

        if(title.style.opacity <= 0) {

            clearInterval(fade);

            title.style.display = "none";
            nav.style.display = "block";
            if(!power) {
                microphone.style.borderColor = "goldenrod";
            }
        }   
    }
}


function listening() { 

    const micClick = new Audio('assets/mic-click.mp3');

    //toggles on/off
    if(!power) {
        power = true;
        on(); 
    } else {
        power = false;
        off();
    }  

    function on() {
        clearInterval(countdown);
        allow = true;
        micClick.play(); 
        microphone.style.backgroundColor = 'aquamarine'; //on color
        microphone.style.borderColor = "cornflowerblue";
    }

    function off() { 
        timer = 5000; //resets, used for interval

        micClick.play();
        microphone.style.backgroundColor = "tomato"; //off color
        microphone.style.borderColor = "silver";

        if(allow) {

            allow = false; //prevents multiple intervals
    
            countdown = setInterval(() => {
                timer -= 1000; 
            
                if(timer <= 0 && !power) {
                    clearInterval(countdown);
                    allow = true;
                    microphone.style.backgroundColor = "antiquewhite"; //idle color
                    microphone.style.borderColor = "goldenrod";
                }
            }, 1000);
        }   
    }
}


//start microphone listening functions
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition();
} else {
    alert('Speech Recognition API is not supported in this browser.');
}

if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
        const speechResult = event.results[0][0].transcript;
            console.log(speechResult);
        transcript.textContent = `You said: ${speechResult}`;
        processSpeech(speechResult);
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error detected: ' + event.error);
        switch(event.error) {
            case 'no-speech':
                alert('No speech detected. Please try again.');
                break;
            case 'audio-capture':
                alert('Microphone not detected. Please ensure your microphone is connected and try again.');
                break;
            case 'not-allowed':
                alert('Microphone access not allowed. Please enable microphone permissions.');
                break;
            case 'network':
                alert('Network error. Please check your internet connection.');
                break;
            default:
                alert('Speech recognition error: ' + event.error);
        }
    };

    microphone.addEventListener("click", () => {
        
        listening();

        if(power) {
            recognition.start();
        }
    });
    
    microphone.addEventListener("touchstart", (event) => {
    
        event.preventDefault(); //prevents touch zoom, drag, long press
    
        listening();

        if(power) {
            recognition.start();
        }
    });
}


function processSpeech(speechText) {
    fetch('https://chatgpt-worker.danycervantesq.workers.dev/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo', // Add the model parameter
            prompt: speechText,
            max_tokens: 100,
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => { console.log(data);
        // Check if the data structure is as expected
        if (data && data.choices && data.choices.length > 0) {
            const responseText = data.choices[0].text.trim();
            transcript.textContent = `ChatGPT said: ${responseText}`;
            speakText(responseText);
        } else {
            throw new Error('Unexpected response structure');
        }
    })
    .catch(error => {
        console.error('Error:', error.message);
        transcript.textContent = `Error: ${error.message}`;
    });
}


function speakText(text) {
    const speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(speechSynthesisUtterance);
}


window.onload = function() {

    titleFade();

};



// //Cloudflare API JS script
// addEventListener('fetch', event => {
//     event.respondWith(handleRequest(event.request));
// });

// async function handleRequest(request) {
//     // Get the API key from the environment variable
//     const apiKey = CHATGPT_API_KEY;

//     // Your ChatGPT API endpoint
//     const apiUrl = 'https://api.openai.com/v1/chat/completions';

//     try {
//         // Handle preflight OPTIONS request for CORS
//         if (request.method === 'OPTIONS') {
//             return handleOptions(request);
//         }

//         // Check if the request has a body
//         if (request.method === 'POST' || request.method === 'PUT') {
//             const contentLength = request.headers.get('content-length');
            
//             if (!contentLength || parseInt(contentLength) === 0) {
//                 return new Response('No content in request body', { status: 400 });
//             }
//         }

//         // Extract data from the request (e.g., from a POST request)
//         let requestData;
//         try {
//             requestData = await request.json();
//         } catch (error) {
//             return new Response('Invalid JSON input', { status: 400 });
//         }      

//         // Add the model parameter to the request data
//         requestData.model = 'gpt-4-turbo'; // Specify the model to use

//         // Prepare the API request to OpenAI
//         const apiResponse = await fetch(apiUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${apiKey}`,
//             },
//             body: JSON.stringify(requestData)
//         });

//         // Return the response from the API
//         const apiResult = await apiResponse.json();
        
//         return new Response(JSON.stringify(apiResult), {
//             headers: { 
//                 'Content-Type': 'application/json',
//                 'Access-Control-Allow-Origin': getAllowedOrigin(request.headers.get('Origin')), // Set the allowed origin dynamically
//                 'Access-Control-Allow-Methods': 'POST, OPTIONS', // Specifies allowed methods
//                 'Access-Control-Allow-Headers': 'Content-Type, Authorization' // Specifies allowed headers
//             }
//         });
//     } catch (error) {
//         return new Response('Error processing request: ' + error.message, { status: 500 });
//     }
// }

// function handleOptions(request) { 
//     const headers = {
//         'Access-Control-Allow-Origin': getAllowedOrigin(request.headers.get('Origin')), // Set the allowed origin dynamically
//         'Access-Control-Allow-Methods': 'POST, OPTIONS', // Specifies allowed methods
//         'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Specifies allowed headers
//         'Access-Control-Max-Age': '86400', // Cache the preflight response for 24 hours
//     };
//     return new Response(null, { headers });
// }

// function getAllowedOrigin(origin) {
//     const allowedOrigins = [
//         'https://universal-language-translator.pages.dev',
//         'https://dancq.github.io/Language-Translator'
//     ];
    
//     if (allowedOrigins.includes(origin)) {
//         return origin;
//     } else {
//         return 'null'; // Return 'null' if the origin is not allowed
//     }
// }
