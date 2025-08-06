
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Fetch user profile
    try {
        const userResponse = await fetch('http://localhost:5001/api/users/profile', {
            headers: {
                'x-access-token': token
            }
        });
        const userData = await userResponse.json();
        if (userResponse.ok) {
            document.querySelector('.dashboard-greeting').textContent = `Welcome back, ${userData.username}!`;
        } else {
            console.error('Failed to fetch user profile:', userData.message);
            // Optionally redirect to login if token is invalid
            // window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }

    // Fetch user bookings
    try {
        const bookingsResponse = await fetch('http://localhost:5001/api/bookings', {
            headers: {
                'x-access-token': token
            }
        });
        const bookingsData = await bookingsResponse.json();

        if (bookingsResponse.ok) {
            const upcomingPickupsContainer = document.querySelector('.upcoming-pickups');
            const recentPickupHistoryContainer = document.querySelector('.pickup-history');
            upcomingPickupsContainer.innerHTML = ''; // Clear existing dummy data
            recentPickupHistoryContainer.innerHTML = ''; // Clear existing dummy data

            let upcomingCount = 0;
            let totalCount = bookingsData.length;

            bookingsData.forEach(booking => {
                const pickupItem = `
                    <div class="pickup-item">
                        <div class="pickup-info">
                            <h4>${booking.junkType}</h4>
                            <p>📅 ${new Date(booking.pickupDate).toLocaleDateString()} • ${booking.status}</p>
                            <p>📍 ${booking.address}</p>
                        </div>
                        <div class="pickup-status">
                            <span class="badge badge-${booking.status.toLowerCase()}">${booking.status}</span>
                        </div>
                    </div>
                `;

                if (booking.status === 'pending' || booking.status === 'confirmed') {
                    upcomingPickupsContainer.innerHTML += pickupItem;
                    upcomingCount++;
                } else {
                    recentPickupHistoryContainer.innerHTML += pickupItem;
                }
            });

            document.querySelector('.stat-number:nth-child(1)').textContent = upcomingCount;
            document.querySelector('.stat-number:nth-child(2)').textContent = totalCount;
            // Total Spent is not implemented in backend yet, so it remains dummy

        } else {
            console.error('Failed to fetch bookings:', bookingsData.message);
        }
    } catch (error) {
        console.error('Error fetching bookings:', error);
    }

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
