CREATE TABLE user (
    ID INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile TEXT NOT NULL,
    picture TEXT NOT NULL
);

DROP TABLE IF EXISTS user;