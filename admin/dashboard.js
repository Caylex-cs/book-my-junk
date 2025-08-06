document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
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

            let pendingCount = 0;
            let completedTodayCount = 0;
            let completedThisWeekCount = 0;

            const now = new Date(); // Current date and time
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startOfOneWeekAgo = new Date(startOfToday);
            startOfOneWeekAgo.setDate(startOfToday.getDate() - 7);

            console.log('Fetched bookings:', bookings); // Debug: See all fetched bookings

            bookings.forEach(booking => {
                const pickupDate = new Date(booking.pickupDate);

                // Update stats
                if (booking.status === 'pending') {
                    pendingCount++;
                }
                if (booking.status === 'completed') {
                    if (pickupDate.toDateString() === startOfToday.toDateString()) {
                        completedTodayCount++;
                    }
                    // For "This Week": from start of 7 days ago up to the current moment
                    if (pickupDate >= startOfOneWeekAgo && pickupDate <= now) {
                        completedThisWeekCount++;
                    }
                }

                // Populate Recent Bookings (all pending/confirmed)
                if (booking.status === 'pending' || booking.status === 'confirmed') {
                    console.log('Adding to recent bookings:', booking); // Debug: See what's added
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
                    console.log('Adding to today's schedule:', booking); // Debug: See what's added
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

            document.getElementById('totalPickupsToday').textContent = completedTodayCount;
            document.getElementById('pendingRequests').textContent = pendingCount;
            document.getElementById('completedThisWeek').textContent = completedThisWeekCount;
            // Revenue is not implemented in backend yet

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