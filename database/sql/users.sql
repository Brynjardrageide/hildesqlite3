/* CREATE TABLE users(
    ID INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile TEXT NOT NULL
); */

DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    addresses_id INTEGER,
    first_name TEXT,
    last_name TEXT,
    username TEXT,
    password TEXT,
    email TEXT,
    mobile TEXT,
    img_url TEXT,
    FOREIGN KEY (addresses_id) REFERENCES addresses (id)
);

CREATE TABLE IF NOT EXISTS addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    street TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT
);

DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS users;