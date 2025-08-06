
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const profileForm = document.querySelector('.profile-form');
    const passwordForm = document.querySelector('.password-form');
    const deleteAccountBtn = document.querySelector('.danger-zone .btn-danger');
    const deleteConfirmationInput = document.getElementById('delete-confirmation');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const deleteModal = document.getElementById('deleteModal');

    // Fetch and populate user profile data
    try {
        const response = await fetch('http://localhost:5001/api/users/profile', {
            headers: {
                'x-access-token': token
            }
        });
        const data = await response.json();

        if (response.ok) {
            document.getElementById('name').value = data.username; // Assuming username is used for name
            document.getElementById('email').value = data.username; // Assuming username is email
            // Phone and address are not in backend schema, so leave as dummy or remove
        } else {
            console.error('Failed to fetch profile:', data.message);
            // Optionally redirect to login if token is invalid
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }

    // Update Profile
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newUsername = document.getElementById('name').value; // Using name field for username update

        try {
            const response = await fetch('http://localhost:5001/api/users/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({ username: newUsername })
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
            } else {
                alert(data.message || 'Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred.');
        }
    });

    // Change Password
    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;

        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/users/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                passwordForm.reset();
            } else {
                alert(data.message || 'Failed to change password.');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('An error occurred.');
        }
    });

    // Delete Account Modal Logic
    deleteAccountBtn.addEventListener('click', () => {
        deleteModal.style.display = 'flex';
    });

    document.querySelector('.modal-close').addEventListener('click', () => {
        deleteModal.style.display = 'none';
        deleteConfirmationInput.value = '';
        confirmDeleteBtn.disabled = true;
    });

    deleteConfirmationInput.addEventListener('keyup', () => {
        confirmDeleteBtn.disabled = deleteConfirmationInput.value !== 'DELETE';
    });

    confirmDeleteBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:5001/api/users', {
                method: 'DELETE',
                headers: {
                    'x-access-token': token
                }
            });
            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                localStorage.removeItem('token');
                window.location.href = 'signup.html'; // Redirect to signup or home after deletion
            } else {
                alert(data.message || 'Failed to delete account.');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('An error occurred during account deletion.');
        }
    });

    // Logout functionality
    const logoutLink = document.querySelector('.nav-links a[href="../index.html"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            window.location.href = 'login.html'; // Redirect to login page after logout
        });
    }
});
