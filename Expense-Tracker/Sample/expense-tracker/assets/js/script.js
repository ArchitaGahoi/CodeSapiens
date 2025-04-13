// This file contains the JavaScript functionality for the Expense Tracker application.

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // Simulate login process (replace with actual authentication logic)
            if (email && password) {
                alert('Login successful!');
                // Redirect to dashboard or main page
                window.location.href = 'index.html';
            } else {
                alert('Please fill in all fields.');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const currency = document.getElementById('signupCurrency').value;

            // Simulate signup process (replace with actual registration logic)
            if (name && email && password && currency) {
                alert('Signup successful! You can now log in.');
                // Redirect to login page
                window.location.href = 'login.html';
            } else {
                alert('Please fill in all fields.');
            }
        });
    }
});