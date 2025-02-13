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

const { teacherGet, teacherPost, teacherPut, teacherDelete } = require('./controllers/teacherController');


app.post("/api/teachers", teacherPost);
app.get("/api/teachers/",teacherGet);
app.delete("/api/teachers/:id", teacherDelete);
app.put("/api/teachers/:id", teacherPut);


app.listen(3001, () => console.log(`Example app listening on port 3001!`))
