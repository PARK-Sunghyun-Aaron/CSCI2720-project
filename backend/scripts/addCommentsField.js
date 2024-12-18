const mongoose = require('mongoose');
const Location = require('../models/Location');

async function updateLocations() {
    try {
        await mongoose.connect('your_mongodb_connection_string');
        
        // Add empty comments array to all locations that don't have it
        const result = await Location.updateMany(
            { comments: { $exists: false } },
            { $set: { comments: [] } }
        );

        console.log(`Updated ${result.modifiedCount} locations`);
    } catch (error) {
        console.error('Error updating locations:', error);
    } finally {
        await mongoose.connection.close();
    }
}

updateLocations(); 