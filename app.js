var express=require('express');
var recognitionController = require('./controllers/recognitionController');

//initialising app
const app = express();
//set up template engine


app.set('view engine','ejs');

//static files
app.use(express.static('./public'));

//fire controller
recognitionController(app);

const session = require('express-session');
const passport = require('passport');
require('./auth');


//Login Checker for authentication
function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//creating a route if this route is visited it shows a link to login
app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});


app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/google/failure'
  })
);

//Path for protected route which allow access to index page
app.get('/protected', isLoggedIn, (req, res) => {
  res.render('index');
});

//Logout Route to logout the user
app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
});

//Route to access logout failure page
app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});





//listen to port
app.listen(3000);
console.log("listening to 3000");
