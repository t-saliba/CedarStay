/* Import the Express.js framework, 
and create an instance of the Express application. */
const express = require('express'); 
const app = express();   

const dotenv = require('dotenv').config();

const path = require('path');
const mongoose = require('mongoose');

//requiring errors file (error handlers)
const ExpressError = require('./Errors/ExpressError');

//for the layout files
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);

//Enables PUT or DELETE functionality in GET and POST-only
const methodOverride = require('method-override');

//require the models from user.js
const User = require('./models/user');

//require the routes folder
const hotelRoutes = require('./routes/hotels');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

//require passport
const passport = require('passport');
const LocalStrategy = require('passport-local');

/* I will add the express session feature for 2 reasons:
   1. I want to use flash messages
   2. I want to add authentication */
const session = require('express-session');
const flash = require('connect-flash');

//connect the application to a MongoDB database named "cedar-stay"
mongoose.connect('mongodb://localhost:27017/cedar-stay');

//This code connects to a MongoDB database using Mongoose, handling errors and logging a success message upon connection.
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})
 

//These lines configure Express to use EJS for rendering views and set the directory for the views.
app.set('view engine', 'ejs');   
app.set('views', path.join(__dirname, 'views'));  

//These lines set up middleware for parsing URL-encoded request bodies and overriding HTTP methods in Express.
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


/* This code sets up session middleware with specified configurations,
including a secret for signing session ID cookies,
and mounts it onto the Express application. It also enables flash message functionality. */
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));  //means that we would like the passport to use the LocalStrategy we have and to use the authenticate method in user model.

passport.serializeUser(User.serializeUser());  //means to tell passport how to store user in the session 
passport.deserializeUser(User.deserializeUser()); //how to get the user out of the session

/*middleware for the flash on every single request, I'm going to take whatever 
  is in the success and have access to it in my locals */ 
app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeuser', async (req, res) => {
    const user = new User ({email: 'toniiii@gmail.com', username: 'toniii'});
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
})


app.use('/', userRoutes);
app.use('/hotels', hotelRoutes);
app.use('/hotels/:id/reviews', reviewRoutes);

//home page route
app.get('/', (req, res) => {
    res.render('home');
})


/*process every single request and this will only run if nothing before has matched
we make a new error and then pass it to next() which is the function below*/
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

/* This error-handling middleware catches errors, sets a default 
status code and message if not provided, and renders an error page with the error details. */
app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh No, Something went wrong!!';  //checks if the error has a message 
    res.status(statusCode).render('error', { err });  //passing the whole error to my template so I can modify the alert message
})


app.listen(3000, ()=> {
    console.log('Serving on port 3000');
})
