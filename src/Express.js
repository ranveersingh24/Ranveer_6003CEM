const Record = require('./Connect');
const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const apikey = 'fc1d5233';

// Implementing CSS styles
const cssStyles = `
<style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #E5CFEC;
  }
  
  h1 {
    color: #220A8F;
    margin: 20px;
  }
  
  h2 {
    text-align: center;
    color: #5D4AB5;
    margin: 10px;
    margin-top: 100px;
    margin-bottom: 20px;
    font-size: 35px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
    line-height: 1.2;
  }
  
  h4 {
    font-family: Copperplate;
    color: #5D4AB5;
    margin: 20px;
    margin-top: 10px;
    margin-bottom: 20px;
    font-size: 15px;
    font-weight: bold;
    line-height: 1.2;
  }

  h6 {
    font-family: Verdana;
    color: #051f3b;
    margin: 20px;
    margin-top: 20px;
    margin-bottom: 15px;
    font-size: 15px;
  }

  form {
    margin-bottom: 20px;
    text-align: center; 
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input[type="text"],
  input[type="password"] {
    width: 300px;
    padding: 15px;
    margin-top: 5px;
    margin-bottom: 20px;
    border: 3px solid #ccc;
    border-radius: 8px;
    font-size: 20px;
    color: #333;
  }

  input[type="text"]:focus,
  input[type="password"]:focus {
    outline: none;
    border-color: #66afe9;
    box-shadow: 0 0 5px #66afe9;
  }

  input[type="text"]::placeholder,
  input[type="password"]::placeholder {
    color: #999;
  }
  
  button {
    padding: 5px 10px;
    background-color: #242424;
    color: #fff;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease-in-out;
    font-size: 20px;
  }
  
  button:hover {
    background-color: #3EFF00;
    color: black;
  }
  
  button[type="submit"] {
    background-color: #007bff;
    color: white;
  }

  button[type="submit"]:hover {
    background-color: #0056b3;
    color: #fff;
  }
  
  a {
    color: #BD1B0A;
    text-decoration: none;
    position: relative;
    display: inline-block;
    transition: color 0.3s ease-in-out;
    font-weight: bold; 
    text-transform: uppercase; 
  }
  
  a:hover {
    color: black;
  }
  
  a::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px; /* Increased height for a thicker underline */
    bottom: -4px; /* Adjusted position to align with the text */
    left: 0;
    background-color: red;
    visibility: hidden;
    transform: scaleX(0);
    transition: all 0.3s ease-in-out;
  }
  
  a:hover::before {
    visibility: visible;
    transform: scaleX(1);

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  
  li {
    margin-bottom: 5px;
  }
  
  p {
    margin: 10px;
  }
</style>`;

app.use(bodyParser.urlencoded({ extended: false })); // Process data sent in an HTTP request body for Login & Register

// MongoDB connection
mongoose
  .connect('mongodb+srv://WebAPI_Ranveer:WebAPI_Ranveer@walmart-retail-dataset.7mu7vkk.mongodb.net/Web_API', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error);
  });

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', userSchema);

// Login page
app.get('/', (req, res) => {
  res.send(`
  ${cssStyles}  
    <h2>Login Page</h2>
    <form action="/login" method="POST">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" /><br />
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" /><br />
      <button type="submit">Login</button>
      <p>Don't have an account? Click here to register now <button type="button" onclick="window.location.href='/register'">Register</button>
    </form>
  `);
});

// Login function
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user in the database
  User.findOne({ username }, (error, user) => {
    if (error) {
      console.log('Error finding user:', error);
      return res.status(500).send('Error finding user');
    }
    if (!user) {
      // User not found
      return res.status(404).send('User not found. Please register first.');
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(401).send('Invalid password');
    }

    // Successful login
    const content = `
      <h6>Welcome, ${username}! <br><br><a href="/homepage">Go to homepage</a></h6>
    `;
    res.send(htmlLayout("Movie API", content));
  });
});

// Register page
app.get('/register', (req, res) => {
  res.send(`
  ${cssStyles}
  <link rel="stylesheet" type="text/css" href="styles.css">
    <h2>Register Page</h2>
    <form action="/register" method="POST">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" /><br />
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" /><br />
      <button type="submit">Register</button>
      <p>Already have an account? Click here to login now <button type="button" onclick="window.location.href='/'">Login</button>
    </form>
  `);
});

// Register function
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Create a new user object
  const newUser = new User({ username, password });

  // Save the user to the database and checks for existing users
  newUser.save((error) => {
    if (error) {
      console.log('Error saving user:', error);
      return res.status(500).send('Error registering user');
    }
    res.status(200).send('Registration successful! <br> Click here to login now <a href="/">Login</a>');
  });
});

// Set up HTML layout
const htmlLayout = (title, content) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>${title}</title>
      ${cssStyles}  
    </head>
    <body>
      <h1>${title}</h1>
      ${content}
    </body>
  </html>
`;

// Home page
app.get('/homepage', (req, res) => {
  const content = `
    <h6>Welcome to the Movie API homepage!</h6>
    <ul>
      <li><a href="/getAllMovie">Get All Movies</a></li><br>
      <li><a href="/getMovie">Get a Movie</a></li><br>
      <li><a href="/updateMovie">Update a Movie</a></li><br>
      <li><a href="/deleteMovie">Delete a Movie</a></li><br>
      <li><a href="/deleteAllMovie">Delete All Movies</a></li><br>
    </ul>
    <h6><a href="/">Logout</a></h6>
  `;
  res.send(htmlLayout("Movie API", content));
});

// Get all movies
app.get('/getAllMovie', (req, res) => {
  Record.find({}, (err, movies) => {
    if (err) {
      console.log("Error retrieving movies: " + err);
      const content = `
        <h6>Error retrieving movies from the database</h6>
        <h4><a href="/homepage">Go back to homepage</a></h4>
      `;
      res.status(500).send(htmlLayout("Get All Movies", content));
    } else {
      let movieList = '';
      movies.forEach((movie) => {
        movieList += `<h6><strong>Title:</strong> ${movie.movieTitle}</h6>`;
        movieList += `<h6><strong>Year:</strong> ${movie.movieYear}</h6>`;
        movieList += `<h6><strong>Genre:</strong> ${movie.movieGenre}</h6>`;
        movieList += `<h6><strong>Plot:</strong> ${movie.moviePlot}</h6>`;
        movieList += '<hr>'; // Add a horizontal rule after each movie
      });

      const content = `
        <h4><a href="/homepage">Go back to homepage</a></h4>
        <h2>All Movies</h2>
        ${movieList}
      `;
      res.send(htmlLayout("Get All Movies", content));
    }
  });
});

// Get a movie
app.get('/getMovie', (req, res) => {
  const title = req.query.title || '';

  const form = `
    <form action="/getMovie" method="GET">
      <label for="title">Movie Title:</label>
      <input type="text" id="title" name="title" value="${title}" />
      <br /><button type="submit">Get Movie</button>
    </form>
  `;

  if (!title) {
    const content = `
      <h4><a href="/homepage">Go back to homepage</a></h4>
      <h2>Insert a movie title and get the descriptions</h2>
      ${form}
    `;
    res.send(htmlLayout("Get a Movie", content));
  } else {
    const querystr = `http://www.omdbapi.com/?t=${title}&apikey=${apikey}`;
    axios.get(querystr)
      .then((response) => {
        const Title = response.data.Title;
        const Year = response.data.Year;
        const Genre = response.data.Genre;
        const Plot = response.data.Plot;
        const Poster = response.data.Poster;

        const filmValue = new Record({
          movieTitle: Title,
          movieYear: Year,
          movieGenre: Genre,
          moviePlot: Plot,
          moviePoster: Poster,
        });

        filmValue.save()
          .then(result => {
            console.log("Success: " + result);
          })
          .catch(error => {
            console.log("Error: " + error);
          });

        const content = `
          <h4><a href="/homepage">Go back to homepage</a></h4>
          <h2>${Title}</hh6>
          <h6>Year: ${Year}</h6>
          <h6>Genre: ${Genre}</h6>
          <h6>Plot: ${Plot}</h6>
          <h6><img src="${Poster}" alt="${Title} Poster" width="200" /></h6>
          <h6>Record saved</h6>
        `;

        res.send(htmlLayout("Get a Movie", content));
      })
      .catch(error => {
        const content = `
          <h2>Error</h2>
          <h6>${error.message}</h6>
          <h4><a href="/">Go back to homepage</a></h4>
        `;

        res.send(htmlLayout("Get a Movie", content));
      });
  }
});

// Update a movie
app.get('/updateMovie', (req, res) => {
  const title = req.query.title || '';
  const genre = req.query.genre || '';
  const plot = req.query.plot || '';

  const form = `
    <form action="/updateMovie" method="GET">
      <label for="title">Movie Title:</label>
      <input type="text" id="title" name="title" value="${title}" /><br />
      <label for="genre">Genre:</label>
      <input type="text" id="genre" name="genre" value="${genre}" /><br />
      <label for="plot">Plot:</label>
      <input type="text" id="plot" name="plot" value="${plot}" /><br />
      <button type="submit">Update Movie</button>
    </form>
  `;

  if (!title) {
    const content = `
      <h4><a href="/homepage">Go back to homepage</a></h4>
      <h2>Choose a movie title and update the details</h2>
      ${form}
    `;
    res.send(htmlLayout("Update a Movie", content));
  } else {
    Record.findOneAndUpdate(
      { movieTitle: title },
      { $set: { movieGenre: genre, moviePlot: plot } },
      { new: true },
      (err, updatedMovie) => {
        if (err) {
          console.log("Error updating movie: " + err);
          const content = `
            <h6>Error updating movie in the database</h6>
            <h4><a href="/homepage">Go back to homepage</a></h4>
          `;
          res.status(500).send(htmlLayout("Update a Movie", content));
        } else {
          if (!updatedMovie) {
            const content = `
              <h6>No movie found with the title "${title}"</h6>
              <h6><a href="/updateMovie">Try again</a></h6>
              <h4><a href="/homepage">Go back to homepage</a></h4>
            `;
            res.send(htmlLayout("Update a Movie", content));
          } else {
            const content = `
              <h2>Movie Updated</h2>
              <h6>Title: ${updatedMovie.movieTitle}</h6>
              <h6>Genre: ${updatedMovie.movieGenre}</h6>
              <h6>Plot: ${updatedMovie.moviePlot}</h6><br><br>
              <h6><a href="/updateMovie">Update another movie</a></h6>
              <h4><a href="/homepage">Go back to homepage</a></h4>
            `;
            res.send(htmlLayout("Update a Movie", content));
          }
        }
      }
    );
  }
});

// Delete one movie
app.get('/deleteMovie', (req, res) => {
  const title = req.query.title || '';

  const form = `
    <form action="/deleteMovie" method="GET">
      <label for="title">Movie Title:</label>
      <input type="text" id="title" name="title" value="${title}" />
      <br /><button type="submit">Delete Movie</button>
    </form>
  `;

  if (!title) {
    const content = `
      <h4><a href="/homepage">Go back to homepage</a></h4>
      <h2>Insert the title of the movie you wish to delete</h2>
      ${form}
    `;
    res.send(htmlLayout("Delete a Movie", content));
  } else {
    Record.deleteOne({ movieTitle: title }, function (err) {
      if (err) return handleError(err);
      // Deleted at most one document
    });

    const content = `
      <h6>${title} deleted</h6>
      <h4><a href="/homepage">Go back to homepage</a></h4>
    `;
    res.send(htmlLayout("Delete a Movie", content));
  }
});

// Delete all movies
app.get('/deleteAllMovie', (req, res) => {
  Record.deleteMany({}, (err) => {
    if (err) {
      console.log("Error deleting documents: " + err);
      const content = `
        <h6>Error deleting documents from the database</h6>
        <h4><a href="/homepage">Go back to homepage</a></h4>
      `;
      res.status(500).send(htmlLayout("Delete All Movies", content));
    } else {
      console.log("All documents deleted successfully");
      const content = `
        <h4><a href="/homepage">Go back to homepage</a></h4>
        <h6>All movies deleted</h6>
      `;
      res.send(htmlLayout("Delete All Movies", content));
    }
  });
});

app.listen(5000);


//npm install axios
//npm install mongoose@6.10.0
//npm install mongodb
//npm install react
//npm install express --save
//npm install body-parser