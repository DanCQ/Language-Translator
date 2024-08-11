const title = document.querySelector('h1');
const nav = document.querySelector('nav');
const microphone = document.querySelector('.oval');

let allow = true; //used for interval
let countdown; //used for interval
let fade; //used for interval
let power = false; //toggle on/off
let timer; //used for interval


function titleFade() {
    
    let opacity = 0.0;

    setTimeout( () => {

        fade = setInterval(fadeIn, 175); //fades in title

    }, 1750); //waits 1.75 seconds


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
        microphone.style.backgroundColor = "aquamarine"; //on color
    }

    function off() { 
        timer = 5000; //resets, used for interval

        micClick.play();
        microphone.style.backgroundColor = "tomato"; //off color

        if(allow) {

            allow = false; //prevents multiple intervals
    
            countdown = setInterval(() => {
                timer -= 1000; 
            
                if(timer <= 0 && !power) {
                    clearInterval(countdown);
                    allow = true;
                    microphone.style.backgroundColor = "antiquewhite"; //idle color
                }
            }, 1000);
        }   
    }
}


window.addEventListener("click",  listening);

window.addEventListener("touchstart", function(event) {

    event.preventDefault(); //prevents touch zoom, drag, long press

    listening();
});


window.onload = function() {

    titleFade();

};
