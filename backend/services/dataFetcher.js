const axios = require('axios');
const xml2js = require('xml2js');
const Event = require('../models/Event');
const Location = require('../models/Location');

let eventsArray = [];
let venuesArray = [];
let newvenueArray = [];
let venueShown = [];

async function fetchEvent() {
    try {
        await Event.deleteMany();
        const response = await axios.get('https://api.data.gov.hk/v1/historical-archive/get-file?url=https%3A%2F%2Fwww.lcsd.gov.hk%2Fdatagovhk%2Fevent%2Fevents.xml&time=20241204-1322');
        const xmlText = response.data;

        await new Promise((resolve, reject) => {
            xml2js.parseString(xmlText, { explicitArray: false }, (err, result) => {
                if (err) {
                    reject(new Error('Error parsing XML: ' + err.message));
                }

                const items = result.events.event;
                eventsArray = Array.from(items).map(item => ({
                    eventid: item.$.id,
                    title: item.titlee,
                    date: item.predateE,
                    duration: item.progtimee || 'Not Applicable',
                    venue: item.venueid,
                    descre: item.desce || 'Not Applicable',
                    pre: item.presenterorge || 'Not Applicable',
                    eventID: item.$.id + '_'
                }))
                resolve();
            });
        });

        await Event.insertMany(eventsArray);
    } catch (error) {
        console.error('Error fetching or parsing XML data:', error.message);
        throw error;
    }
}

async function fetchLocation() {
    try {
        await Location.deleteMany();
        const response = await axios.get('https://api.data.gov.hk/v1/historical-archive/get-file?url=https%3A%2F%2Fwww.lcsd.gov.hk%2Fdatagovhk%2Fevent%2Fvenues.xml&time=20241204-1325');
        const xmlText = response.data;

        await new Promise((resolve, reject) => {
            xml2js.parseString(xmlText, { explicitArray: false }, (err, result) => {
                if (err) {
                    reject(new Error('Error parsing XML: ' + err.message));
                }

                const items = result.venues.venue;
                venuesArray = Array.from(items).map(item => ({
                    venueid: item.$.id,
                    location: item.venuee,
                    latitude: item.latitude || 'Not Applicable',
                    longitude: item.longitude || 'Not Applicable',
                    count: 0
                }));
                resolve();
            });
        });

        // Process venues and events
        newvenueArray = venuesArray.filter(venue => venue.latitude !== 'Not Applicable');
        
        // Count events per venue
        newvenueArray.forEach(venue => {
            venue.count = eventsArray.filter(event => event.venue === venue.venueid).length;
        });

        // Filter venues with 3 or more events
        venueShown = newvenueArray.filter(venue => venue.count >= 3)
            .sort(() => 0.5 - Math.random())
            .slice(0, 10);

        // Save venues
        await Location.insertMany(venueShown);

        // Drop events with venue IDs not in the saved locations
        const venueIds = venueShown.map(venue => venue.venueid);
        await Event.deleteMany({ venue: { $nin: venueIds } });
        

    } catch (error) {
        console.error('Error in fetchLocation:', error);
        throw error;
    }
}

async function fetchDataInOrder() {
    try {
        await fetchEvent();
        await fetchLocation();
        console.log('Data fetching and saving completed successfully');
    } catch (error) {
        console.error('Error during data fetching:', error);
    }
}

module.exports = { fetchDataInOrder }; 