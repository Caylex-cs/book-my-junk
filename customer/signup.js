
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('.auth-form');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            displayMessage('Passwords do not match!', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                displayMessage('Account created successfully! Redirecting to login...', 'success');
                window.location.href = 'login.html'; // Redirect to login page on successful signup
            } else if (response.status === 409) {
                displayMessage('This email is already registered. Please try logging in or use a different email.', 'error');
            } else {
                displayMessage(data.message || 'Signup failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            displayMessage('An unexpected error occurred during signup. Please try again later.', 'error');
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
