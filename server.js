const express = require("express");
const fs = require("fs");
const uuid = require("uuid");
const app = express();
const PORT = process.env.PORT || 3001;
const db = require("./db/db.json")
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

// const notesList = [];


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

// app.get("/api/notes/:id", function(req, res){
//   const read = fs.readFile(_dirname, "db/db.json");
//   const found = notesList.some(note => note.id === parseInt(req.params.id));

//   if(found) {
//     return res.json(notesList.filter(function (note) {
//       note.id === parseInt(req.params.id)
//     }));
//   } else {
//     res.writeHead(500, { "Content-Type": "text/html"});
//     res.end("<html><head><title>Oops</title></head><body><h1>Sorry, no note with that id.</h1></html>");
//   }

// });
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/api/notes", function (req, res) {
  // const write = fs.writeFile(path.join(__dirname, "db/db.json"));
  const newNote = {
    id: uuid.v4(),
    title: req.body.title,
    text: req.body.text
  }
  console.log("***this is newNote");
  console.log(newNote);

  // const jsonNotesList = `${notesList.title.toLowerCase().split(' ').join('')}.json`;
  db.push(newNote);
  // console.log(notesList)

  fs.writeFile("db/db.json", JSON.stringify(db), function (err) {
    err ? console.log(err) : console.log('Success!')
    res.json(newNote);
  });

  // const jsonParse = JSON.parse(jsonNotesList);
});

app.delete("/api/notes/:id", function(req, res){
  // const remove = fs.readFileSync(path.join(__dirname, "db/db.json"));
    const found = req.params.id;
    console.log("found");

    var newNote1 = db.filter((note)=> note.id != found);
    fs.writeFile(__dirname + "./db/db.json",
    JSON.stringify(newNote1, null, 1),
    (err) =>{

      if (err) throw err; 
      console.log("we did it");
      res.send(newNote1)

    })



    // if(found) {
    //   return res.json(notesList.filter(function (notesList) {
    //     notesList.id !== parseInt(req.params.id)
    //   }));
    // } else {
    //   console.log("not fancy");
    //   res.writeHead(500, { "Content-Type": "text/html"});
    //   res.end("<html><head><title>Oops</title></head><body><h1>Sorry, there was an error</h1></html>");
    // }
  });


app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
