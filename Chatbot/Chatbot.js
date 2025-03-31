document.addEventListener('DOMContentLoaded', function() {
    const inputField = document.querySelector('.input-field');
    const sendButton = document.querySelector('.send-button');
    const micButton = document.querySelector('.mic-button');
    const cards = document.querySelectorAll('.card');
    
    // Handle send button click
    sendButton.addEventListener('click', function() {
        sendMessage();
    });
    
    // Handle enter key press in input field
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Handle microphone button click
    micButton.addEventListener('click', function() {
        // In a real implementation, this would trigger speech recognition
        alert('Voice input feature would be activated here');
    });
    
    // Handle suggestion card clicks
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.card-title').textContent;
            const subtitle = this.querySelector('.card-subtitle').textContent;
            inputField.value = `${title} ${subtitle}`.trim();
            // Optional: Auto-send the message
            // sendMessage();
        });
    });
    
    function sendMessage() {
        const message = inputField.value.trim();
        if (message) {
            // In a real implementation, this would send the message to an AI service
            console.log('Sending message:', message);
            alert(`Message sent: ${message}`);
            inputField.value = '';
        }
    }
});