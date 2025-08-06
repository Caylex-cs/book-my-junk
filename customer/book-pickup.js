
document.addEventListener('DOMContentLoaded', () => {
    const bookPickupForm = document.querySelector('.booking-form');

    bookPickupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            alert('You need to be logged in to book a pickup.');
            window.location.href = 'login.html';
            return;
        }

        const address = document.getElementById('address').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const junkType = document.getElementById('junk-type').value;
        const quantity = document.getElementById('quantity').value; // This will be appended to junkType

        if (!address || !date || !time || !junkType || !quantity) {
            alert('Please fill in all required fields.');
            return;
        }

        const pickupDate = `${date}T${time}:00`; // Combine date and time for ISO format
        const fullJunkType = `${junkType} (${quantity})`; // Combine junk type and quantity

        try {
            const response = await fetch('http://localhost:5001/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({ junkType: fullJunkType, pickupDate, address }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                window.location.href = 'dashboard.html'; // Redirect to dashboard on successful booking
            } else {
                alert(data.message || 'Booking failed.');
            }
        } catch (error) {
            console.error('Error during booking:', error);
            alert('An error occurred during booking. Please try again later.');
        }
    });
});
