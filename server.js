const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));

const { notes } = require('./data/notes')

const PORT = process.env.PORT || 3001;

function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
};
function createNewNote(body, notesArray) {
    console.log(body);
    // our function's main code will go here!
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './data/notes.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    )
    // return finished code to post route for response
    return note;
};

function validateNote(note) {
    if (!note.title || typeof note.title !== 'string') {
        return false;
    }
    if (!note.text || typeof note.text !== 'string') {
        return false;
    }
    return true;
}

app.get('/api/notes', (req, res) => {
    let results = notes;
    console.log(req.query)
    console.log(req.params)
    res.json(results);
}
);

app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

app.post('/api/notes', (req, res) => {
    // req.body is where our incoming content will be
    console.log(req.body);

    // set id based on what the next index of the array will be
    req.body.id = notes.length.toString();

    //add note to json file and notes array in this function

    // if any data in req.body is incorrect, send 400 error back
    if (!validateNote(req.body)) {
        res.status(400).send('The note is not properly formatted.');
    } else {
        const note = createNewNote(req.body, notes);
        res.json(note);
    }
});
//HTMLRoutes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});
app.get('/api/notes', (req, res) => {
    res.json(notes);
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});