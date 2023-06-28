const mongoose = require ('mongoose');
mongoose.set('strictQuery', false);

const db = "mongodb+srv://WebAPI_Ranveer:WebAPI_Ranveer@walmart-retail-dataset.7mu7vkk.mongodb.net/Web_API"

mongoose.connect(db).then(()=>{
    console.log("Connected to database");
})
.catch(()=>{
    console.log("Can't connect to database");
}
)

const movieSchema = new mongoose.Schema({
    movieTitle: {type: String},
    movieYear: {type: String},
    movieDirector: {type: String}
});

const Film = mongoose.model('6003CEM', movieSchema);

module.exports = Film;

//npm install express --save
//npm install axios
//npm install mongoose@6.10.0
//npm install mongodb
//npm install react