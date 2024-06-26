const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // To generate unique user IDs
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = 3000;

// User "database" in memory
const users = [];
const findUserByUsername = (username) => users.find(user => user.username === username);
const findUserById = (id) => users.find(user => user.id === id);

// Passport configuration
passport.use(new LocalStrategy(
    (username, password, done) => {
        const user = users.find(u => u.username === username && u.password === password);
        if (!user) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
        return done(null, user);
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    if (!user) {
        done(new Error('User not found.'));
    } else {
        done(null, user);
    }
});

// Alternatively, you can configure CORS with specific options
app.use(cors({
    // origin: 'http://localhost:8080',
    origin: (origin, callback) => {
        // Allow all origins
        callback(null, origin);
    },
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'], // Allowable methods
    credentials: true, // Enable credentials like cookies, authorization headers, etc.
}));

// Middleware
// Built-in middleware for parsing JSON
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    console.log(`registering ${username}`)
    if (users.find(u => u.username === username)) {
        res.status(409).send('Username already taken');
    } else {
        const user = { id: uuidv4(), username, password, balance: 1000 }; // Initial balance set to 1000
        users.push(user);
        res.status(201).send('User created');
    }
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.status(401).json({ message: 'Authentication failed' }); }
        
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            // Send the user data back as a response
            return res.status(200).json({ message: 'Login successful', user: req.user });
        });
    })(req, res, next);
});


app.get('/user', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send('You are not authenticated');
    }
    res.status(200).json(req.user);
});

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.send('Logged out');
    });
});

app.post('/transfer', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send('You are not authenticated');
    }

    const { recipientUsername, amount } = req.body;
    const sender = req.user;
    const recipient = findUserByUsername(recipientUsername);

    if (!recipient) {
        return res.status(404).send('Recipient user not found');
    }

    if (sender.balance < amount) {
        return res.status(400).send('Insufficient funds');
    }

    console.log(`transfering ${amount} to ${recipientUsername}`)

    sender.balance -= amount;
    recipient.balance += amount;

    return res.status(200).json({ message: 'Transfer successful', senderBalance: sender.balance });
});

const options = {
    key: fs.readFileSync('../server.key'),
    cert: fs.readFileSync('../server.crt')
};

// Start server
https.createServer(options, app).listen(PORT, () => {
// app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});