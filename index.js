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

app.delete('/api/courses/:id', (req, res)=>{
    //read file from db.json
    fs.readFile("db.json", (err, data)=> {
        if (err){
            return console.error(err);
        }
    const courses = JSON.parse(data);
    //finding the course with required ID
    const course = courses.find(c => c.id === parseInt(req.params.id));
    // If course doesn't exist return 404: Not Found
    if (!course) return res.status(404).send('The course was not found');
    // delete course
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    //response to clint
    res.send(course);
    // update JSON
    const updatedCourses = JSON.stringify(courses, null, 2);
   fs.writeFile('db.json',updatedCourses, (err)=>{
       if(err){
           res.status(500).send(err);
           return;
       }
   })
});
});