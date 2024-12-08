const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
    console.log("Conenction is open...");

    const UserSchema = mongoose.Schema({
        userID: {type: String, required: true, },
        userPassword: {type: String, required: true},
    });

    const User = mongoose.model("User", UserSchema);

    app.post('/userId/:userId/userPassword/:userPassword', (req, res) => {
        console.log("creating user id...");
        const newUserId = req.params.userId;
        const newUserPassword = req.params.userPassword;

        let newUser = new User({
            userID: newUserId,
            userPassword: newUserPassword,
        });
        newUser
            .save()
            .then(()=> {
                console.log("a new userId created successfully");
            })
            .catch((error)=> {
                console.log(error);
            });
        
        const message = `
        <html>
        <head>
            <title>Create User Id</title>
        </head>
        <body>
            <p>New user id: ${newUserId}</p>
            <p>New user password: ${newUserPassword}</p>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.send(message);
        
        
        
    });

    app.post('/readUserId', (req, res) => {
        console.log("reading user id...");

        User.find({})
        .then( (data) => {
            console.log(data);
        })
        .catch( (err) => {
            console.log("failed to read");
        });

        const message = `
            <html>
            <head>
                <title>Read User Id</title>
            </head>
            <body>
                <p></p>
            </body>
            </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.send(message);
    });

    app.post('/userId/:userId/userPassword/:userPassword/updatedUserId/:updatedUserId', (req, res) => {
        console.log("updating user id...");

        const filter = {
            userID: req.params.userId,
            userPassword: req.params.userPassword,
        };
        const update = {
            userID: req.params.updatedUserId,
            userPassword: req.params.userPassword,
        };

        User.findOneAndUpdate(filter, update,
            {new: true}
        )
        .then ( (data) => {
            console.log("the updated data is: ", data);
        })
        .catch( (err) => {
            console.log(err);
        });


        const newUserId = req.params.userId;
        const message = `
            <html>
            <head>
                <title>Update User Id</title>
            </head>
            <body>
                <p></p>
            </body>
            </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.send(message);

    });

    app.post('/userId/:userId/userPassword/:userPassword/updatedPassword/:updatedPassword', (req, res) => {
        console.log("updating user id...");

        const filter = {
            userID: req.params.userId,
            userPassword: req.params.userPassword,
        };
        const update = {
            userID: req.params.userId,
            userPassword: req.params.updatedPassword,
        };

        User.findOneAndUpdate(filter, update,
            {new: true}
        )
        .then ( (data) => {
            console.log("the updated data is: ", data);
        })
        .catch( (err) => {
            console.log(err);
        });


        const newUserId = req.params.userId;
        const message = `
            <html>
            <head>
                <title>Update User Id</title>
            </head>
            <body>
                <p></p>
            </body>
            </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.send(message);

    });

    app.post('/deleteUserId/:deleteUserId', (req, res) => {
        console.log("deleting user id...");
        const deleteUserId = req.params.deleteUserId;

        User.findOneAndDelete(
            {userID: deleteUserId},
        )
        .then ( (data) => {
            console.log("the deleted data is: ", data);
        })
        .catch( (err) => {
            console.log(err);
        });

        const message = `
            <html>
            <head>
                <title>Delete User Id</title>
            </head>
            <body>
                <p></p>
            </body>
            </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.send(message);
    });

});

const server = app.listen(3000);