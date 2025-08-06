
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.auth-form');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5001/api/auth/customer/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                displayMessage('Login successful! Redirecting...', 'success');
                window.location.href = 'dashboard.html'; // Redirect to dashboard on successful login
            } else {
                let userFriendlyMessage = 'Login failed. Please check your credentials.';
                if (data.message === 'Authentication failed. User not found.') {
                    userFriendlyMessage = 'No account found with that email. Please sign up or try again.';
                } else if (data.message === 'Authentication failed. Wrong password.') {
                    userFriendlyMessage = 'Incorrect password. Please try again.';
                } else if (data.message === 'Authentication failed. Not a customer.') {
                    userFriendlyMessage = 'This account is not a customer account. Please use the customer login.';
                }
                displayMessage(userFriendlyMessage, 'error');
            }
        } catch (error) {
            console.error('Error during login:', error);
            displayMessage('An unexpected error occurred. Please try again later.', 'error');
        }
    });

    function displayMessage(message, type) {
        const errorMessageDiv = document.getElementById('error-message');
        errorMessageDiv.textContent = message;
        errorMessageDiv.className = 'error-message ' + type; // Add type for styling (e.g., 'error', 'success')
        errorMessageDiv.style.display = 'block';

        // Optional: Hide message after a few seconds
        setTimeout(() => {
            errorMessageDiv.style.display = 'none';
        }, 5000);
    }
});
