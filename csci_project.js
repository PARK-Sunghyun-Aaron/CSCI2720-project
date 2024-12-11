const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

// match it with the central database
// MongoDB connection
mongoose.connect('mongodb://localhost:27017/myDatabase', {  //Choose your own Database
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

const User = mongoose.model('User', userSchema);

// Security Features (copy all)
// Input sanitization function
function sanitizeInput(input) {
    return input.replace(/[<>]/g, ''); // Remove angle brackets to prevent XSS
}

// Username and password validation
function isValidUsername(username) {
    const usernamePattern = /^[a-zA-Z0-9_]+$/; // Only allow letters, numbers, and underscores, other symbols are not allowed here
    return usernamePattern.test(username) && username.length <= 20;
}

function isValidPassword(password) {
    const passwordPattern = /^[a-zA-Z0-9_]+$/; // Only allow letters, numbers, and underscores
    return passwordPattern.test(password) && password.length <= 20;
}

// Feature to create default users 
// Create default users with hashed passwords
async function createDefaultUsers() {
    await User.deleteMany({}); // Clear existing users

    const adminPassword = await bcrypt.hash('admin123', 10); // Hash the admin password
    const userPassword = await bcrypt.hash('user123', 10);   // Hash the user password

    await User.create([
        { username: 'admin', password: adminPassword, role: 'admin' },
        { username: 'user', password: userPassword, role: 'user' }
    ]);
}


// Feature to create default users 
// Call the function to create default users
createDefaultUsers().then(() => {
    console.log('Default users created.');
}).catch(err => {
    console.error('Error creating default users:', err);
});

// HTML Design (needs to be replaced with the template)
// Serve the login page
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Page</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            .container {
                background-color: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h2 {
                margin-bottom: 20px;
            }
            input, select {
                width: 100%;
                padding: 10px;
                margin: 10px 0;
                border: 1px solid #ccc;
                border-radius: 5px;
            }
            button {
                width: 100%;
                padding: 10px;
                background-color: #5cb85c;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            button:hover {
                background-color: red;
            }
            .theme-switch {
                margin-bottom: 20px;
                cursor: pointer;
                text-align: center;
                padding: 10px;
                background-color: #007bff;
                color: white;
                border-radius: 5px;
            }
            body.dark {
                background-color: #333;
                color: white;
            }
            .container.dark {
                background-color: #444;
                color: white;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Login</h2>
            <div class="theme-switch" onclick="toggleTheme()">Switch Theme</div>
            <form action="/login" method="POST">
                <input type="text" name="username" placeholder="Username" required>
                <input type="password" name="password" placeholder="Password" required>
                <select name="role">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit">Login</button>
            </form>
        </div>
        <script>
            function toggleTheme() {
                document.body.classList.toggle('dark');
                document.querySelector('.container').classList.toggle('dark');
            }
        </script>
    </body>
    </html>
    `);
});

// Login route
// hashing and matching algorithm
app.post('/login', async (req, res) => {
    let { username, password, role } = req.body;

    // Sanitize and validate input
    username = sanitizeInput(username);
    if (!isValidUsername(username) || !isValidPassword(password)) {
        return res.status(400).send('Invalid username or password format');
    }

    try {
        const user = await User.findOne({ username, role });

        // Check if user exists and password matches
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user; // Store user info in session
            // Redirect based on user role
            if (role === 'user') {
                res.redirect('/user-dashboard');
            } else {
                res.redirect('/admin-dashboard');
            }
        } else {
            res.status(401).send('Incorrect username or password');
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Internal server error');
    }
});

// Theme toggle - extra feature
// User dashboard route
app.get('/user-dashboard', (req, res) => {
    if (req.session.user && req.session.user.role === 'user') {
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>User Dashboard</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    transition: background-color 0.3s;
                }
                .container {
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    transition: background-color 0.3s, color 0.3s;
                }
                body.dark {
                    background-color: #333;
                    color: white;
                }
                .container.dark {
                    background-color: #444;
                    color: white;
                }
                .theme-switch {
                    margin-bottom: 20px;
                    cursor: pointer;
                    text-align: center;
                    padding: 10px;
                    background-color: #007bff;
                    color: white;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Welcome to User Dashboard!</h1>
                <div class="theme-switch" onclick="toggleTheme()">Switch Theme</div>
            </div>
            <script>
                function toggleTheme() {
                    document.body.classList.toggle('dark');
                    document.querySelector('.container').classList.toggle('dark');
                }
            </script>
        </body>
        </html>
        `);
    } else {
        res.redirect('/'); // Redirect to login if not authorized
    }
});// Put User action here

// Admin dashboard route
app.get('/admin-dashboard', (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admin Dashboard</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    transition: background-color 0.3s;
                }
                .container {
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    transition: background-color 0.3s, color 0.3s;
                }
                body.dark {
                    background-color: #333;
                    color: white;
                }
                .container.dark {
                    background-color: #444;
                    color: white;
                }
                .theme-switch {
                    margin-bottom: 20px;
                    cursor: pointer;
                    text-align: center;
                    padding: 10px;
                    background-color: #007bff;
                    color: white;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Welcome to Admin Dashboard!</h1>
                <div class="theme-switch" onclick="toggleTheme()">Switch Theme</div>
            </div>
            <script>
                function toggleTheme() {
                    document.body.classList.toggle('dark');
                    document.querySelector('.container').classList.toggle('dark');
                }
            </script>
        </body>
        </html>
        `);
    } else {
        res.redirect('/'); // Redirect to login if not authorized
    }
});// Put Admin action here

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
