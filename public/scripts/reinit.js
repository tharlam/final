// public/scripts/reinit.js

console.log("AOS Script: Loaded.");

// 1. Initialization function
function initializeAos() {
    // Checks if the AOS object is available before trying to initialize
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000, 
            once: true,     
            easing: 'ease-in-out',
        });
        console.log("AOS Script: Initialized.");
    }
}

// 2. Re-initialization function (Crucial for Astro View Transitions)
function reinitializeAos() {
    if (typeof AOS !== 'undefined') {
        AOS.refreshHard(); // Forces AOS to rescan all elements
        console.log("AOS Script: Refreshed on page transition.");
    }
}

// --- EXECUTION TRIGGERS ---

// A. Initial page load (runs on hard refresh/first visit)
document.addEventListener('DOMContentLoaded', initializeAos);

// B. Astro View Transition (runs on soft navigation)
document.addEventListener('astro:page-load', reinitializeAos);