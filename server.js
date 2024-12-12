const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
    console.log("Conenction is open...");

    const userSchema = new mongoose.Schema({
        email: { 
            type: String, 
            required: true, 
            unique: true 
        },
        password: { 
            type: String, 
            required: true 
        },
        firstName: { 
            type: String, 
            required: true 
        },
        lastName: { 
            type: String, 
            required: true 
        },
        role: { 
            type: String, 
            enum: ['user', 'admin'], 
            default: 'user' 
        },
        events: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Event',
            default: [],
        }
    });
    const User = mongoose.model("User", userSchema);

    const LocationSchema = mongoose.Schema({
        locName: {
            type: String,
            required: [true, "locName is required"],
        },
        latitude: {
            type: Number,
            required: [true],
        },
        longitude: {
            type: Number,
            required: [true],
        }
    });
    const Location = mongoose.model('Location', LocationSchema);
    
    const EventSchema = mongoose.Schema({
        eventID: {
            type: Number,
            required: [true, "unique eventID is required"],
            unique: [true],
        },
        name: {
            type: String,
            required: [true, "name is required"],
        },
        loc: {
            type: mongoose.Schema.Types.ObjectId, ref:'Location'
        },
        quota: {
            type: Number,
            validate: {
                validator: function (value) {
                return value > 0;
                },
            message: () => "Please enter a valid quota",
            },
        },
    });
    const Event = mongoose.model('Event', EventSchema);

    // create a new user data
    app.post('/createNewUser', (req, res) => {
        console.log("creating new user data...");
        const newUserEmail = req.body.userEmail;
        const newUserPassword = req.body.userPassword;
        const newUserFirstName = req.body.userFirstName;
        const newUserLastName = req.body.userLastName;
        const newUserRole = req.body.userRole;
        

        let newUser = new User({
            email: newUserEmail,
            password: newUserPassword,
            firstName: newUserFirstName,
            lastName: newUserLastName,
            role: newUserRole,
            events: []
        });
        newUser
            .save()
            .then(()=> {
                console.log("a new user data is created successfully");
            })
            .catch((error)=> {
                console.log(error);
            });
        
        const message = `
        <html>
        <head>
            <title>Created User</title>
        </head>
        <body>
            <p>New user email: ${newUserEmail}</p>
            <p>New user password: ${newUserPassword}</p>
            <p>New user firstName: ${newUserFirstName}</p>
            <p>New user lastName: ${newUserLastName}</p>
            <p>New user role: ${newUserRole}</p>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.send(message);
        
    });

    app.post('/readUser', (req, res) => {
        console.log("reading user data...");

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

    app.get('/loadUser/:userEmail', (req, res) => {
        const userEmail = req.params.userEmail;
        console.log('Fetching user with email:', userEmail);
    
        User.findOne({ email: userEmail })
        .then((user) => {
            if (!user) {
                return res.status(404).send('Event not found.');
            }
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal server error');
        });
    });
    
    app.put('/updateUser/:userEmail', (req, res) => {
        const userEmail = req.params.userEmail;
        console.log('Fetching user with email:', userEmail);
    
        const updatedName = req.body.name;
        const updatedLocationId = req.body.locationId;
        const updatedQuota = req.body.quota;
        
        const filter = {
            email: req.params.userEmail,
        };
        const update = {
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        };
    
        User.findOneAndUpdate(filter,update,
            { new: true }
        )
        .then((updatedUser) => {
            if (!updatedUser) {
                return res.status(404).send('Event not found.');
            }
            res.send('Updated user.');
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal server error');
        });
    });

    app.post('/deleteUser/:deleteUserEmail', (req, res) => {
        console.log("deleting user data...");
        const deleteUserEmail = req.params.deleteUserEmail;

        User.findOneAndDelete(
            {email: deleteUserEmail},
        )
        .then ( (user) => {
            console.log("the deleted user is: ", user);
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


    //location and events
    app.get('/ev/:eventID', (req,res) => {

        Event.findOne({eventID: req.params.eventID})
        .then((data) => {
            if (!data) {
                return res.status(404).send('Event not found.');
            }
  
            return Location.findOne({ _id: data.loc })
            .then((location) => {
                if (!location) {
                    return res.status(404).send('Location not found.');
                }
        
            const message = `
            <html>
            <head>
                <title>Event information</title>
            </head>
            <body>
                <p>{</p>
                <p>"eventId": ${data.eventID},</p>
                <p>"name": "${data.name}",</p>
                <p>"loc":</p>
                <p>{</p>
                <p>"locName": ${location.locName},</p>
                <p>},</p>
                <p>"quota": ${data.quota}</p>
                <p>}</p>
            </body>
            </html>
            `;

            res.setHeader('Content-Type', 'text/plain');
            res.send(message);
            });
        })
        .catch( (err) => {
            console.log(err);
            res.status(500).send('Internal server error');
        });
    });


    app.post('/ev', (req,res) => {
        const newName = req.body.name;
        const newQuota = req.body.quota;
        const newLocationName = req.body.locationName;

        let message = newName+newQuota+newLocationName;

        var maxEventId = 100;

        Event.find({})
        .sort( {eventID: -1 })
        .limit(1)
        .then( (data) => {
            if (data.length > 0) {
                maxEventId = data[0].eventID + 1;
            }
            return Location.findOne({ locName: newLocationName });
        })
        .then((location) => {
            if (!location) {
                return res.status(404).send('Location not found.');
            }
            console.log('maxEvenId: ', maxEventId);

            let newEvent = new Event({
                eventID: maxEventId,
                name: newName,
                quota: newQuota,
                loc: location._id,
            });

            return newEvent.save();
        })
        .then(()=> {
            console.log("a new event created successfully.");
            return res.status(201).send('New event created successfully.');
        })
        .catch((error) => {
        });
    });

    app.delete('/ev/:eventID', (req,res) => {

        Event.findOneAndDelete({eventID: req.params.eventID})
        .then((data) => {
            if (!data){
                return res.status(404).send('Event not found.');
            }
            return res.status(204).send();
        })
        .catch((error) => {
            console.error(error);
        });
        res.setHeader('Content-Type', 'text/plain');
    });

  
    app.get('/ev', (req,res) => {

        const queryNumber = req.query.q;
        Event.find({}) // Retrieve all events or add a filter if needed
        .then((events) => {
            if (events.length === 0) {
            return res.status(404).send('No events found.');
            }
        
            const eventMessages = events.map(event => {
            return Location.findOne({ _id: event.loc })
            .then((location) => {
                if (!location) {
                return `<p>Location not found for event with ID ${event.eventID}.</p>`;
                }
                return `
                <div>
                    <p>{</p>
                    <p>"eventId": ${event.eventID},</p>
                    <p>"name": "${event.name}",</p>
                    <p>"loc":</p>
                    <p>{</p>
                    <p>"locName": "${location.locName}",</p>
                    <p>},</p>
                    <p>"quota": ${event.quota}</p>
                    <p>}</p>
                </div>
                `;
            });
            });

            Promise.all(eventMessages)
            .then((messages) => {
        
            const fullMessage = `
                <html>
                <head>
                <title>Events information</title>
                </head>
                <body>
                <p>[</p>
                ${messages.join(',')}
                <p>]</p>
                </body>
                </html>
            `;
            
            res.setHeader('Content-Type', 'text/html');
            res.send(fullMessage);
            });
        })
        .catch((err) => {
            console.log(err);
        }); 
    });
  

  app.get('/lo/:locationName', (req,res) => {

    Location.findOne({locName: req.params.locationName})
    .then((location) => {
      if (!location) {
        return res.status(404).send('Location not found.');
      } 
      const message = `
        <html>
        <head>
          <title>Event information</title>
        </head>
        <body>
          <p>{</p>
          <p>"locName": ${location.locName},</p>
          <p>"latitude": "${location.latitude}",</p>
          <p>"longitude": ${location.longitude}</p>
          <p>}</p>
        </body>
        </html>
      `;
      res.setHeader('Content-Type', 'text/plain');
      res.send(message);
    })
    .catch( (err) => {
      console.log(err);
      res.status(500).send('Internal server error');
    });
  });

  app.get('/lo', (req,res) => {

    Location.find({}) // Retrieve all events or add a filter if needed
    .then((locations) => {
      if (locations.length === 0) {
        return res.status(404).send('No location found.');
      }
    
      const locationMessages = locations.map(location => {
        return `
          <div>
            <p>{</p>
            <p>"locName": ${location.locName},</p>
            <p>"latitude": "${location.latitude}",</p>
            <p>"longitude": ${location.longitude}</p>
            <p>}</p>
          </div>
        `;
      });
    
      Promise.all(locationMessages)
      .then((messages) => {
  
        const fullMessage = `
          <html>
          <head>
            <title>Locations information</title>
          </head>
          <body>
            <p>[</p>
            ${messages.join(',')}
            <p>]</p>
          </body>
          </html>
        `;
          
        res.setHeader('Content-Type', 'text/html');
        res.send(fullMessage);
      })
    .catch((err) => {
      console.log(err);
    });
  });
  
  app.get('/loadEvent/:eventId', (req, res) => {
    
    const eventId = parseInt(req.params.eventId, 10);
    console.log('Fetching event with ID:', eventId);

    Event.findOne({ eventID: eventId })
        .then((event) => {
            if (!event) {
                return res.status(404).send('Event not found.');
            }
            res.json(event);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal server error');
        });
  });

  app.put('/ev/:eventId', (req, res) => {
    const eventId = parseInt(req.params.eventId, 10);
    console.log('Fetching event with ID:', eventId);

    const updatedName = req.body.name;
    const updatedLocationName = req.body.locationName;
    const updatedQuota = req.body.quota;
    

    const filter = {
      eventID: eventId,
    };
    const update = {
      name: updatedName,
      loc: updatedLocationName,
      quota: updatedQuota,
    };

    Event.findOneAndUpdate(filter,update,
        { new: true }
    )
    .then((updatedEvent) => {
      if (!updatedEvent) {
        return res.status(404).send('Event not found.');
      }
      res.send('Updated event.');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Internal server error');
    });
  });
    
});

const server = app.listen(3000);

});