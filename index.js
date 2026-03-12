import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

const API_URL = "https://covers.openlibrary.org/b/isbn/"

let notesArray = [];
let validBook = false;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {    
  const sortType = req.query.sort;
  let sortedNotes = [...notesArray];

  if (sortType === "best") {
    // Descending order: 10 to 1
    sortedNotes.sort((a, b) => b.postRating - a.postRating);
  } 
  else if (sortType === "title") {
    // Ascending order: A to Z
    sortedNotes.sort((a, b) => a.postTitle.localeCompare(b.postTitle));
  } 
  else if (sortType === "newest") {
    // Descending order: Newest ID (timestamp) first
    sortedNotes.sort((a, b) => b.postID - a.postID);
  } else {
    sortedNotes.sort((a, b) => b.postID - a.postID);
  }

  res.render("index.ejs", {bookNotes: sortedNotes});
});

app.get("/notes", (req, res) => {
  validBook = false;
  res.render("notes.ejs");
});

app.post("/search-book", async (req, res) => {
  const searchISBN = req.body.isbn;
  try {
    const result = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${searchISBN}&format=json&jscmd=data`);
    const apiData = result.data[`ISBN:${searchISBN}`];
    if (apiData) {
      validBook = true;
      // Re-render the page with the found data
      res.render("notes.ejs", { bookData: { isbn: searchISBN, cover: apiData.cover["medium"], title: apiData.title } });
      // Handle if there is book data but no book cover image (TBC)
    } else {
      validBook = false;
      res.render("notes.ejs", { bookData: { isbn: searchISBN, title: "Book not found" } });
    }
  } catch (error) {
    console.log(error);
    validBook = false;
    res.render("notes.ejs", { bookData: { isbn: searchISBN, title: "URL search failed" } });
  }
});

app.post("/publish-note", (req, res) => {
  if (req.body.title && validBook) {
    const currentDate = new Date();
    const formatDate = new Intl.DateTimeFormat('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}).format(currentDate);
    const publishDate = formatDate.toUpperCase();
    const publishRemark = `ISBN: ${req.body.isbn} | Recommendations: ${req.body.rating}/10`;
    const publishNote = {postDate: publishDate, postISBN: req.body.isbn, postTitle: req.body.title, postSnippet: req.body.summary, postNotes: req.body.notes, postRating: req.body.rating, postRemark: publishRemark, postID: currentDate.getTime()};
    notesArray.unshift(publishNote);
    res.redirect("/");
  } else {
    res.render("notes.ejs", { bookData: { title: "Enter a valid book before publishing" } });
  }
});

app.get("/edits", (req, res) => {
  const idToFind = parseInt(req.query.postID); // Convert string ID to number
  
  // Find the specific note in your array
  const selectedNote = notesArray.find(note => note.postID === idToFind);
  if (selectedNote) {
    // Pass the found note to edits.ejs
    res.render("edits.ejs", { bookData: selectedNote });
  } else {
    // If not found, go back home
    res.redirect("/");
  }
});

app.post("/save-note", (req, res) => {
  const idToUpdate = parseInt(req.body.postID);

  const updateNote = notesArray.find(note => note.postID === idToUpdate);
  if (updateNote) {
    // Update note and refresh list at home
    const updatedRemark = `ISBN: ${req.body.isbn} | Recommendations: ${req.body.rating}/10`;
    updateNote.postSnippet = req.body.summary;
    updateNote.postNotes = req.body.notes;
    updateNote.postRating = req.body.rating;
    updateNote.postRemark = updatedRemark;
  } else {
    // If not found, do nothing go back home
  }
  res.redirect("/");

});

app.post("/delete-note", (req, res) => {
  const idToDelete = parseInt(req.body.postID);

  const noteIndex = notesArray.findIndex(note => note.postID === idToDelete);
  notesArray.splice(noteIndex, 1);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Port: ${port}`);
});