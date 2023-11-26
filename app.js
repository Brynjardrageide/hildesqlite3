const express = require("express");
const path = require("path");
const sqlite3 = require('better-sqlite3');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const staticPath = path.join(__dirname, 'public');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(staticPath));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

const validUser = {
    username: 'user123',
    password: 'pass123'
};

app.post('/login', (req, res) => {
    console.log(req.body);
    if (req.body.username === validUser.username && req.body.password === validUser.password) {
        req.session.loggedIn = true;
        res.redirect('/');
    } else {
        req.session.loggedIn = false;
        res.sendFile(path.join(__dirname, "public/loginForm.html"));
    }
});

app.use((req, res, next) => {
    console.log(req.session.loggedIn);
    if (req.session.loggedIn) {
        console.log("User is logged in");
        next();
    } else {
        res.sendFile(path.join(__dirname, "public/loginForm.html"));
    }
});


async function getUsers(request, response) {
    let users = null
    const sql=db.prepare('SELECT ID, username, firstname, lastname, email, mobile, picture FROM user')
    let rows = sql.all()   //await db.query(sql)
    console.log("rows.length",rows.length)
    if (rows.length === 0) {
        console.log("No users found. Empty DB")

        users = await getAPIUsers()
        users.forEach(user => {
            console.log(user.name.first, user.name.last)
            addUser(user.login.username, user.name.first, user.name.last, user.email, user.cell, user.picture.large )
        })

    }
    else {
        users = rows.map(user => ({
            id: user.ID,
            name: {
                first: user.firstname,
                last: user.lastname,
            },
            email: user.email,
            login: {
                username: user.username,
            },
            mobile: user.mobile,
            picture: {
                large: user.picture // You will need to provide a proper URL or handle this on the client-side.
            }
        }));
        //console.log(users)
    }
    response.send(users);

}

function addUser(req, res) {
    const { username, firstName, lastName, email, mobile, picture } = req.body;
    const sql = db.prepare("INSERT INTO user (username, firstName, lastName, email, mobile, picture) VALUES (?, ?, ?, ?, ?, ?)");
    try {
        const info = sql.run(username, firstName, lastName, email, mobile, picture);
        res.status(201).json({ message: "User added successfully", userId: info.lastInsertRowid });
    } catch (error) {
        res.status(500).json({ message: "Error adding user", error: error.message });
    }
}


function updateUserDB(username, firstName, lastName, email, mobile) {
    const sql = db.prepare("update user set firstName=(?), lastName =(?), email =(?), mobile=(?)  where username=(?)")
    const info = sql.run(firstName, lastName, email, mobile, username)
}

async function getAPIUsers() {
    const url="https://randomuser.me/api/?results=10&nat=no"
    const fetch_response = await fetch(url)
    const json = await fetch_response.json()
    return(json.results)

}
async function updateUser(request,response) {
    console.log(request.body)
    const user = request.body
    updateUserDB(user.username, user.name.first, user.name.last, user.email, user.mobile)
}


app.get("/users", getUsers);

app.put("/user", updateUser);
app.post("/user", addUser);
app.post('/login', (req, res) => {
    console.log(req.body)
    if (req.body.username === validUser.username && req.body.password === validUser.password) {
        req.session.loggedIn = true;
        res.redirect('/');
    } else {
        req.session.loggedIn = false;
        res.sendFile(path.join(__dirname, "public/loginForm.html"));
    }
    
});

app.delete('/user/:id', (req, res) => {
    const { id } = req.params;
    const sql = db.prepare("DELETE FROM user WHERE ID = ?");
    try {
        const result = sql.run(id);
        if (result.changes === 0) {
            res.status(404).json({ success: false, message: "User not found" });
        } else {
            res.json({ success: true, message: "User deleted successfully" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting user", error: error.message });
    }
});


app.get("/users.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public/users.html"));
});



app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
