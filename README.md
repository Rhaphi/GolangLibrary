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
- **Authentication:** JWT (frontend & backend integration)

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


## Project Structure

```
GolangLibraryapp           # Root Directory of Folder
├── package-locl.json      # lockfile for backend dependencies
├── package.json           # Backend project dependencies and scripts
|
|
├── Backend                # Backend Go Folder
|   ├── books.db                      # SQLite database file
|   ├── cmd
|   │   └── main.go                     # Entry point for backend application
|   ├── docs                          # API documentation and Swagger files
|   │   ├── docs.go
|   │   ├── swagger.json
|   │   └── swagger.yaml
|   ├── go.mod                        # Go modules definition
|   ├── go.sum                        # Go modules checksums
|   ├── internals                     # Core backend application logic
|   |   ├── database
|   |   |   └── database.go
|   |   ├── delivery
|   |   |   └── http
|   |   |       ├── router.go
|   |   |       ├── book_handler.go
|   |   |       └── user_handler.go
|   |   ├── entity
|   |   |   └── book.go
|   |   |   └── user.go
|   |   ├── repository
|   |   |   └── book_repository.go
|   |   |   └── user_repository.go
|   |   ├── usecase
|   |   |   └── book_usecase.go
|   |   |   └── user_usecase.go
|   └── uploads                        # Uploaded book cover images
|
|
|
|
└── ui                       # Frontend React folder
    ├── package-lock.json        # npm lockfile for exact frontend deps versions
    ├── package.json             # npm package file for frontend dependencies
    ├── public                   # Public static assets
    │   ├── favicon.ico            # Browser tab icon
    │   ├── index.html             # Main HTML template
    │   ├── logo192.png            # App icon for PWA
    │   ├── logo512.png            # App icon for PWA
    │   ├── manifest.json          # PWA manifest file
    │   └── robots.txt             # Search engine crawl rules
    └── src                      # React source code
        ├── App.css                # Global CSS styles
        ├── App.js                 # Main app component and routing
        ├── App.test.js            # Tests for App.js
        ├── components             # Reusable React components
        │   ├── BookForm.jsx         # Form component to add/edit books
        │   └── useBook.jsx          # Custom hook for fetching books data
        ├── index.css              # Base CSS styles
        ├── index.js               # React entry point, renders <App />
        ├── logo.svg               # React logo asset
        ├── pages                  # React page components (screens/views)
        │   ├── BookList.jsx         # Book listing page with pagination
        │   ├── EditBook.jsx         # Book edit page
        │   ├── Home.jsx             # Home/landing page
        │   ├── Login.jsx            # Login page
        │   ├── Profile.jsx          # User profile page
        │   ├── Register.jsx         # Registration page
        │   └── SearchBooks.jsx      # Book search page
        ├── reportWebVitals.js     # Performance measuring
        └── setupTests.js          # Testing setup/configuration
```

## Installation & Setup

### 1. Prequisites 
   - Make sure Go is intalled on your device (Version 1.24 or above recommended)
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

### 3. Fronted Setup

**Navigate to frontend folder**
```
cd ui
```

**Install npm dependecies**
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

Open your browser and visit `http://localhost:3000` to use the LibraryHUB frontend.  
All API requests are proxied to the backend at port 8080.






