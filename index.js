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
app.get("/users", (request, response) => {
    client.query('SELECT * FROM users', (err, result) => {
        if(err) {
            response.status(500).send();
            return console.log(`${err}. stupid server`)
        };
        response.send(result.rows);
    });
});

app.post("/users", (request, response) => {
    const queryText = 'INSERT INTO users (username, bio) VALUES ($1, $2) RETURNING *';
    const values = [request.body.username, request.body.bio];
    client.query(queryText, values, (err, result) => {
        if(err) {
            response.status(500).send();
            return console.log(`${err}. stupid server`)
        };
        response.status(201).send(result.rows[0]); // have to send this stuff to the server because this is adding a new user to the db 
        console.log(result.rows[0]);
    });
});


// strart server listens on port 3000 and conbwxrs sql clienr on success
app.listen(port, () => {
    client.connect();
    console.log(`cpnnexting pon port ${port}`)
})

// sql join to get posts included 