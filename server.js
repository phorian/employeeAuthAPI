const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler= require ('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

//custom middleware logger
app.use(logger);

const whitelist = ['https://www.google.com', 'http://127.0.0.1:5500', 'http://localhost:3500'];
const corsOption = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOption)); //cross origin resource sharing

/* 
Built-in middleware to handle urlencoded data
in other words, form data:
'content-type: application/x-www-form-urlencoded
*/

app.use(express.urlencoded({extended: false})); //builtin middleware for express

app.use(express.json()); //builtin middleware for json

app.use(express.static(path.join(__dirname, '/public'))); //serve static files
app.use('/subdir', express.static(path.join(__dirname, '/public'))); //serve static files

//routes
app.use('/', require('./routes/roots'));
app.use('/subdir', require('./routes/subdir'));
app.use('/employees', require('./routes/api/employees'));

app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if(req.accepts('json')){
        res.json({error: "404 Not Found"});
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);


app.listen(PORT, () => console.log(`server running on port ${PORT}`));