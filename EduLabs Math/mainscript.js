document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Add click event to each FAQ item
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Check if this item is already active
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // If the clicked item wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Add keyboard accessibility
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        // Add tabindex to make questions focusable
        question.setAttribute('tabindex', '0');
        
        // Add ARIA attributes
        question.setAttribute('aria-expanded', 'false');
        const answer = item.querySelector('.faq-answer');
        const answerId = 'answer-' + Math.random().toString(36).substr(2, 9);
        answer.setAttribute('id', answerId);
        question.setAttribute('aria-controls', answerId);
        
        // Handle keyboard events
        question.addEventListener('keydown', (e) => {
            // Toggle on Enter or Space
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
        
        // Update ARIA attributes when toggled
        question.addEventListener('click', () => {
            const isExpanded = item.classList.contains('active');
            question.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        });
    });
});