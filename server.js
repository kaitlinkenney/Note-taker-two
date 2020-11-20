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

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

//gets all notes
app.get("/api/notes", function (req, res) {
  console.log("Here?");
  const all = fs.readFileSync(path.join(__dirname, "db/db.json"));
  const notes = JSON.parse(all);
  console.log(all);
  console.log("notes going");
  return res.json(notes);
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/api/notes", function (req, res) {
  const newNote = {
    id: uuid.v4(),
    title: req.body.title,
    text: req.body.text
  }
  console.log("***this is newNote");
  console.log(newNote);

  db.push(newNote);

  fs.writeFile("db/db.json", JSON.stringify(db), function (err) {
    err ? console.log(err) : console.log('Success!')
    res.json(newNote);
  });
});

app.delete("/api/notes/:id", function (req, res) {
  const found = req.params.id;
  console.log("found");

  var newNote1 = db.filter((note) => note.id != found);
  writeFileAsync(__dirname + "db/db.json",
    JSON.stringify(newNote1, null, 2),
    (err) => {

      if (err) throw err;
      console.log("we did it");
      res.send(newNote1)

    })
});

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
