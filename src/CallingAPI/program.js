const axios = require('axios');

const apikey = 'fc1d5233';
const title = 'Man of Steel';

const querystr = `http://www.omdbapi.com/?t=${title}&apikey=${apikey}`;

axios.get(querystr).then( (response) =>{

console.log(response.data.Title);
console.log(response.data.Year);
console.log(response.data.Genre);
console.log(response.data.Plot);
console.log(response.data.Ratings[0].Source);
console.log(response.data.Ratings[0].Value);

}
);

//npm install axios
//npm install mongoose
//npm install mongodb
//npm install react
//npm install express --save