# BookNotes: Personal Library & Review Manager

A full-stack web application designed to help readers persist, organize, and review the most salient points from their favorite books. Inspired by [Derek Sivers' book notes](https://sive.rs/book), this project serves as a centralized hub for digital insights.

---

## Overview
We read to learn, but we often forget the details. **BookNotes** allows users to log books they've read, fetch high-quality cover art via the **Open Library API**, and manage their personal reviews and ratings using a persistent PostgreSQL database.

### Objectives
* **API Integration:** Use Axios to fetch book covers based on ISBN/ID.
* **Server-Side Logic:** Build a robust backend using **Node.js** and **Express.js**.
* **Database Persistence:** Implement full **CRUD** (Create, Read, Update, Delete) using **PostgreSQL**.
* **Data Presentation:** Create a user-friendly interface with **EJS** and **CSS**.

---

## Tech Stack
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (via `pg` library)
* **Frontend:** EJS (Embedded JavaScript), CSS, Vanilla JS
* **API:** [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers)
* **HTTP Client:** Axios

---

## Key Features
* **Dynamic Library:** Display book covers and notes in a clean, sortable grid.
* **Custom Sorting:** Organize your reads by **Recency** (latest) or **Rating** (highest impact).
* **Note Management:** Add new books, edit existing reviews, or delete entries.
* **API Enrichment:** Automatically pulls cover art so you don't have to upload images manually.

---

## Database Schema
The application uses a relational structure to ensure data integrity. 

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL | Primary Key |
| `title` | VARCHAR(255) | Book Title |
| `author` | VARCHAR(255) | Author Name |
| `isbn` | VARCHAR(20) | Used for API Cover fetching |
| `rating` | INTEGER | Personal score (1-10) |
| `review` | TEXT | Detailed notes and takeaways |
| `date_read` | DATE | Date finished (for sorting) |

---

## Project Structure
```text
├── public/                # Static files (CSS, Images, Client-side JS)
├── views/                 # EJS templates (index.ejs, edit.ejs)
├── index.js               # Express server and API routes
├── queries.sql            # Database schema setup commands
├── .env                   # Environment variables (DB credentials)
└── package.json           # Dependencies and scripts