const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap' });
const Database = require('./ContactDB');
const db = new Database();
db.initialize();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.json());

// Gets call on every request, before the routes.
// We can inject dependencies into the req (or res)
// so the routes have access to them.
app.use((req, res, next) => {
    console.log("Adding DB to request");
    req.db = db;
    req.geocoder = geocoder;
    next();
})

app.use(session({
    secret: 'cmps369',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = {
            id: req.session.user.id,
            username: req.session.user.firstname +" " +  req.session.user.lastname
        }
    }
    next()
})

app.set('view engine', 'pug');
app.locals.pretty = true;
app.use('/places', require('./routes/places'));
app.use('/', require('./routes/accounts'));
app.use('/', require('./routes/contacts'));

app.listen(8080, () => {
    console.log('Server is running  on port 8080')
});




