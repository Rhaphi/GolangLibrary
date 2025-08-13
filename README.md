# LibraryHUB

## What it is
LibraryHUB is a web-based application that allows users to register an account, log in, and manage a digital library of books.  
Once logged in, users can:
- View a paginated list of books
- Search for books by title or other attributes
- Add new books to the library
- Edit or delete existing books
- Upload and display images for book covers

The application is designed to be user-friendly, responsive, and efficient for managing library records.

## Background
This project was developed by an intern at **PT GoTo Gojek Tokopedia TBK** as a learning experience.  
The primary goals were to:
- Learn backend development with the **Go programming language (Golang)**
- Gain hands-on experience designing RESTful APIs
- Understand database integration for storing and retrieving book data
- Explore frontend development using **JavaScript, HTML, and CSS** via the **React** library
- Practice full-stack development workflows, including connecting frontend to backend and handling authentication

## Tech Stack
### Backend
- **Language:** Golang (v1.24)  
- **Database:** SQLite  
- **Web Framework / Router:** Gorilla Mux  
- **ORM:** GORM  
- **Authentication:** JWT 
- **Environment Variables:** godotenv  
- **CORS Handling:** rs/cors  
- **API Documentation:** Swagger

### Frontend
- **Language:** JavaScript (ES6+), HTML, CSS3
- **Library:** React.js  
- **Styling:** CSS3, Bootstrap  
- **HTTP Client:** Axios

### Tools
- **Version Control:** GitHub
- **Package Managers:** npm (frontend), Go Modules (backend)
- **Build Tools:** Go compiler (backend), React Scripts (frontend)

## Features

- **User Registration & Authentication**  
  Users can securely create accounts, log in, and log out.

- **Book Management**  
  Add, edit, and delete books in the digital library.

- **Pagination**  
  Browse books page by page with navigation controls.

- **Book Details**  
  View detailed information for each book, including title, author, publisher, year, ISBN, country of origin, and cover image.

- **Search**  
  Quickly find books by searching titles or authors.

- **Error Handling & User Feedback**  
  Provides feedback for loading states, errors, and empty search results.

## Data Structure
**Book**
| Field               | Type   | Description                                                          |
| ------------------- | ------ | -------------------------------------------------------------------- |
| `id`                | UUID   | Unique identifier (generated automatically with `gen_random_uuid()`) |
| `title`             | string | Title of the book                                                    |
| `author`            | string | Author’s name                                                        |
| `isbn`              | string | International Standard Book Number                                   |
| `publisher`         | string | Publisher of the book                                                |
| `year_published`    | int    | Year the book was published                                          |
| `country_of_origin` | string | Country where the book originated                                    |
| `image_url`         | string | URL to the book’s cover image                                        |

**User**
| Field        | Type     | Description                     |
| ------------ | -------- | ------------------------------- |
| `id`         | uint     | Unique user ID (auto-increment) |
| `name`       | string   | User’s name                     |
| `email`      | string   | User’s email (must be unique)   |
| `password`   | string   | Hashed password                 |



## Project Structure

```
GolangLibraryapp               # Root directory
├── package-lock.json          # Lockfile for backend dependencies
├── package.json               # Backend dependencies & scripts
│
├── backend                    # Backend Go application
│   ├── books.db                # SQLite database file
│   ├── cmd
│   │   └── main.go             # Backend entry point
│   ├── docs                    # Swagger API documentation
│   │   ├── docs.go
│   │   ├── swagger.json
│   │   └── swagger.yaml
│   ├── go.mod                  # Go module definition
│   ├── go.sum                  # Go module checksums
│   ├── uploads                 # Uploaded book cover images
│   └── internals               # Core backend application logic
│       ├── database
│       │   └── database.go         # DB initialization & connection
│       ├── delivery
│       │   └── http
│       │       ├── router.go       # API routes & middleware
│       │       ├── book_handler.go # Book HTTP handlers
│       │       └── user_handler.go # User HTTP handlers
│       ├── entity
│       │   ├── book.go              # Book entity model
│       │   └── user.go              # User entity model
│       ├── repository
│       │   ├── book_repository.go   # Book DB operations
│       │   └── user_repository.go   # User DB operations
│       └── usecase
│           ├── book_usecase.go      # Book business logic
│           └── user_usecase.go      # User business logic
│
└── ui                         # Frontend React application
    ├── package-lock.json       # npm lockfile
    ├── package.json            # Frontend dependencies
    ├── public                  # Static assets
    │   ├── favicon.ico
    │   ├── index.html
    │   ├── logo192.png
    │   ├── logo512.png
    │   ├── manifest.json
    │   └── robots.txt
    └── src                     # React source code
        ├── App.css
        ├── App.js
        ├── App.test.js
        ├── components
        │   ├── BookForm.jsx
        │   └── useBook.jsx
        ├── index.css
        ├── index.js
        ├── logo.svg
        ├── pages
        │   ├── BookList.jsx
        │   ├── EditBook.jsx
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── Profile.jsx
        │   ├── Register.jsx
        │   └── SearchBooks.jsx
        ├── reportWebVitals.js
        └── setupTests.js
```

## Installation & Setup

### 1. Prerequisites 
   - Make sure Go is intsalled on your device (Version 1.24 or above recommended)
   - Make sure Node.js and Npm are installed for the frontend

### 2. Backend Setup

**Navigate to backend folder**
```
cd backend
```

**Download Go modules dependencies**
```
go mod download
```

**Build the backend server**
```
go build -o app cmd/main.go
```

**Run the Backend servers**
```
./app
```

### 3. Frontend Setup

**Navigate to frontend folder**
```
cd ui
```

**Install npm dependencies**
```
npm install
```

Start the development server
```
npm start
```

This will launch the app on localhost:3000 by default

## Usage

- Backend server runs on `http://localhost:8080`
- Frontend app runs on `http://localhost:3000`
- API Documentation

Open your browser and visit `http://localhost:3000` to use the LibraryHUB frontend.  
All API requests are proxied to the backend at port 8080.




