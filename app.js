







const words = ["Django Boilerplate!", "Greetings... Have a look around!", "SIgn-Up/login to unlock all features","Quick-start Django Development App."];
let i = 0;
let j = 0;
let currentWord = "";
let isDeleting = false;

function type() {
currentWord = words[i];
if (isDeleting) {
    document.getElementById("typewriter2").textContent = currentWord.substring(0, j-1);
    j--;
    if (j == 0) {
    isDeleting = false;
    i++;
    if (i == words.length) {
        i = 0;
    }
    }
} else {
    document.getElementById("typewriter2").textContent = currentWord.substring(0, j+1);
    j++;
    if (j == currentWord.length) {
    isDeleting = true;
    }
}
setTimeout(type, 100);
}

type();











