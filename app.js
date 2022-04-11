/*
  app.js -- This creates an Express webserver with login/register/logout authentication
  This version has removed all of the authentication and database management.
*/

// *********************************************************** //
//  Loading packages to support the server
// *********************************************************** //
// First we load in all of the packages we need for the server...
const createError = require("http-errors"); // to handle the server errors
const express = require("express");
const path = require("path");  // to refer to local paths
const cookieParser = require("cookie-parser"); // to handle cookies
const session = require("express-session"); // to handle sessions using cookies
const bodyParser = require("body-parser"); // to handle HTML form input
const debug = require("debug")("personalapp:server"); 
const layouts = require("express-ejs-layouts");

const courses = require('./public/js/courses'); //load in the courses from the 2020-21 academic year




// *********************************************************** //
// Initializing the Express server 
// This code is run once when the app is started and it creates
// a server that respond to requests by sending responses
// *********************************************************** //
const app = express();

// Here we specify that we will be using EJS as our view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");



// this allows us to use page layout for the views 
// so we don't have to repeat the headers and footers on every page ...
// the layout is in views/layout.ejs
app.use(layouts);

// Here we process the requests so they are easy to handle
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// Here we specify that static files will be in the public folder
app.use(express.static(path.join(__dirname, "public")));

// Here we enable session handling using cookies
app.use(
  session({
    secret: "zzbbyanana789sdfa8f9ds8f90ds87f8d9s789fds", // this ought to be hidden in process.env.SECRET
    resave: false,
    saveUninitialized: false
  })
);

// *********************************************************** //
//  Defining the routes the Express server will respond to
// *********************************************************** //



// specify that the server should render the views/index.ejs page for the root path
// and the index.ejs code will be wrapped in the views/layouts.ejs code which provides
// the headers and footers for all webpages generated by this app
app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/about", (req, res, next) => {
  res.render("about");
});

app.get("/pa03", (req, res, next) => {
  res.locals.vals=[2,3,5,7,11,13,17,19]
  res.locals.timcs = courses.byInstructorEmail('tjhickey')
  res.render("pa03");
});

app.get("/demo", (req, res, next) => {
  res.render("demo");
});

app.get("/exam8a", (req, res, next) => {
  res.render("exam8a");
});

app.get("/exam8b", (req, res, next) => {
  res.render("exam8b");
});

app.get("/exam10a", (req, res, next) => {
  res.render("exam10a");
});

app.get("/exam10b", (req, res, next) => {
  res.render("exam10b");
});

app.get("/exam10c", (req, res, next) => {
  res.locals.nums = []
  res.render("exam10c");
});

app.get("/exam10c/:a/:b/:c", (req, res, next) => {
  res.locals.nums = []
  const {a,b,c} = req.params;
  const product = parseInt(a)*parseInt(b)*parseInt(c)
  res.json({a,b,c,product})
});

app.post("/exam10c", (req, res, next) => {
  const {a,b,c} = req.body;
  const avg = (parseInt(a)+parseInt(b)+parseInt(c))/3;
  res.locals.nums=[a,b,c]
  res.locals.avg=avg
  res.render("exam10c");
});

app.get("/sandbox", 
  (req, res, next) => {
        res.render("sandbox");
      }
);

app.get("/forms", 
  (req, res, next) => {
        res.render("formdemo");
      }
);

app.post("/forms", 
  (req, res, next) => {
        res.json(req.body)
      }
);

app.get("/boots", 
  (req, res, next) => {

        res.render("bootstrapdemo");
      }
);

app.get('/pets', (req,res,next) => {
  res.render('pets')
})





// here we catch 404 errors and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// this processes any errors generated by the previous routes
// notice that the function has four parameters which is how Express indicates it is an error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


// *********************************************************** //
//  Starting up the server!
// *********************************************************** //
//Here we set the port to use between 1024 and 65535  (2^16-1)
const port = "5000";
app.set("port", port);

// and now we startup the server listening on that port
const http = require("http");
const server = http.createServer(app);

server.listen(port);

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

server.on("error", onError);

server.on("listening", onListening);

module.exports = app;
