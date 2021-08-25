const path = require('path');
const express = require('express');
const [notes] = require('../db/db.json');

const app = express();
const PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/notes.html'));
});
app.get('/api/notes', (req, res) => {
    res.json(notes);
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    console.log(newNote);
    notes.push(newNote);
    res.json(newNote);
  });

// Listener
app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
  });
  