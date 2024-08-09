const title = document.querySelector('h1');

let fade; //used for intervals



function fadeInAndOut() {

    let opacity = 0.0;

    setTimeout( () => {

        fade = setInterval(fadeIn, 175); //fades in title

    }, 1750); //waits this much


    function fadeIn() {

        title.style.opacity = Math.round(opacity += 0.1 * 100) / 100; //prevents decimal numbers bug

        if(title.style.opacity >= 1) {

            clearInterval(fade);

            setTimeout( () => {

                fade = setInterval(fadeOut, 175); //fades out title

            }, 8500); //waits this much
        }   
    }

    function fadeOut() {

        title.style.opacity = Math.round(opacity -= 0.1 * 100) / 100; //prevents decimal numbers bug

        if(title.style.opacity <= 0) {

            clearInterval(fade);

            title.style.display = "none";
        }   
    }
}


window.onload = function() {

    fadeInAndOut();

};