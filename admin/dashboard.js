document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Fetch dashboard stats
    try {
        const statsResponse = await fetch('http://localhost:5001/api/admin/dashboard-stats', {
            headers: {
                'x-access-token': token
            }
        });
        const statsData = await statsResponse.json();

        if (statsResponse.ok) {
            document.getElementById('totalPickupsToday').textContent = statsData.totalPickupsToday;
            document.getElementById('pendingRequests').textContent = statsData.pendingRequests;
            document.getElementById('completedThisWeek').textContent = statsData.completedThisWeek;
            document.getElementById('revenueThisWeek').textContent = `${statsData.revenueThisWeek}`;
        } else {
            console.error('Failed to fetch admin dashboard stats:', statsData.message);
        }
    } catch (error) {
        console.error('Error fetching admin dashboard stats:', error);
    }

    // Fetch all bookings for admin dashboard
    try {
        const response = await fetch('http://localhost:5001/api/admin/bookings', {
            headers: {
                'x-access-token': token
            }
        });
        const bookings = await response.json();

        if (response.ok) {
            const recentBookingsContainer = document.querySelector('.recent-bookings');
            const scheduleTableBody = document.querySelector('.schedule-table tbody');
            recentBookingsContainer.innerHTML = '';
            scheduleTableBody.innerHTML = '';

            const now = new Date(); // Current date and time
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            bookings.forEach(booking => {
                const pickupDate = new Date(booking.pickupDate);

                // Populate Recent Bookings (all pending/confirmed)
                if (booking.status === 'pending' || booking.status === 'confirmed') {
                    const recentBookingItem = `
                        <div class="booking-item">
                            <div class="booking-info">
                                <h4>${booking.username}</h4>
                                <p>${new Date(pickupDate).toLocaleDateString()} ${new Date(pickupDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <p>📍 ${booking.address}</p>
                            </div>
                            <div class="booking-status">
                                <span class="badge badge-${booking.status.toLowerCase()}">${booking.status}</span>
                            </div>
                        </div>
                    `;
                    recentBookingsContainer.innerHTML += recentBookingItem;
                }

                // Populate Today's Schedule (all bookings for today)
                if (pickupDate.toDateString() === startOfToday.toDateString()) {
                    const scheduleRow = `
                        <tr>
                            <td>${pickupDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                            <td>${booking.username}</td>
                            <td>${booking.junkType}</td>
                            <td>${booking.address}</td>
                            <td><span class="badge badge-${booking.status.toLowerCase()}">${booking.status}</span></td>
                            <td>
                                <button class="btn btn-small btn-primary view-booking-btn" data-id="${booking.id}">View</button>
                            </td>
                        </tr>
                    `;
                    scheduleTableBody.innerHTML += scheduleRow;
                }
            });

        } else {
            console.error('Failed to fetch admin bookings:', bookings.message);
            // Optionally redirect to login if token is invalid
            // window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
    }

    // Logout functionality
    const logoutLink = document.querySelector('.sidebar-nav a[href="../index.html"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('adminToken');
            window.location.href = 'login.html'; // Redirect to admin login page after logout
        });
    }
});