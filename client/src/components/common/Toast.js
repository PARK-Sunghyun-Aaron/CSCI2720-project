/*
I/We declare that the lab work here submitted is original
except for source material explicitly acknowledged,
and that the same or closely related material has not been
previously submitted for another course.
I/We also acknowledge that I/We am aware of University policy and
regulations on honesty in academic work, and of the disciplinary
guidelines and procedures applicable to breaches of such
policy and regulations, as contained in the website.
University Guideline on Academic Honesty:
https://www.cuhk.edu.hk/policy/academichonesty/
Student Name : LIN Yi
Student ID : 1155232784
Student Name : MANAV Suryansh
Student ID : 1155156662
Student Name : MUI Ka Shun
Student ID : 1155194765
Student Name : PARK Sunghyun
Student ID : 1155167933
Student Name : RAO Penghao
Student ID : 1155191490
Class/Section : CSCI2720
Date : 2024-12-04
*/
import React from 'react';
import './Toast.css';

const Toast = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="toast-container">
            <div className="toast-message">
                <span>{message}</span>
                <button onClick={onClose} className="toast-close">&times;</button>
            </div>
        </div>
    );
};

export default Toast; 
