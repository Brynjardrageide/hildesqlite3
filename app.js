const express = require('express');
const app = express();

const path = require('path');
const sqlite3 = require('better-sqlite3');

// ----------------------------------------------------------------

const mainFolder = path.join(__dirname, 'public');
app.use(express.static(mainFolder));

// ----------------------------------------------------------------

const db = sqlite3('./database/users.db', { verbose: console.log });


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

// ----------------------------------------------------------------

app.get("/users", getUsers);
 
app.get("/users.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public/users.html"));
});
 
// ----------------------------------------------------------------

app.listen(3000, () => {
    console.log('Server listening at http://localhost:3000');
});