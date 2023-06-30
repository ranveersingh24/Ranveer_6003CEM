const Record = require('./Connect');
const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const apikey = 'fc1d5233';

app.use(bodyParser.urlencoded({ extended: false }));

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
      <p>Welcome, ${username}! <br><a href="/homepage">Go to homepage</a></p>
    `;
    res.send(htmlLayout("Movie API", content));
  });
});

// Register page
app.get('/register', (req, res) => {
  res.send(`
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
    <p>Welcome to the Movie API homepage!</p>
    <ul>
      <li><a href="/getAllMovie">Get All Movies</a></li>
      <li><a href="/getMovie">Get a Movie</a></li>
      <li><a href="/updateMovie">Update a Movie</a></li>
      <li><a href="/deleteMovie">Delete a Movie</a></li>
      <li><a href="/deleteAllMovie">Delete All Movies</a></li>
    </ul>
    <p><a href="/">Logout</a></p>
  `;
  res.send(htmlLayout("Movie API", content));
});

// Get all movies
app.get('/getAllMovie', (req, res) => {
  Record.find({}, (err, movies) => {
    if (err) {
      console.log("Error retrieving movies: " + err);
      const content = `
        <p>Error retrieving movies from the database</p>
        <p><a href="/homepage">Go back to homepage</a></p>
      `;
      res.status(500).send(htmlLayout("Get All Movies", content));
    } else {
      let movieList = '';
      movies.forEach((movie) => {
        movieList += `<li>${movie.movieTitle} (${movie.movieYear}) - ${movie.movieGenre} - ${movie.moviePlot}</li>`;
      });

      const content = `
        <h2>All Movies</h2>
        <ul>${movieList}</ul>
        <p><a href="/homepage">Go back to homepage</a></p>
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
      <button type="submit">Get Movie</button>
    </form>
  `;

  if (!title) {
    const content = `
      <h2>Get a Movie</h2>
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
          <h2>${Title}</h2>
          <p>Year: ${Year}</p>
          <p>Genre: ${Genre}</p>
          <p>Plot: ${Plot}</p>
          <img src="${Poster}" alt="${Title} Poster" width="200" />
          <p>Record saved</p>
          <p><a href="/homepage">Go back to homepage</a></p>
        `;

        res.send(htmlLayout("Get a Movie", content));
      })
      .catch(error => {
        const content = `
          <h2>Error</h2>
          <p>${error.message}</p>
          <p><a href="/">Go back to homepage</a></p>
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
      <h2>Update a Movie</h2>
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
            <p>Error updating movie in the database</p>
            <p><a href="/homepage">Go back to homepage</a></p>
          `;
          res.status(500).send(htmlLayout("Update a Movie", content));
        } else {
          if (!updatedMovie) {
            const content = `
              <p>No movie found with the title "${title}"</p>
              <p><a href="/updateMovie">Try again</a></p>
              <p><a href="/homepage">Go back to homepage</a></p>
            `;
            res.send(htmlLayout("Update a Movie", content));
          } else {
            const content = `
              <h2>Movie Updated</h2>
              <p>Title: ${updatedMovie.movieTitle}</p>
              <p>Genre: ${updatedMovie.movieGenre}</p>
              <p>Plot: ${updatedMovie.moviePlot}</p>
              <p><a href="/updateMovie">Update another movie</a></p>
              <p><a href="/homepage">Go back to homepage</a></p>
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
      <button type="submit">Delete Movie</button>
    </form>
  `;

  if (!title) {
    const content = `
      <h2>Delete a Movie</h2>
      ${form}
    `;
    res.send(htmlLayout("Delete a Movie", content));
  } else {
    Record.deleteOne({ movieTitle: title }, function (err) {
      if (err) return handleError(err);
      // Deleted at most one document
    });

    const content = `
      <p>${title} deleted</p>
      <p><a href="/homepage">Go back to homepage</a></p>
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
        <p>Error deleting documents from the database</p>
        <p><a href="/homepage">Go back to homepage</a></p>
      `;
      res.status(500).send(htmlLayout("Delete All Movies", content));
    } else {
      console.log("All documents deleted successfully");
      const content = `
        <p>All movies deleted</p>
        <p><a href="/homepage">Go back to homepage</a></p>
      `;
      res.send(htmlLayout("Delete All Movies", content));
    }
  });
});

app.listen(5000);


//npm install axios
//npm install mongoose
//npm install mongodb
//npm install react
//npm install express --save