const express = require("express");
const fs = require("fs");
const uuid = require("uuid");
const app = express();
const PORT = process.env.PORT || 3001;
const db = require("./db/db.json")
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

//joins the /notes route with the notes.html page
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

//gets all notes
app.get("/api/notes", function (req, res) {
  const all = fs.readFileSync(path.join(__dirname, "db/db.json"));
  const notes = JSON.parse(all);
  console.log(all);
  return res.json(notes);
});

//if any other route is accessed, direct client to the index.html page
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

//allows user to create a new note
app.post("/api/notes", function (req, res) {
  const newNote = {
    id: uuid.v4(),
    title: req.body.title,
    text: req.body.text
  }
  console.log(newNote);

  //pushing newNote object containing unique item ID, title and body content to the db.json file
  db.push(newNote);

  fs.writeFile("db/db.json", JSON.stringify(db), function (err) {
    err ? console.log(err) : console.log('Success!')
    res.json(newNote);
  });
});

//deletes a note
app.delete("/api/notes/:id", function (req, res) {
  const found = req.params.id;
  console.log(found);

  var newNote1 = db.filter((note) => note.id != found);
  console.log(newNote1);
  fs.writeFile("db/db.json", JSON.stringify(newNote1), function (err) {
    err ? console.log(err) : console.log('Success!')
    //displaying on the screen as JSON with all notes except the one deleted through req.params.id
    res.json(newNote1);
  });
});

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
