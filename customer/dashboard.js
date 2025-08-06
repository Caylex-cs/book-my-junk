
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Fetch user profile and dashboard stats
    try {
        const [userResponse, statsResponse, bookingsResponse] = await Promise.all([
            fetch('http://localhost:5001/api/users/profile', {
                headers: { 'x-access-token': token }
            }),
            fetch('http://localhost:5001/api/users/dashboard-stats', {
                headers: { 'x-access-token': token }
            }),
            fetch('http://localhost:5001/api/bookings', {
                headers: { 'x-access-token': token }
            })
        ]);

        const userData = await userResponse.json();
        const statsData = await statsResponse.json();
        const bookingsData = await bookingsResponse.json();

        if (userResponse.ok) {
            document.querySelector('.dashboard-greeting').textContent = `Welcome back, ${userData.username}!`;
        } else {
            console.error('Failed to fetch user profile:', userData.message);
        }

        if (statsResponse.ok) {
            document.querySelector('.stat-number:nth-child(1)').textContent = statsData.upcomingPickups;
            document.querySelector('.stat-number:nth-child(2)').textContent = statsData.totalPickups;
            document.querySelector('.stat-number:nth-child(3)').textContent = `${statsData.totalSpent}`;
        } else {
            console.error('Failed to fetch dashboard stats:', statsData.message);
        }

        if (bookingsResponse.ok) {
            const upcomingPickupsContainer = document.querySelector('.upcoming-pickups');
            const recentPickupHistoryContainer = document.querySelector('.pickup-history');
            upcomingPickupsContainer.innerHTML = ''; // Clear existing dummy data
            recentPickupHistoryContainer.innerHTML = ''; // Clear existing dummy data

            bookingsData.forEach(booking => {
                const pickupItem = `
                    <div class="pickup-item">
                        <div class="pickup-info">
                            <h4>${booking.junkType}</h4>
                            <p>📅 ${new Date(booking.pickupDate).toLocaleDateString()} • ${new Date(booking.pickupDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p>📍 ${booking.address}</p>
                            ${booking.price ? `<p>💰 ${booking.price.toFixed(2)}</p>` : ''}
                        </div>
                        <div class="pickup-status">
                            <span class="badge badge-${booking.status.toLowerCase()}">${booking.status}</span>
                        </div>
                    </div>
                `;

                const now = new Date();
                const pickupDate = new Date(booking.pickupDate);

                if (pickupDate > now && (booking.status === 'pending' || booking.status === 'confirmed')) {
                    upcomingPickupsContainer.innerHTML += pickupItem;
                } else if (pickupDate <= now && (booking.status === 'completed' || booking.status === 'cancelled')) {
                    recentPickupHistoryContainer.innerHTML += pickupItem;
                }
            });
        } else {
            console.error('Failed to fetch bookings:', bookingsData.message);
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Optionally redirect to login if token is invalid or network error
        // window.location.href = 'login.html';
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
