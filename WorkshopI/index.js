require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const routes = require('./rutas/routes'); 

const app = express();
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

// Middleware para analizar JSON
app.use(express.json());

// Uso de rutas
app.use('/api', routes); // Todas las rutas estarán bajo el prefijo /api

// Configuración del puerto
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en ${PORT}`);
});
