const express = require('express');
const app = express();
// database connection
const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://keirychas:Keivanessa05@cluster0.2g9bo.mongodb.net/teachers?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Conectado a MongoDB Atlas');
})
.catch(err => {
  console.log('Error de conexión a MongoDB:', err);
});

// parser for the request body (required for the POST and PUT methods)
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// check for cors
const cors = require("cors");
app.use(cors({
  domains: '*',
  methods: "*"
}));

// Auth basic http
app.use(function (req, res, next) {
  if (req.headers["authorization"]) {
    const authBase64 = req.headers['authorization'].split(' ');
    const userPass   = atob(authBase64[1]);
    const user       = userPass.split(':')[0];
    const password   = userPass.split(':')[1];

    if (user === 'admin' && password == '1234') {
      return next(); 
    }
  }
  res.status(401);
  res.send({
    error: "Unauthorized"
  });
});


const { teacherGet, teacherGetAll, teacherPost, teacherPut, teacherDelete } = require('./controllers/teacherController');

const { coursePost, courseGet, coursePut, courseDelete } = require('./controllers/courseController');

app.post("/api/teachers", teacherPost);
app.get("/api/teachers/", teacherGetAll);
app.delete("/api/teachers/:id", teacherDelete);
app.put("/api/teachers/:id", teacherPut);
app.get("/api/teachers/:id", teacherGet);

app.post("/api/courses", coursePost);
app.get("/api/courses/",courseGet);
app.put("/api/courses/:id", coursePut);
app.delete("/api/courses/:id", courseDelete);



app.listen(3001, () => console.log(`Example app listening on port 3001!`))
