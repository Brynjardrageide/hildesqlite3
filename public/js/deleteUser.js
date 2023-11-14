document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
});

function fetchUsers() {
    fetch('/users')
        .then(response => response.json())
        .then(users => {
            const usersTableBody = document.querySelector('#usersTable tbody');
            users.forEach(user => {
                const row = usersTableBody.insertRow();
                // ... other cells being inserted ...
                row.insertCell().textContent = user.login.username;
                row.insertCell().textContent = user.name.first;
                row.insertCell().textContent = user.name.last;
                row.insertCell().textContent = user.email;
                row.insertCell().textContent = user.mobile;
                row.insertCell().textContent = user.picture.large;
                const deleteCell = row.insertCell();
                const deleteButton = getDeleteButton(user.id); // Make sure user object has an 'id' property
                deleteCell.appendChild(deleteButton);
            });
        });
        // Removed the incorrect 'users.forEach' loop here
}



function getDeleteButton(userId) {
    const button = document.createElement('button');
    button.textContent = 'Delete';
    button.dataset.userId = userId; // Store the user ID in the button's dataset
    button.addEventListener('click', function() {
        deleteUser(this.dataset.userId); // Use the stored ID when calling deleteUser
    });
    return button;
}

function deleteUser(userId) {
    if (!confirm(`Are you sure you want to delete user ID: ${userId}?`)) {
        return;
    }

    fetch(`/user/${encodeURIComponent(userId)}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) {
                console.error('Error deleting user:', response.statusText);
                return;
            }
            return response.json();
        })
        .then(data => {
            if (data && data.success) {
                console.log('User deleted successfully');
                document.querySelector(`button[data-user-id="${userId}"]`).closest('tr').remove();
            } else {
                console.error('Error deleting user:', data.message);
            }
        })
        .catch(error => {
            console.error('Network error:', error);
        });
}