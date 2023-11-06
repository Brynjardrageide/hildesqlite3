const express = require("express");
const path = require("path");
const sqlite3 = require('better-sqlite3')
const db = sqlite3('./database/users.db', {verbose: console.log})
 
const app = express();
 
app.use(express.static(path.join(__dirname, "public")));
 
async function getUsers(request, response) {
 
    const sql=db.prepare('SELECT username, firstname, lastname, mobile, picture FROM user')
    let rows = sql.all()   //await db.query(sql)
    if (rows.length === 0) {
        console.log("No users found. Empty DB")
 
        let apiUsers = await getAPIUsers()
        apiUsers.forEach(user => {
            console.log(user.name.first, user.name.last)
            addUser(user.login.username, user.name.first, user.name.last, user.cell, user.picture.large )
        })
 
    }
/*
    if (!request.query.results) {
        request.query.results = 10;
    }
 
    if (!request.query.nat) {
        request.query.nat = "us";
    }
    const baseURL = "https://randomuser.me/api/?";
    //https://randomuser.me/api/?results=10&nat=us
    const url = baseURL + new URLSearchParams(request.query);
   
    const fetch_response = await fetch(url);
    const json = await fetch_response.json();
   
 */    response.send(json.results);
}
 
function addUser(username, firstName, lastName, mobile, picture) {
    const sql = db.prepare("INSERT INTO user (username, firstName, lastName, mobile, picture) values (?, ?, ?, ?, ?)")
    const info = sql.run(username, firstName, lastName, mobile, picture)
}
 
async function getAPIUsers() {
    const url="https://randomuser.me/api/?results=10&nat=no"
    const fetch_response = await fetch(url)
    const json = await fetch_response.json()
    return(json.results)
 
}
 
 
app.get("/users", getUsers);
 
app.get("/users.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public/users.html"));
});
 
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
 