// dependencies
const Joi = require("joi");
const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.json());
const url = "https://restful-api.herokuapp.com/";
// Server: listening on a given port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));



app.get("/", (req, res) => {
    res.send(`<body style="background: #A5D4A6">
    <div style="text-align:center; margin-top:10%; ">
    <h1 style = "color:red">RESTFUL API </h1>
    <button style ="background: #EA1A65"><a href="${url}api/courses">Access all the courses</a></button>
    <button style ="background : #EA1A65"><a href="${url}api/courses/1" >Access a specific course with id</a></button>
    <button style ="background : #EA1A65"><a href="https://www.postman.com/">Use Postman to access methods</a></button>
  </div></body> `);
  });

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
  fs.readFile("db.json", (err, data) => {
    if (err) {
      return console.error(err);
    }
    const courses = JSON.parse(data);
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    // If course doesn't exist return 404: Not Found
    if (!course) return res.status(404).send("The course was not found");

    res.send(course);
  });
});
function validateCourse(course) {
  const schema = Joi.object({
    course: Joi.string().min(3).required(),
  });
  return schema.validate(course);
}

app.put("/api/courses/:id", (req, res) => {
  fs.readFile("db.json", (err, data) => {
    if (err) {
      console.error(err);
    }
    const courses = JSON.parse(data);
    const updateCourse = courses.find((c) => c.id === parseInt(req.params.id));
    if (!updateCourse)
      return res.status(404).send("The course with the given ID was not found"); //404 (object not found)

    //validate
    //If invalid, return 400 - Bad request
    const { error } = validateCourse(req.body); // result.error
    if (error) return res.status(400).send(error.details[0].message);

    //Update course
    updateCourse.course = req.body.course;
    res.send(updateCourse); //Return the update course
    const updatedCourses = JSON.stringify(courses, null, 2);
    fs.writeFile("db.json", updatedCourses, (err) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
    });
  });
});

app.delete("/api/courses/:id", (req, res) => {
  fs.readFile("db.json", (err, data) => {
    if (err) {
      console.error(err);
    }
    const courses = JSON.parse(data);
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    // If course doesn't exist return 404: Not Found
    if (!course) return res.status(404).send("The course was not found");
    // delete course
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //response to clint
    res.send(course);

    const updatedCourses = JSON.stringify(courses, null, 2);
    fs.writeFile("db.json", updatedCourses, (err) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
    });
  });
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
      course: req.body.course,
    };

    dataFromJson.push(course);

    const jsonData = JSON.stringify(dataFromJson, null, 4);

    fs.writeFile("db.json", jsonData, (err) => {
      if (err) return res.status(500).send(err.message);

      res.status(201).send(course);
    });
  });
});