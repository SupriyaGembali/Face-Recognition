var express=require('express');
var recognitionController = require('./controllers/recognitionController');
var app=express();


//set up template engine
app.set('view engine','ejs');

//static files
app.use(express.static('./public'));

//fire controller
recognitionController(app);


//listen to port
app.listen(3000);
console.log("listening to 3000");
