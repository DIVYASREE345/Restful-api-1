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

// Update / Edit Course
app.put('/api/courses/:id', (req, res) => {
    fs.readFile('db.json', (err,data) => {
      if (err) {
      console.error(err);
      }
  const courses = JSON.parse(data);
    const updateCourse = courses.find((c) => c.id === parseInt(req.params.id));
    if (!updateCourse) return res.status(404).send('The course with the given ID was not found');//404 (object not found)
    //validate
    //If invalid, return 400 - Bad request
    const { error } = validateCourse(req.body); // result.error
    if (error) return res.status(400).send(error.details[0].message);
    //Update course
    updateCourse.course = req.body.course;
    res.send(updateCourse); //Return the update course
    const updatedCourses = JSON.stringify(courses, null, 2);
   fs.writeFile('db.json',updatedCourses, (err)=>{
       if(err){
           res.status(500).send(err);
           return;
       }
   })
    });
  });