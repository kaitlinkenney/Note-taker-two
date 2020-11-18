const express = require("express");
const fs = require("fs");
const uuid = require("uuid");
// const index = require('/public/assets/js/index.js');
// console.log("anything");
const app = express();
const PORT = process.env.PORT || 3001;

const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const notesList = [];


app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

//gets all notes
app.get("/api/notes", function (req, res) {
  return res.json(notes);
});

app.get("/api/notes/:id", function(req, res){
  const found = notesList.some(note => note.id === parseInt(req.params.id));

  if(found) {
    return res.json(notesList.filter(function (note) {
      note.id === parseInt(req.params.id)
    }));
  } else {
    res.writeHead(500, { "Content-Type": "text/html"});
    res.end("<html><head><title>Oops</title></head><body><h1>Sorry, no note with that id.</h1></html>");
  }
});

app.post("/api/notes", function (req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  const newNote = {
    id: uuid.v4(),
    title: req.body.title,
    text: req.body.text
  }

  console.log(newNote);

  notesList.push(newNote);

  res.json(notesList);
  
});

app.delete("/api/notes/:id", function(req, res){
    const found = notesList.some(note => note.id === parseInt(req.params.id));
  
    if(found) {
      return res.json(notesList.filter(function (note) {
        note.id !== parseInt(req.params.id)
      }));
    } else {
      res.writeHead(500, { "Content-Type": "text/html"});
      res.end("<html><head><title>Oops</title></head><body><h1>Sorry, there was an error</h1></html>");
    }
  });


app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
