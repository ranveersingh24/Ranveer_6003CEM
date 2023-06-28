const connect = require('./Connect')

connect.updateOne({Title:'Man of Steel'}, {Title:'New Man of Steel'})
.then(res=> {
    console.log("Success update one");
});