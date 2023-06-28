const connect = require('./Connect')

connect.deleteOne({Title:'Man of Steel'})
.then(res=> {
    console.log("Success deleting one");
});