const DEFAULT_LANG = 'en';
const translations = {};

// 1. Fetch the JSON data for the given language using the Fetch API
async function fetchTranslations(lang) {
    try {
        // Use Fetch API with the absolute path from the public folder
        const response = await fetch(`/i18n/${lang}.json`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        translations[lang] = data;
        return translations[lang];

    } catch (error) {
        console.error(`Failed to load translation for ${lang}:`, error);
        
        // Fallback to the default language only if a non-default language failed
        if (lang !== DEFAULT_LANG && translations[DEFAULT_LANG]) {
             return translations[DEFAULT_LANG];
        } else if (lang !== DEFAULT_LANG) {
             return await fetchTranslations(DEFAULT_LANG); // Attempt to fetch default
        }
        return null; 
    }
}

// 2. Apply translations to all elements with data-i18n attributes
function applyTranslations(langData) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        let text = langData[key];

        if (text) {
            // FIX: Explicitly use innerHTML for all content that might contain HTML
            // (like the headings and paragraphs/list items with <strong> tags).
            const needsInnerHTML = 
                key.includes('heading') || 
                key.includes('paragraph') || 
                key.includes('benefit') ||
                key.includes('title'); 

            // Use innerHTML if the content contains HTML tags OR if it's a known tag 
            // that requires innerHTML (like a paragraph or heading).
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
        
        // Synchronize the dropdowns (desktop and mobile)
        const selectors = document.querySelectorAll('#lang-desktop, #lang-mobile');
        selectors.forEach(selector => {
            if (selector) selector.value = newLang;
        });
    }
}

// 4. Handle language selector change event (defined outside for removal)
const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
};

// 5. Initialization function (The Astro Fix)
async function initializeI18n() {
    // 5a. Select elements fresh after page load/transition
    const desktopSelector = document.getElementById('lang-desktop');
    const mobileSelector = document.getElementById('lang-mobile');
    
    // 5b. Load the saved language or the default language
    const savedLang = localStorage.getItem('language') || DEFAULT_LANG;
    
    // Always fetch the default language first to ensure the fallback works
    await fetchTranslations(DEFAULT_LANG);
    
    // Load and set the saved language (if different from default)
    if (savedLang !== DEFAULT_LANG) {
         await setLanguage(savedLang);
    } else {
        // Apply default language if the translations object has it (for innerHTML elements)
        if (translations[DEFAULT_LANG]) {
             applyTranslations(translations[DEFAULT_LANG]);
        }
    }
    
    // 5c. Attach event listeners with cleanup (CRITICAL FIX)
    const selectors = [desktopSelector, mobileSelector].filter(s => s); // Filter out nulls

    selectors.forEach(selector => {
        // CRITICAL FIX: Remove previous listener before adding the new one
        selector.removeEventListener('change', handleLanguageChange);
        selector.addEventListener('change', handleLanguageChange);
        
        // Ensure the initial state of the selector matches the loaded language
        selector.value = savedLang;
    });
}

// --- EXECUTION TRIGGERS (The Astro Fix) ---

// 1. Initial Load
document.addEventListener('DOMContentLoaded', initializeI18n);

// 2. Astro View Transition (The Fix for soft navigation)
document.addEventListener('astro:page-load', initializeI18n);