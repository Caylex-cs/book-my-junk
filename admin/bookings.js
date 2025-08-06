document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const bookingsTableBody = document.querySelector('.table tbody');
    const searchInput = document.getElementById('search');
    const statusFilter = document.getElementById('status-filter');
    const dateFilter = document.getElementById('date-filter');
    const junkTypeFilter = document.getElementById('junk-type-filter');

    const fetchFilteredBookings = async () => {
        const searchTerm = searchInput.value;
        const selectedStatus = statusFilter.value;
        const selectedDateFilter = dateFilter.value;
        const selectedJunkType = junkTypeFilter.value;

        let queryParams = new URLSearchParams();
        if (searchTerm) {
            queryParams.append('search', searchTerm);
        }
        if (selectedStatus) {
            queryParams.append('status', selectedStatus);
        }
        if (selectedDateFilter) {
            queryParams.append('dateFilter', selectedDateFilter);
        }
        if (selectedJunkType) {
            queryParams.append('junkType', selectedJunkType);
        }

        const queryString = queryParams.toString();
        const url = `http://localhost:5001/api/admin/bookings${queryString ? `?${queryString}` : ''}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'x-access-token': token
                }
            });
            const data = await response.json();

            if (response.ok) {
                bookingsTableBody.innerHTML = ''; // Clear existing data
                if (data.length === 0) {
                    bookingsTableBody.innerHTML = '<tr><td colspan="7" class="text-center">No bookings found.</td></tr>';
                    return;
                }
                data.forEach(booking => {
                    const row = `
                        <tr>
                            <td>
                                <div>
                                    <strong>${booking.username}</strong><br>
                                    <small>User ID: ${booking.userId}</small>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <strong>${new Date(booking.pickupDate).toLocaleDateString()}</strong><br>
                                    <small>${new Date(booking.pickupDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                                </div>
                            </td>
                            <td>${booking.junkType}</td>
                            <td>${booking.address}</td>
                            <td>
                                <select class="form-input form-select status-select" data-id="${booking.id}" style="width: auto; padding: 4px 8px; font-size: 0.875rem;">
                                    <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>Pending</option>
                                    <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                                    <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Completed</option>
                                    <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                                </select>
                            </td>
                            <td>$0</td> <!-- Price not implemented -->
                            <td>
                                <div style="display: flex; gap: 0.5rem;">
                                    <button class="btn btn-small btn-secondary view-btn" data-id="${booking.id}">View</button>
                                    <!-- Edit and Delete buttons are placeholders for now -->
                                    <button class="btn btn-small btn-primary" disabled>Edit</button>
                                    <button class="btn btn-small btn-danger" disabled>Delete</button>
                                </div>
                            </td>
                        </tr>
                    `;
                    bookingsTableBody.innerHTML += row;
                });

                // Add event listeners for status change
                document.querySelectorAll('.status-select').forEach(select => {
                    select.addEventListener('change', async (e) => {
                        const bookingId = e.target.dataset.id;
                        const newStatus = e.target.value;
                        try {
                            const response = await fetch(`http://localhost:5001/api/admin/bookings/${bookingId}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'x-access-token': token
                                },
                                body: JSON.stringify({ status: newStatus })
                            });
                            const result = await response.json();
                            if (response.ok) {
                                alert(result.message);
                                // Re-fetch bookings to update the table with new status
                                fetchFilteredBookings();
                            } else {
                                alert(result.message || 'Failed to update status.');
                            }
                        } catch (error) {
                            console.error('Error updating status:', error);
                            alert('An error occurred while updating status.');
                        }
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
    fetchFilteredBookings();

    // Add event listeners for filters
    searchInput.addEventListener('input', fetchFilteredBookings);
    statusFilter.addEventListener('change', fetchFilteredBookings);
    dateFilter.addEventListener('change', fetchFilteredBookings);
    junkTypeFilter.addEventListener('change', fetchFilteredBookings);

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