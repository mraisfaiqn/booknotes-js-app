import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

const API_URL = "https://covers.openlibrary.org/b/isbn/"

let notesArray = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {    
  res.render("index.ejs", {bookNotes: notesArray});
});

app.get("/notes", (req, res) => {
  res.render("notes.ejs");
});

app.post("/search-book", async (req, res) => {
  const searchISBN = req.body.isbn;
  try {
    const result = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${searchISBN}&format=json&jscmd=data`);
    const apiData = result.data[`ISBN:${searchISBN}`];
    if (apiData) {
      // Re-render the page with the found data
      res.render("notes.ejs", { bookData: { isbn: searchISBN, cover: apiData.cover["medium"], title: apiData.title } });
      // Handle if there is book data but no book cover image (TBC)
    } else {
      res.render("notes.ejs", { bookData: { isbn: searchISBN, title: "Book not found" } });
    }
  } catch (error) {
    console.log(error);
    res.render("notes.ejs", { bookData: { isbn: searchISBN, title: "URL search failed" } });
  }
});

app.post("/publish-note", async (req, res) => {
  const currentDate = new Date();
  const formatDate = new Intl.DateTimeFormat('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}).format(currentDate);
  const publishDate = formatDate.toUpperCase();
  const publishRemark = `ISBN: ${req.body.isbn} | Recommendations: ${req.body.rating}/10`;
  const publishNote = {postDate: publishDate, postISBN: req.body.isbn, postTitle: req.body.title, postSnippet: req.body.summary, postRemark: publishRemark, postID: currentDate.getTime()};
  notesArray.unshift(publishNote);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Port: ${port}`);
});