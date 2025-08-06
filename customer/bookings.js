
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const bookingsTableBody = document.querySelector('.table tbody');
    const cancelModal = document.getElementById('cancelModal');
    let bookingToCancelId = null;

    const fetchBookings = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/bookings', {
                headers: {
                    'x-access-token': token
                }
            });
            const data = await response.json();

            if (response.ok) {
                bookingsTableBody.innerHTML = ''; // Clear existing data
                data.forEach(booking => {
                    const row = `
                        <tr>
                            <td>
                                <div>
                                    <strong>${new Date(booking.pickupDate).toLocaleDateString()}</strong><br>
                                    <small>${new Date(booking.pickupDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                                </div>
                            </td>
                            <td>${booking.junkType}</td>
                            <td>${booking.address}</td>
                            <td><span class="badge badge-${booking.status.toLowerCase()}">${booking.status}</span></td>
                            <td>$0</td> <!-- Price is not implemented in backend -->
                            <td>
                                ${booking.status === 'pending' || booking.status === 'confirmed' ?
                                    `<button class="btn btn-small btn-danger cancel-btn" data-id="${booking.id}">Cancel</button>` :
                                    `<span style="color: #64748b; font-size: 0.875rem;">-</span>`
                                }
                            </td>
                        </tr>
                    `;
                    bookingsTableBody.innerHTML += row;
                });

                // Add event listeners to new cancel buttons
                document.querySelectorAll('.cancel-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        bookingToCancelId = e.target.dataset.id;
                        cancelModal.style.display = 'flex';
                    });
                });

            } else {
                console.error('Failed to fetch bookings:', data.message);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    // Initial fetch
    fetchBookings();

    // Handle modal close
    document.querySelector('.modal-close').addEventListener('click', () => {
        cancelModal.style.display = 'none';
        bookingToCancelId = null;
    });

    // Handle actual cancellation
    document.querySelector('.modal-footer .btn-danger').addEventListener('click', async () => {
        if (bookingToCancelId) {
            try {
                const response = await fetch(`http://localhost:5001/api/bookings/${bookingToCancelId}`, {
                    method: 'DELETE',
                    headers: {
                        'x-access-token': token
                    }
                });
                const data = await response.json();

                if (response.ok) {
                    alert(data.message);
                    cancelModal.style.display = 'none';
                    bookingToCancelId = null;
                    fetchBookings(); // Refresh bookings list
                } else {
                    alert(data.message || 'Failed to cancel booking.');
                }
            } catch (error) {
                console.error('Error cancelling booking:', error);
                alert('An error occurred during cancellation.');
            }
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
