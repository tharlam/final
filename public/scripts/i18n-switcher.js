// public/scripts/i18n-switcher.js

// FIX: Use import.meta.url to get the script's full path and calculate the translation folder path
const scriptUrl = import.meta.url;

// This variable is for logging purposes only; the actual fetch uses the relative path
const ASSET_BASE = scriptUrl.substring(0, scriptUrl.lastIndexOf('/scripts/') + 1);


console.log("LOG 1: Script started, ASSET_BASE:", ASSET_BASE); 

const DEFAULT_LANG = 'en';
const translations = {};

// 1. Fetch the JSON data using the calculated relative path
async function fetchTranslations(lang) {
    try {
        // Construct the full URL for the JSON file: 
        // Example: new URL('../i18n/en.json', '.../final/scripts/i18n-switcher.js') 
        // resolves to '.../final/i18n/en.json'
        const jsonUrl = new URL(`../i18n/${lang}.json`, scriptUrl).href;
        
        console.log("LOG 2: Attempting fetch for:", jsonUrl);
        
        const response = await fetch(jsonUrl); 
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); 
        }

        const data = await response.json();
        console.log("LOG 3: Fetch successful, data received."); 
        translations[lang] = data;
        return translations[lang];

    } catch (error) {
        console.error("LOG ERROR 4: Fetch or JSON parsing failed:", error); 
        
        // Fallback logic
        if (lang !== DEFAULT_LANG && translations[DEFAULT_LANG]) {
            return translations[DEFAULT_LANG];
        } else if (lang !== DEFAULT_LANG) {
            return await fetchTranslations(DEFAULT_LANG); 
        }
        return null; 
    }
}

// 2. Apply translations
function applyTranslations(langData) {
    console.log("LOG 5: Applying translations to elements."); 
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        let text = langData[key];

        if (text) {
            const needsInnerHTML = 
                key.includes('heading') || 
                key.includes('paragraph') || 
                key.includes('benefit') ||
                key.includes('title'); 

            if (/<[a-z][\s\S]*>/i.test(text) || needsInnerHTML) {
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
        
        const selectors = document.querySelectorAll('#lang-desktop, #lang-mobile');
        selectors.forEach(selector => {
            if (selector) selector.value = newLang;
        });
        console.log("LOG 6: Language set and applied:", newLang); 
    }
}

// 4. Handle language selector change event
const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
};

// 5. Initialization function
async function initializeI18n() {
    console.log("LOG 7: initializeI18n running."); 
    
    const desktopSelector = document.getElementById('lang-desktop');
    const mobileSelector = document.getElementById('lang-mobile');
    
    const savedLang = localStorage.getItem('language') || DEFAULT_LANG;
    
    // Always fetch the default language first to ensure the fallback works
    await fetchTranslations(DEFAULT_LANG);
    
    // Load and set the saved language (if different from default)
    if (savedLang !== DEFAULT_LANG) {
        await setLanguage(savedLang);
    } else {
        if (translations[DEFAULT_LANG]) {
            applyTranslations(translations[DEFAULT_LANG]);
        }
    }
    
    setTimeout(() => {
        const selectors = [desktopSelector, mobileSelector].filter(s => s); 

        selectors.forEach(selector => {
            selector.removeEventListener('change', handleLanguageChange);
            selector.addEventListener('change', handleLanguageChange);
            selector.value = savedLang;
        });
        console.log("LOG 8: Event listeners attached successfully."); 
    }, 0); 
}

// --- EXECUTION TRIGGERS ---

document.addEventListener('DOMContentLoaded', initializeI18n);
document.addEventListener('astro:page-load', initializeI18n);