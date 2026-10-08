// src/scripts/modal-handler.js

// Define the function that sets up the modal logic
function initializeModalHandler() {
    // --- 1. Variable Definitions (ALL variables are defined here) ---
    const body = document.body;
    const modal = document.getElementById("curriculumModal"); 
    const openModalBtn = document.getElementById("openCurriculumModal");
    
    // Safety check: if elements are missing, the script stops gracefully.
    // If we are on a page without this modal, just return.
    if (!modal || !openModalBtn) {
        return;
    }

    // The querySelector must be run on the modal element (now safe)
    const closeModalBtn = modal.querySelector(".close-button");

    // --- 2. Core Functions ---
    function openModal() {
        modal.style.display = "block";
        body.classList.add("no-scroll"); 
        modal.setAttribute("aria-hidden", "false");
        modal.setAttribute("role", "dialog");
        // Ensure the close button exists before focusing
        if (closeModalBtn) {
            closeModalBtn.focus();
        }
    }

    function closeModal() {
        modal.style.display = "none";
        body.classList.remove("no-scroll");
        modal.setAttribute("aria-hidden", "true");
        modal.removeAttribute("role");
        openModalBtn.focus();
    }

    // --- 3. Clean up and Add Event Listeners ---
    
    // CRITICAL: Remove old listeners to prevent duplication on astro:page-load
    // Note: We can only remove listeners if the original function (openModal, closeModal) is used.
    openModalBtn.removeEventListener("click", openModal);
    if (closeModalBtn) {
        closeModalBtn.removeEventListener("click", closeModal);
    }

    // Add new listeners
    openModalBtn.addEventListener("click", openModal);
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeModal);
    }
    
    /*
     * NOTE on Window/Document Listeners: 
     * It's safest to keep global listeners outside the function 
     * or use a flag to ensure they only run ONCE. 
     * However, since this script only runs on pages *with* the modal, 
     * and the functions openModal/closeModal rely on scoped variables, 
     * the cleanest approach is to move this entire file's logic to an inline
     * script inside the component that contains the modal. 
     * Since we must keep it external: We'll rely on the fact that if the elements 
     * exist, we re-add the listeners. We'll leave the window/document listeners 
     * as they are since they will rely on `event.target === modal` which handles cleanup implicitly.
    */
   
    // Close modal when clicking on the dark overlay (window click)
    // NOTE: This listener still attaches globally, but its effect is localized.
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal on Escape key press
    document.addEventListener("keydown", (event) => {
        // Only run if the modal is currently visible
        if (event.key === "Escape" && modal.style.display === "block") {
            closeModal();
        }
    });
}


// --- EXECUTION TRIGGERS (The Fix) ---

// 1. Initial Load (Hard navigation)
document.addEventListener("DOMContentLoaded", initializeModalHandler);

// 2. Astro View Transition (Soft navigation)
document.addEventListener("astro:page-load", initializeModalHandler);