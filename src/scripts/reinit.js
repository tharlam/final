// Function to initialize/refresh all global scripts
function initializeGlobalScripts() {
    // 1. AOS (Animate On Scroll) Re-initialization
    if (typeof AOS !== "undefined") {
        if (AOS.options) {
             // Refresh for subsequent transitions
             AOS.refreshHard();
        } else {
            // Initialize on the very first load
            AOS.init({
                duration: 500,
                once: false,
                easing: "ease-in-out",
            });
        }
    }
    
    // 2. I18N Switcher Re-initialization (assuming it needs re-binding after DOM change)
    // NOTE: If your i18n-switcher.js already contains a function to initialize it,
    // you should call that function here. If it's a simple inline script, you may
    // need to adjust its logic to be reusable.
    // Example (if the script contains an init function):
    // if (typeof initializeI18nSwitcher === 'function') {
    //     initializeI18nSwitcher();
    // }

    // 3. **YOUR SPECIFIC SECTION SCRIPTS** (e.g., Sliders, Tabs, Carousels)
    //    ***Crucial Step: Add ALL of your custom, interactive script initializations here.***
    
    //    Example of re-initializing a slider on the homepage:
    //    const testimonialsSlider = document.querySelector('.testimonials-slider');
    //    if (testimonialsSlider && typeof Splide !== 'undefined') {
    //        // Important: Destroy existing instance before re-initializing to prevent errors
    //        if (testimonialsSlider.splide) {
    //            testimonialsSlider.splide.destroy();
    //        }
    //        new Splide(testimonialsSlider, { /* options */ }).mount();
    //    }
    
    console.log('Client scripts initialized/refreshed for new page content.');
}

// -------------------------------------------------------------------
// Set up the listeners to run the initialization function
// -------------------------------------------------------------------

// 1. Run on initial page load (full browser refresh)
document.addEventListener("DOMContentLoaded", initializeGlobalScripts);

// 2. Run after an Astro View Transition (THE FIX)
document.addEventListener("astro:after-swap", initializeGlobalScripts);