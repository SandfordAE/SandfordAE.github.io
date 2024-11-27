











// JavaScript for Mobile Menu and Theme Toggle



// Mobile Menu Toggle
const menuButton = document.getElementById('menu-button');
const mobileMenu = document.getElementById('mobile-menu');

menuButton.addEventListener('click', () => {
mobileMenu.classList.toggle('hidden');
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const darkIcon = document.getElementById('theme-toggle-dark-icon');
const lightIcon = document.getElementById('theme-toggle-light-icon');

// Initial Setup
if (localStorage.getItem('color-theme') === 'dark' || 
    (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
document.documentElement.classList.add('dark');
darkIcon.classList.add('hidden');
lightIcon.classList.remove('hidden');
} else {
document.documentElement.classList.remove('dark');
darkIcon.classList.remove('hidden');
lightIcon.classList.add('hidden');
}

themeToggle.addEventListener('click', () => {
darkIcon.classList.toggle('hidden');
lightIcon.classList.toggle('hidden');

// If the page has the class dark, remove it, otherwise add it
if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('color-theme', 'light');
} else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('color-theme', 'dark');
}
});

// Close mobile menu when clicking outside
window.addEventListener('click', (e) => {
if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.add('hidden');
}
});







// Typewriter effect 

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











