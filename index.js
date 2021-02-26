// dependencies
const Joi = require("joi");
const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.json());

// Server: listening on a given port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
// index page
app.get("/", (req, res) => {
  res.send("Hello !!!");
});
//getting all courses
app.get("/api/courses", (req, res) => {
  fs.readFile("db.json", (err, data) => {
    if (err) {
      console.log(err);
    }
    const courses = JSON.parse(data);

    res.send(courses);
  });
});

// Getting a single id
app.get("/api/courses/:id", (req, res) => {
    //reading from the db.json file
  fs.readFile("db.json", (err, data) => {
    if (err) {
      return console.error(err);
    }
    const courses = JSON.parse(data);
    //finding the course with required id
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    // If course doesn't exist return 404: Not Found
    if (!course) return res.status(404).send("The course was not found");

    res.send(course);
  });
});

app.delete("/api/courses/:id", (req, res) => {
  const courses = dB.find((c) => c.id === parseInt(req.params.id));
  // If course doesn't exist return 404: Not Found
  if (!courses) return res.status(404).send("The course was not found");
  // delete course
  const index = dB.indexOf(courses);
  dB.splice(index, 1);
  //response to clint
  res.send(courses);
});

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  fs.readFile("db.json", (err, data) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    const dataFromJson = JSON.parse(data);
    
    const course = {
      id: Date.now(),
      name: req.body.name,
    };

    dataFromJson.push(course);
    
    const jsonData = JSON.stringify(dataFromJson, null, 4);

    fs.writeFile("db.json", jsonData, (err) => {
      if (err) return res.status(500).send(err.message);

      res.status(201).send(course);
    });
  });
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(course);
}