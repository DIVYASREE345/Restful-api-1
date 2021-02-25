// dependencies
const Joi = require('joi');
const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());

// reading the database
const dataBase = fs.readFileSync('db.json');
const dB = JSON.parse(dataBase);

// Server: listening on a given port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));


app.get('/', (req, res) => {
    
    res.send('Hello !!!');
});


app.get('/api/courses', (req, res) => {
    res.send(dB); 
}); 

// Getting a single id
app.get('/api/courses/:id', (req, res) => {
    
    const courses = dB.find(c => c.id === parseInt(req.params.id));
    // If course doesn't exist return 404: Not Found
    if (!courses) return res.status(404).send('The course was not found');
    
    res.send(courses);
});