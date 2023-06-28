const connect = require('./Connect')

connect.deleteMany()
.then(res=> {
    console.log("Success deleting all");
});