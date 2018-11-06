const {Client} = require("pg");
const express = require("express");

let port = 3000;

// create exptdss app
const app = express();
app.use(express.json());
// create a postgresql client 
const client = new Client({
    database: 'social-media'
});


// route handlers go here

// show all users
app.get("/users", (request, response) => {
    client.query('SELECT * FROM users', (err, result) => {
        if(err) {
            response.status(500).send();
            return console.log(`${err}. stupid server. try again later.`)
        };
        response.send(result.rows);
    });
});

// make a new user
app.post("/users", (request, response) => {
    const queryText = 'INSERT INTO users (username, bio) VALUES ($1, $2) RETURNING *';
    const values = [request.body.username, request.body.bio];
    client.query(queryText, values, (err, result) => {
        if(err) {
            response.status(500).send();
            return console.log(`${err}. stupid server. try again later.`)
        };
        response.status(201).send(result.rows[0]); // have to send this stuff to the server because this is adding a new user to the db 
        console.log(result.rows[0]); // result.rows[0] is for the first column in the db 
    });
});

// // get only the id of a user back
// app.get("/users/:id", (request, response) => {
//     const idValue = request.params.id; // params are used for the selfdefined parameter for receiving reqs 
//     // const queryText = `SELECT * FROM users WHERE id=${idValue}`;
//     const queryText = `SELECT id FROM users WHERE id=${idValue}`;
//     client.query(queryText, (err, result) => {
//         if(err) {
//             response.status(500).send();
//             return console.log(`${err}. stupid server. try again later.`);
//         };
//         if(result.rows == 0) {
//             response.status(404).send();
//             return console.log(`${err} because no user by that name was found :'(`);
//         };
//         response.status(201).send(result.rows[0]); // have to send this stuff to the server because this is adding a new user to the db 
//         console.log(result.rows[0]);
//     });
// });

// sql join to get posts included; user with all info and post 
app.get("/users/:id", (request, response) => {
    // const idValue = request.params.id; 
    // const queryText = `SELECT users.id AS userID, username, bio, posts.id AS postID, title, body 
    //                         FROM users 
    //                         LEFT JOIN posts
    //                             ON users.id = posts.user_id`;
    // client.query(queryText, (err, result) => {
    //     if(err) {
    //         response.status(500).send();
    //         return console.log(`${err}. stupid server. try again later.`);
    //     };
    //     if(result.rows == 0) {
    //         response.status(404).send();
    //         return console.log(`${err} because no user by that name was found :'(`);
    //     };
    //     response.status(201).send(result.rows[0]); 
    //     console.log(result.rows[0]);
    // });

    const values = [request.params.id]; 
    const text = 
    `SELECT posts.id AS pid, posts.title, posts.body, users.* 
        FROM users 
        LEFT JOIN posts 
            ON users.id=posts.user_id 
        WHERE users.id=$1`
    client.query(text, values, (err, result) => {
        if(err) {
            response.status(500).send();
            return console.log(`${err}. stupid server. try again later.`);
        };
        if(result.rows == 0) { // or could do if rowCount is 0, meaning 0 rows; or rows.length 
            response.status(404).send();
            return console.log(`${err} because no user by that name was found :'(. try another number`);
        };
        response.status(201).send(posts); 
        console.log(posts);
    });
});

// strart server listens on port 3000 and conbwxrs sql clienr on success
app.listen(port, () => {
    client.connect();
    console.log(`cpnnexting pon port ${port}`);
});