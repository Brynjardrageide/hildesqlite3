document.addEventListener('DOMContentLoaded', (event) => {
    const newUserForm = document.getElementById('newUserForm');

    newUserForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Extract the form data
        const username = document.getElementById('newUsername').value;
        const firstName = document.getElementById('newFirstname').value;
        const lastName = document.getElementById('newLastname').value;
        const email = document.getElementById('newEmail').value;
        const mobile = document.getElementById('newMobile').value;
        const picture = document.getElementById('newPicture').value;

        // Validate input data
        // Add your validation logic here

        // Create a new user object
        const newUser = {
            username: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            mobile: mobile,
            picture: picture
        };

        // Set up the request options
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        };

        try {
            // Send the POST request
            const response = await fetch('/user', requestOptions);
            if (response.ok) {
                const data = await response.json();
                // Handle success - maybe clear the form or display a success message
                console.log('User added:', data);
            } else {
                // Handle errors - maybe display an error message
                console.error('Error adding user:', response.statusText);
            }
        } catch (error) {
            // Handle network errors
            console.error('Network error:', error);
        }
    });
});
