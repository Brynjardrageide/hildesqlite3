const express = require('express');
const app = express();

const path = require('path');
const sqlite3 = require('better-sqlite3');

// ----------------------------------------------------------------

const mainFolder = path.join(__dirname, 'public');
app.use(express.static(mainFolder));

// ----------------------------------------------------------------

const db = sqlite3('./database/husarbeid.db', { verbose: console.log });


// ----------------------------------------------------------------

async function getUsers(request, response) {
    if (!request.query.results) {
        request.query.results = 10;
    }

    if (!request.query.nat) {
        request.query.nat = "us";
    }
    const baseURL = "https://randomuser.me/api/?";
    const url = baseURL + new URLSearchParams(request.query);
    
    const fetch_response = await fetch(url);
    const json = await fetch_response.json();
    
    response.send(json.results);
}

async function fetchDataAndInsert() {
    try {
        const response = await fetch('https://randomuser.me/api/?results=7');
        const data = await response.json();

        data.results.forEach(user => {
            const nameStmt = db.prepare('INSERT INTO names (first_name, last_name) VALUES (?, ?)');
            const nameInfo = user.name;
            const nameResult = nameStmt.run(nameInfo.first, nameInfo.last);

            const locationStmt = db.prepare('INSERT INTO location (country, city, street) VALUES (?, ?, ?)');
            const locationInfo = user.location;
            const locationResult = locationStmt.run(locationInfo.country, locationInfo.city, locationInfo.state);

            const genderStmt = db.prepare('INSERT INTO gender (gender) VALUES (?)');
            const genderInfo = user.gender;
            const genderResult = genderStmt.run(genderInfo);

            const userStmt = db.prepare('INSERT INTO users (name_id, location_id, gender_id) VALUES (?, ?, ?)');
            const userResult = userStmt.run(nameResult.lastInsertRowid, locationResult.lastInsertRowid, genderResult.lastInsertRowid);
        });

        console.log('Data inserted successfully!');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        db.close(); // Close the database connection
    }
}

//console.log users
const selectFirstUser = db.prepare(`
SELECT users.user_id, names.first_name, names.last_name, location.country, location.city, location.street, gender.gender
FROM users
INNER JOIN names ON users.name_id = names.name_id
INNER JOIN location ON users.location_id = location.location_id
INNER JOIN gender ON users.gender_id = gender.gender_id
`);
const firstUser = selectFirstUser.all();

if (firstUser) {
    console.log('First User:', firstUser);
} else {
    console.log('No users found in the table.');
}

// ----------------------------------------------------------------

app.get('/users', (req, res) => {
    getUsers(req, res)
});



app.get('/api/tasks', (req, res) => {
    const stmt = db.prepare('SELECT * FROM tasks');
    const rows = stmt.all();
    console.log(rows);
    res.json({ tasks: rows });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(mainFolder, 'index.html'));
});

// ----------------------------------------------------------------

app.listen(3000);