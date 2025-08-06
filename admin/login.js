
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.auth-form');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5001/api/auth/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Check if the logged-in user is an admin
                // This is a basic check; a more robust solution would involve decoding JWT on client or another API call
                // For now, we assume if login is successful and it's admin login page, they are admin.
                // In a real app, you'd verify role from the token or a /me endpoint.
                localStorage.setItem('adminToken', data.token);
                displayMessage('Admin Login successful! Redirecting...', 'success');
                window.location.href = 'dashboard.html'; // Redirect to admin dashboard
            } else {
                let userFriendlyMessage = 'Admin login failed. Please try again.';
                if (data.message === 'Authentication failed. User not found.') {
                    userFriendlyMessage = 'No admin account found with that email.';
                } else if (data.message === 'Authentication failed. Wrong password.') {
                    userFriendlyMessage = 'Incorrect password. Please try again.';
                } else if (data.message === 'Authentication failed. Not an admin.') {
                    userFriendlyMessage = 'This account is not an admin account.';
                }
                displayMessage(userFriendlyMessage, 'error');
            }
        } catch (error) {
            console.error('Error during admin login:', error);
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
