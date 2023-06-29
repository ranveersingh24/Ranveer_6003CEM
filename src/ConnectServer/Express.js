const Record = require('./Connect');
const express = require('express');
const app = express();
const axios = require('axios');

const apikey = 'fc1d5233';

// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));

// Set up CSS styling
const cssStyles = `
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
    }
  
    h1 {
      margin-bottom: 20px;
    }
  
    h2 {
      margin-top: 30px;
    }
  
    form {
      margin-bottom: 20px;
    }
  
    label {
      display: block;
      margin-bottom: 10px;
    }
  
    input[type="text"] {
      width: 300px;
      padding: 5px;
      margin-bottom: 10px;
    }
  
    input[type="submit"] {
      padding: 5px 10px;
    }
    
    .back-button {
      margin-top: 20px;
    }
    
    .movie-container {
      border: 1px solid #ccc;
      padding: 20px;
      margin-bottom: 20px;
    }
  
    .movie-container h3 {
      margin-top: 0;
    }
  
    .movie-container p {
      margin-bottom: 10px;
    }
  </style>
`;

// Set up HTML layout
const htmlLayout = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Movie CRUD</title>
    ${cssStyles}
  </head>
  <body>
    <h1>Movie CRUD</h1>
    
    <h2>Add Movie</h2>
    <form action="/addMovie" method="POST">
      <label for="title">Title:</label>
      <input type="text" name="title" id="title" required>
      <br>
      <label for="year">Year:</label>
      <input type="text" name="year" id="year" required>
      <br>
      <label for="director">Director:</label>
      <input type="text" name="director" id="director" required>
      <br>
      <input type="submit" value="Add Movie">
    </form>

    <h2>Get All Movies</h2>
    <button onclick="getAllMovies()">Get All Movies</button>
    <div id="movies"></div>

    <h2>Update Movie</h2>
    <form action="/updateMovie" method="PUT">
      <label for="title">Title:</label>
      <input type="text" name="title" id="title" required>
      <br>
      <label for="newTitle">New Title:</label>
      <input type="text" name="newTitle" id="newTitle" required>
      <br>
      <input type="submit" value="Update Movie">
    </form>

    <h2>Delete Movie</h2>
    <form action="/deleteMovie" method="DELETE">
      <label for="title">Title:</label>
      <input type="text" name="title" id="title" required>
      <br>
      <input type="submit" value="Delete Movie">
    </form>

    <script>
      function getAllMovies() {
        fetch('/getAllMovies')
          .then(response => response.json())
          .then(data => {
            const moviesContainer = document.getElementById('movies');
            moviesContainer.innerHTML = '';

            data.forEach(movie => {
              const movieContainer = document.createElement('div');
              movieContainer.className = 'movie-container';

              const title = document.createElement('h3');
              title.textContent = movie.movieTitle;

              const year = document.createElement('p');
              year.textContent = 'Year: ' + movie.movieYear;

              const director = document.createElement('p');
              director.textContent = 'Director: ' + movie.movieDirector;

              movieContainer.appendChild(title);
              movieContainer.appendChild(year);
              movieContainer.appendChild(director);
              moviesContainer.appendChild(movieContainer);
            });
          });
      }
    </script>
  </body>
  </html>
`;

// Create Movie
app.post('/addMovie', (req, res) => {
  const { title, year, director } = req.body;

  const filmValue = new Record({
    movieTitle: title,
    movieYear: year,
    movieDirector: director,
  });

  filmValue
    .save()
    .then(result => {
      console.log('Movie added successfully:', result);
      res.send('Movie added successfully');
    })
    .catch(error => {
      console.log('Error adding movie:', error);
      res.status(500).send('Error adding movie');
    });
});

// Get All Movies
app.get('/getAllMovies', (req, res) => {
  Record.find()
    .then(movies => {
      console.log('All movies retrieved:', movies);
      res.send(movies);
    })
    .catch(error => {
      console.log('Error retrieving movies:', error);
      res.status(500).send('Error retrieving movies');
    });
});

// Update Movie
app.get('/updateMovie', (req, res) => { // Change method to "get"
    const { title, newTitle } = req.query;
  
    Record.findOneAndUpdate(
      { movieTitle: title },
      { movieTitle: newTitle },
      { new: true }
    )
      .then(updatedMovie => {
        if (updatedMovie) {
          console.log('Movie updated successfully:', updatedMovie);
          res.send('Movie updated successfully');
        } else {
          console.log('Movie not found');
          res.status(404).send('Movie not found');
        }
      })
      .catch(error => {
        console.log('Error updating movie:', error);
        res.status(500).send('Error updating movie');
      });
  });

// Delete Movie
app.get('/deleteMovie', (req, res) => {
  const title = req.query.title;

  Record.findOneAndDelete({ movieTitle: title })
    .then(deletedMovie => {
      if (deletedMovie) {
        console.log('Movie deleted successfully:', deletedMovie);
        res.send('Movie deleted successfully');
      } else {
        console.log('Movie not found');
        res.status(404).send('Movie not found');
      }
    })
    .catch(error => {
      console.log('Error deleting movie:', error);
      res.status(500).send('Error deleting movie');
    });
});

// Render HTML layout
app.get('/', (req, res) => {
  res.send(htmlLayout);
});

// Start the server
app.listen(5000, () => {
  console.log('Server started on port 5000');
});


//Different style
//get a movie
/*app.get('/getMovie',  (req,res)=>{
const title = req.query.title;
const querystr = `http://www.omdbapi.com/?t=${title}&apikey=${apikey}`;
    axios.get(querystr).then((response)=>{
    Title = response.data.Title;
    Year = response.data.Year;
    Director = response.data.Director;

    filmValue = new Record({
        movieTitle:Title,
        movieYear:Year,
        movieDirector:Director,
    });

    filmValue.save().then(result=>{
        console.log("Success"+result);
    }).catch(error=>{
        console.log("Error"+error);
    })
    res.send(Title + "<br>" + Year + "<br>" + Director + "<br>" + "Record saved");

}
    );
});

//delete one movie
app.get('/deleteMovie',(req, res)=>{
    const title = req.query.title;
    console.log(title);
    Record.deleteOne({ movieTitle: title},function(err){
            if (err) return handleError(err);
            //deleted at most one tanked docuement
        });

        res.send(title + "deleted");
    
});

//delete all movie
app.get('/deleteAllMovie', (req, res) => {
    Record.deleteMany({}, (err) => {
        if (err) {
            console.log("Error deleting documents: " + err);
            res.status(500).send("Error deleting documents from the database");
        } else {
            console.log("All documents deleted successfully");
            res.send("All movies deleted");
        }
    });
});
*/


//npm install axios
//npm install mongoose
//npm install mongodb
//npm install react
//npm install express --save