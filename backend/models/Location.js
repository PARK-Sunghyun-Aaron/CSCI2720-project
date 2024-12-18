/*I/We declare that the lab work here submitted is original except for source material explicitly acknowledged,
and that the same or closely related material has not been previously submitted for another course. 
I/We also acknowledge that I/We am aware of University policy and regulations on honesty in academic work, 
and of the disciplinary guidelines and procedures applicable to breaches of such policy and regulations, 
as contained in the website. University Guideline on Academic Honesty: https://www.cuhk.edu.hk/policy/academichonesty/ 
Student Name : LIN Yi Student ID : 1155232784 Student Name : MANAV Suryansh Student ID : 1155156662 
Student Name : MUI Ka Shun Student ID : 1155194765 Student Name : PARK Sunghyun Student ID : 1155167933 
Student Name : RAO Penghao Student ID : 1155191490 Class/Section : CSCI2720 Date : 2024-12-04
*/

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const locationSchema = new mongoose.Schema({
    venueid: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    comments: [commentSchema]
});

module.exports = mongoose.model('Location', locationSchema);
