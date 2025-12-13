document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.bank-tab-button');
    const contentAreas = document.querySelectorAll('.bank-details-content');
    const copyButtons = document.querySelectorAll('.copy-button');

    // 1. Tab Switching Functionality
    const switchTab = (bankType) => {
        // Deactivate all buttons and content
        tabButtons.forEach(btn => btn.classList.remove('active'));
        contentAreas.forEach(content => content.classList.remove('active'));

        // Activate the selected button and content
        const activeBtn = document.querySelector(`.bank-tab-button[data-bank="${bankType}"]`);
        const activeContent = document.getElementById(`${bankType}-bank-details`);

        if (activeBtn) activeBtn.classList.add('active');
        if (activeContent) activeContent.classList.add('active');
    };

    // Add click listeners to buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const bankType = event.target.dataset.bank;
            switchTab(bankType);
        });
    });

    // Initialize: Ensure the first tab is active on load
    switchTab('nepal');


    // 2. Copy-to-Clipboard Functionality
    copyButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            // Find the parent .copy-group
            const copyGroup = event.currentTarget.closest('.copy-group');
            // Find the sibling .copy-target (the value to copy)
            const copyTarget = copyGroup.querySelector('.copy-target');
            // Find the sibling .copy-message (the "Copied!" pop-up)
            const copyMessage = copyGroup.querySelector('.copy-message');
            
            if (copyTarget && navigator.clipboard) {
                try {
                    // Copy text to clipboard
                    await navigator.clipboard.writeText(copyTarget.textContent.trim());

                    // Show confirmation message
                    copyMessage.classList.add('show');

                    // Hide message after a delay
                    setTimeout(() => {
                        copyMessage.classList.remove('show');
                    }, 1500);

                } catch (err) {
                    console.error('Could not copy text: ', err);
                    // Fallback for environments without clipboard API access (optional)
                    alert(`Could not automatically copy. Please manually copy this value: ${copyTarget.textContent.trim()}`);
                }
            } else {
                // Fallback for old browsers
                console.warn('Clipboard API not supported or copy target not found.');
            }
        });
    });
});