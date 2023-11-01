const sqlite3 = require('sqlite3').verbose();
const express = require('express')
const fetch = require('node-fetch'); // You'll need to install the 'node-fetch' package


const app = express()

async function getRandomUser() {
    try {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        const user = data.results[0]; // Extract the first random user
        console.log(user);
    } catch (error) {
        console.error('Error fetching random user:', error);
    }
}

getRandomUser();
// Function to insert a user into the 'users' table
async function insertUser(user) {
    const {
        first,
        last,
        login,
        email,
        phone,
        picture,
        location,
    } = user;

    const addressInsert = db.prepare('INSERT INTO addresses (street, city, state, postal_code) VALUES (?, ?, ?, ?)');
    const addressInfo = addressInsert.run(location.street, location.city, location.state, location.postcode);
    const addressId = addressInfo.lastID;

    const userInsert = db.prepare('INSERT INTO users (addresses_id, first_name, last_name, username, password, email, mobile, img_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    const userInfo = userInsert.run(addressId, first, last, login.username, login.password, email, phone, picture.large);

    console.log(`Inserted user with ID: ${userInfo.lastID}`);
}

// Function to fetch random users from the Random User Generator API and insert them into the database
async function fetchAndInsertRandomUsers(count) {
    try {
        const response = await fetch(`https://randomuser.me/api/?results=${count}`);
        const data = await response.json();
        const users = data.results;

        for (const user of users) {
            await insertUser(user);
        }
    } catch (error) {
        console.error('Error fetching and inserting random users:', error);
    }
}

// Fetch and insert 10 random users into the 'users' table
fetchAndInsertRandomUsers(10);
function adduser() {
    const sql = db.prepare('INSERT INTO users (first_name, last_name, username, password, email, mobile) VALUES (?, ?, ?, ?, ?, ?)')
    const info = sql.run('brynjar', 'Olsen', 'ole', '1234', 'brynjar@drageide.com', '12345678')
    console.log(info.lastInsertRowid)
}
function deleteAllUsers() {
    const sql = 'DELETE FROM users';
    db.run(sql, (err) => {
        if (err) {
            console.error('Error deleting rows:', err.message);
        } else {
            console.log('All rows deleted from the users table.');
        }
    });
}
    


/* app.get('/', async (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows)
    })  

}) */


app.listen(process.env.PORT || 3000, () => console.log('App available on http://localhost:3000'));

// koble til databasen
const db = new sqlite3.Database('./database/users.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

app.get('/deleteAllUsers', (req, res) => {
    deleteAllUsers();
    res.send('Deleting all users...');
});