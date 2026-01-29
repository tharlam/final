// public/scripts/i18n-switcher.js

/**
 * LOGIC:
 * 1. Uses import.meta.url to handle paths correctly (even in subfolders like /final/)
 * 2. Fetches en.json or ne.json from the /public/i18n/ folder
 * 3. Injects text into [data-i18n] elements
 * 4. Supports <strong> tags for blue color highlights
 */

const scriptUrl = import.meta.url;
const DEFAULT_LANG = 'en';
const translations = {};

console.log("LOG 1: i18n System Initialized");

// 1. Fetch the JSON data
async function fetchTranslations(lang) {
    try {
        // Construct the full URL for the JSON file relative to this script
        const jsonUrl = new URL(`../i18n/${lang}.json`, scriptUrl).href;
        console.log("LOG 2: Attempting fetch for:", jsonUrl);
        
        const response = await fetch(jsonUrl); 
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); 

        const data = await response.json();
        console.log("LOG 3: Fetch successful for:", lang); 
        translations[lang] = data;
        return translations[lang];

    } catch (error) {
        console.error("LOG ERROR 4: Fetch failed:", error); 
        // Fallback logic
        if (lang !== DEFAULT_LANG) {
            return await fetchTranslations(DEFAULT_LANG); 
        }
        return null; 
    }
}

// 2. Apply translations to the page
function applyTranslations(langData) {
    console.log("LOG 5: Applying translations to DOM."); 
    
    // Handle all elements with [data-i18n]
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = langData[key];

        if (text) {
            /**
             * Check if the text needs to be rendered as HTML.
             * This is required for <strong> tags (blue color) to work.
             */
            const needsInnerHTML = 
                key.includes('title') || 
                key.includes('heading') || 
                key.includes('_p') ||    // Catches p1, p2, p3, etc.
                key.includes('_btn') ||  // Catches about_btn, sports_btn
                key.includes('benefit') ||
                /<[a-z][\s\S]*>/i.test(text); // Regex check for any HTML tags

            if (needsInnerHTML) {
                el.innerHTML = text;
            } else {
                el.textContent = text;
            }
        }
    });

    // Handle alt attributes for images
    document.querySelectorAll('[data-i18n-alt]').forEach(img => {
        const key = img.getAttribute('data-i18n-alt');
        const altText = langData[key];
        if (altText) {
            img.setAttribute('alt', altText);
        }
    });
}

// 3. Main function to change the language
async function setLanguage(newLang) {
    let langData = translations[newLang];

    if (!langData) {
        langData = await fetchTranslations(newLang);
    }

    if (langData) {
        applyTranslations(langData);
        localStorage.setItem('language', newLang);
        document.documentElement.lang = newLang; // Set lang attribute for SEO
        
        // Sync any language dropdowns on the page
        const selectors = document.querySelectorAll('#lang-desktop, #lang-mobile');
        selectors.forEach(selector => {
            if (selector) selector.value = newLang;
        });
        console.log("LOG 6: Language applied:", newLang); 
    }
}

// 4. Initialization function
async function initializeI18n() {
    console.log("LOG 7: initializeI18n running."); 
    
    const savedLang = localStorage.getItem('language') || DEFAULT_LANG;
    
    // Always fetch English first as a master fallback
    await fetchTranslations(DEFAULT_LANG);
    
    if (savedLang !== DEFAULT_LANG) {
        await setLanguage(savedLang);
    } else {
        applyTranslations(translations[DEFAULT_LANG]);
    }

    // Attach event listeners to switchers
    const selectors = document.querySelectorAll('#lang-desktop, #lang-mobile');
    selectors.forEach(selector => {
        // Clear old listeners to avoid double-firing
        selector.removeEventListener('change', handleLanguageChange);
        selector.addEventListener('change', handleLanguageChange);
        selector.value = savedLang;
    });
}

// Event handler for selectors
function handleLanguageChange(e) {
    setLanguage(e.target.value);
}

// --- EXECUTION TRIGGERS ---

// DOMContentLoaded for standard loads, astro:page-load for Astro's View Transitions
document.addEventListener('DOMContentLoaded', initializeI18n);
document.addEventListener('astro:page-load', initializeI18n);