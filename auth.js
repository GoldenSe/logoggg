window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('id') && params.has('first_name')) {
        const userId = params.get('id');
        const firstName = params.get('first_name');
        document.getElementById('username').textContent = `Hello, ${firstName}!`;
        
        // Optionally use local storage or another method to store user data
        localStorage.setItem('telegramUserId', userId);
        localStorage.setItem('telegramFirstName', firstName);
    }
};
