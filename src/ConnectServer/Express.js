const Record = require('./Connect');
const express = require ('express');
const app = express();
const axios = require ('axios');

const apikey = 'fc1d5233';

//get a movie_
app.get('/getMovie',  (req,res)=>{
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

app.listen(5000);

//npm install axios
//npm install mongoose
//npm install mongodb
//npm install react
//npm install express --save