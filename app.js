/******************************************************************************
*** 
* ITE5315 – Assignment 2 
* I declare that this assignment is my own work in accordance with Humber Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source 
* (including web sites) or distributed to other students. 
* 
* Name: Nana Sackey 	Student ID: N01700360 	Date: 2025-10-28 
* 
* 
******************************************************************************
**/

// Import required modules
var express = require('express');
var path = require('path');
const fs = require("fs");
const zlib = require("zlib");
const { body, validationResult } = require('express-validator');

// Create express app
var app = express();

// Import express-handlebars
const exphbs = require('express-handlebars');

// Create a variable to hold the port number
const port = process.env.port || 3000;

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse form data
app.use(express.urlencoded({extended: true}));

// Create and configure handlebars template engine
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    helpers: {
        getValue: function(obj, key) {
            return obj[key]
        }
    },
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials')
}));

// Set engine type
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Setting the "views" Application Setting
app.set('views', __dirname+ '/views');


// /root route
app.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

// /users route
app.get('/users', function (req, res) {
    res.send('respond with a resource');
});

// /about route
app.get('/about', (req, res) => {
    res.render('about', { title: 'About Me' });
});

// /data route
app.get('/data', (req, res) => {
    fs.readFile('airbnb_with_photos.json.gz', (err, content) => {
        if (err) {
            return res.render('data', { title: 'Error', message: `Error: ${err.code}` });
        }
        zlib.gunzip(content, (err, buffer) => {
            if (err) {
                return res.render('data', { title: 'Error', message: `Error: ${err.code}` });
            }
            res.render('data', { title: 'Data', message: 'JSON data is loaded and ready!' });
            const data = JSON.parse(buffer.toString());
            console.log(data);
        });
    });
});

// /data/{index} route
app.get('/data/:index', (req, res) => {
    const index = req.params.index;
    
    fs.readFile('airbnb_with_photos.json.gz', (err, content) => {
        if (err) {
            return res.render('data', { title: 'Error', message: `Error: ${err.code}` });
        }
        zlib.gunzip(content, (err, buffer) => {
            if (err) {
                return res.render('data', { title: 'Error', message: `Error: ${err.code}` });
            }
            const data = JSON.parse(buffer.toString());
            const propertyid = data[index].id
            res.render('data', { title: 'Property ID', message: propertyid });
        });
    });
});

// /search/id GET route
app.get('/search/id', (req, res, next) => {
    res.render('searchId', { title: 'Search by ID' });
});

// /search/id POST route - form submission with validation
app.post(
    '/search/id',
    
    body('propid')
        .notEmpty()
        .withMessage('Property ID is required')
        .isNumeric()
        .withMessage("Property ID must be numeric")
        .escape(),
    
    (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const messages = errors.array().map(err => err.msg).join(" and ");
        return res.status(400).render('result', { error: true, title: 'Error', message: messages});
    }

    const propid = req.body.propid;
    
    fs.readFile('airbnb_with_photos.json.gz', (err, content) => {
        if (err) {
            return res.render('data', { title: 'Error', message: `Error: ${err.code}` });
        }
        zlib.gunzip(content, (err, buffer) => {
            if (err) {
                return res.render('data', { title: 'Error', message: `Error: ${err.code}` });
            }
            const data = JSON.parse(buffer.toString());
            
            let found = [];

            data.forEach(function(property) {
                if (propid == property.id) {
                    found.push(property);
                }
            });
            
            if (found.length == 0) {
                res.render('result', { error: true, title: 'Search Results', message: "No Properties Found"});
            } else {
                res.render('result', { error: false, title: 'Search Results', results: found});
            }
        });
    });
})

// /search/name GET route
app.get('/search/name', (req, res, next) => {
    res.render('searchName', { title: 'Search by Name' });
});

// /search/name POST route - form submission with validation
app.post(
    '/search/name',

    body('propname')
        .notEmpty()
        .withMessage("Property Name is required")
        .escape(),
    
    (req, res) => {
        
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const messages = errors.array().map(err => err.msg).join(" and ");
        return res.status(400).render('result', { error: true, title: 'Error', message: messages});
    }

    const propname = req.body.propname;
    
    fs.readFile('airbnb_with_photos.json.gz', (err, content) => {
        if (err) {
            return res.render('data', { title: 'Error', message: `Error: ${err.code}` });
        }
        zlib.gunzip(content, (err, buffer) => {
            if (err) {
                return res.render('data', { title: 'Error', message: `Error: ${err.code}` });
            }
            const data = JSON.parse(buffer.toString());
            
            let found = [];

            data.forEach(function(property) {
                if (property.NAME.includes(propname)) {
                    found.push(property);
                }
            });
            
            if (found.length == 0) {
                res.render('result', { error: true, title: 'Search Results', message: "No Properties Found"});
            } else {
                res.render('result', { error: false, title: 'Search Results', results: found});
            }
        });
    })
})

// viewData route
app.get('/viewData', (req, res) => {
    fs.readFile('airbnb_with_photos.json.gz', (err, content) => {
        if (err) {
            return res.render('data', { title: 'Error', message: `Error: ${err.code}` });
        }
        zlib.gunzip(content, (err, buffer) => {
            if (err) {
                return res.render('data', { title: 'Error', message: `Error: ${err.code}` });
            }
            const data = JSON.parse(buffer.toString());
            res.render('viewData', { title: 'Airbnb Listings', records: data});
        });
    });
});

// viewData/price route
app.get('/viewData/price', (req, res) => {
    res.render('price', { title: 'Price' });
});

// Error handler for the wrong route (404)
app.get('/{*splat}', function (req, res) {
    res.render('error', { title: 'Error', message: 'Wrong Route' });
});

// Start the server at the given port
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})