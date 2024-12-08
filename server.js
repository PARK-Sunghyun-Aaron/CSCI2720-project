const express = require('express');
const app = express();
const xml2js = require('xml2js');
const axios = require('axios');

const cors = require('cors');
app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase'); // put your own database link here


const db = mongoose.connection;
// Upon connection failure
db.on('error', console.error.bind(console, 'Connection error:'));

//For storing event
let eventsArray = [];
//For storing all venues
let venuesArray = [];
//For storing venues with latitude and longitude
let newvenueArray =[];
//For storing 10 venues with events >=3
let venueShown = [];

//Create a location Schema
const locationSchema = mongoose.Schema({
  venueid: {
    type:String,
    required: true
  },
  location: {
    type:String,
    required: true
  },
  latitude: {
    type:String,
    required: true
  },
  longitude: {
    type:String,
    required: true
  },
  count: {
    type:Number,
    required: true
  }
});



const eventSchema = mongoose.Schema({
  eventid: {
    type:String,
    required: true
  },
  title: {
    type:String,
    required: true
  },
  venue: {
    type:String,
    required: true
  },
  date: {
    type:String,
    required: true
  },
  duration: {
    type:String,
    required: true
  },
  descre: {
    type:String,
    required: true
  },
  pre: {
    type:String,
    required: true
  }
 
})

const Venue = mongoose.model("Venue", locationSchema);

const Event = mongoose.model("Event", eventSchema);


async function fetchEvent() {
  try {
    await Event.deleteMany()
    .then((result) => {
        console.log(`Deleted ${result.deletedCount} documents`);
    })}
    catch(err) {
        console.error(err);
    }
  try {
    const response = await axios.get('https://api.data.gov.hk/v1/historical-archive/get-file?url=https%3A%2F%2Fwww.lcsd.gov.hk%2Fdatagovhk%2Fevent%2Fevents.xml&time=20241204-1322');
    const xmlText = response.data;

    // Parse the XML using xml2js
    xml2js.parseString(xmlText, { explicitArray: false }, async (err, result) => {
        if (err) {
            throw new Error('Error parsing XML: ' + err.message);
        }

        // Assuming the structure is something like <items><item><name>...</name><value>...</value></item></items>
        const items = result.events.event;

        // Convert items to an array
        eventsArray = Array.from(items).map(item => ({
          eventid: item.$.id,
          title: item.titlee,
          date: item.predateE,
          duration: item.progtimee,
          venue: item.venueid,
          descre: item.desce!=""?item.desce:'Not Applicable',
          pre: item.presenterorge
        }));
        
        for(let i=0;i<50;i++){
          let newEvent = new Event({
            eventid: eventsArray[i].eventid,
            title: eventsArray[i].title,
            venue: eventsArray[i].date,
            date: eventsArray[i].duration,
            duration: eventsArray[i].venue,
            descre: eventsArray[i].descre,
            pre: eventsArray[i].pre
          });

          newEvent
          .save()
          .then(() => {
            console.log("a new event created successfully");
          })
          .catch((error) => {
            console.log("failed to save new event", error);
          });
        
    }
        //console.log('Data saved successfully:', eventsArray);
    });
} catch (error) {
    console.error('Error fetching or parsing XML data:', error.message);
} 
//onsole.log(eventsArray.length)
}



async function fetchLocation() {
  
  try {
    await Venue.deleteMany()
    .then((result) => {
        console.log(`Deleted ${result.deletedCount} documents`);
    })}
    catch(err) {
        console.error(err);
    }

  try {
    const response = await axios.get('https://api.data.gov.hk/v1/historical-archive/get-file?url=https%3A%2F%2Fwww.lcsd.gov.hk%2Fdatagovhk%2Fevent%2Fvenues.xml&time=20241204-1325');
    const xmlText = response.data;

    // Parse the XML using xml2js
    xml2js.parseString(xmlText, { explicitArray: false }, async (err, result) => {
        if (err) {
            throw new Error('Error parsing XML: ' + err.message);
        }

        // Assuming the structure is something like <items><item><name>...</name><value>...</value></item></items>
        const items = result.venues.venue;

        // Convert items to an array
        venuesArray = Array.from(items).map(item => ({
          venueid: item.$.id,
          location: item.venuee,
          latitude: item.latitude!=""?item.latitude:'Not Applicable',
          longitude: item.longitude!=""?item.longitude:'Not Applicable',
          count: 0
        }));


        //console.log('Data saved successfully:', venuesArray);
    });
} catch (error) {
    console.error('Error fetching or parsing XML data:', error.message);
} 
for (let i=0;i<venuesArray.length;i++){
  if(venuesArray[i].latitude!="Not Applicable"){
    newvenueArray.push(venuesArray[i]);

  }
}
for (let i =0; i<newvenueArray.length;i++){
  for(let j =0; j<eventsArray.length;j++){
    if(newvenueArray[i].venueid == eventsArray[j].venue){
      newvenueArray[i].count++;
      //console.log(newvenueArray[i].count);
    }
  }
}
for (let i=0;i<newvenueArray.length;i++){
  if(newvenueArray[i].count >= 3){
    venueShown.push(newvenueArray[i]);
  }
  if(venueShown.length==10){
    break;
  }
}
//console.log(newvenueArray.length);
//console.log('Data saved successfully:', venueShown);

for(let i=0;i<venueShown.length;i++){
  let newVenue = new Venue({
    venueid: venueShown[i].venueid,
    location: venueShown[i].location,
    latitude: venueShown[i].latitude,
    longitude: venueShown[i].longitude,
    count: venueShown[i].count
  });

  newVenue
  .save()
  .then(() => {
    console.log("a new event created successfully");
  })
  .catch((error) => {
    console.log("failed to save new event", error);
  });
}


}


const fetchDataInOrder = async () => {
  try {
      await fetchEvent(); // Fetch events first
      await fetchLocation(); // Then fetch locations
      
  } catch (error) {
      console.error('Error during fetching:', error.message);
  } 
};

fetchDataInOrder();

app.get('/location', (req, res)=>{
    Venue.find({})
    .then((data)=>{
        res.json(data);
    })
    })


const server = app.listen(5000);