import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser';
import exphbs from 'express-handlebars';
import session from 'express-session';
import expressLayouts from 'express-ejs-layouts';
import methodOverride from 'method-override';
import compression from 'compression';
// import bodyParser from 'body-parser';


import { admin, projectManager, protect } from './middleware/authMiddleware.js'


// ERROR HANDLER
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
// import createError from 'http-errors';

// ROUTERS
import HomeRouter from './routes/home/homeRoutes.js';
import DashboardRouter from './routes/dashboard/dashboardRoutes.js'
// import userRouter from './routes/api/userRoutes.js';
// import ticketRouter from './routes/api/ticketRoutes.js';
// import projectRouter from './routes/api/projectRoutes.js';

dotenv.config()

connectDB()


var app = express();
app.use(compression())
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
// app.use(methodOverride('_method'))
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    // console.log(req.body)
    // console.log(typeof req.body)
    // console.log(req.body._method)
    var method = req.body._method
    delete req.body._method
    return method
  }
}))



const __dirname = path.resolve()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
  app.use(express.static(path.join(__dirname, 'public')));
}
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
}

// view engine setup
app.use(expressLayouts)
app.set('layout', './layouts/layout')
app.set('view engine', 'ejs');

// Cookie Middleware
app.use(cookieParser());

//Set Static Folder

// Set Session Options
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}))

app.use(protect)
// console.log('PROTECTED OUT');

// app.use('/', homeRouter);
// app.dynamicHelpers({
//   appSettings: function (req, res) {
//     return { denied: "" };
//   }
// });

// GLOBAL SETTING OF VARIABLES // EJS THROWS A FIT IF VARIABLE ISN'T DEFINED
app.use(function (req, res, next) {
  res.locals.managerPermission = false
  res.locals.adminPermission = false
  res.locals.home = false
  res.locals.oneItem = ""
  if (req.user) {
    res.locals.signedInUser = req.user
  }
  if (res.status == 304) {
    res.locals.denied = "That Route Does Not Exist For You"
  } else {
    res.locals.denied = ""
  }
  next()
})

app.use('/', HomeRouter);
app.use('/dashboard', DashboardRouter);
// app.use('/dashboard', admin, AdminRouter);
// app.use('/dashboard', projectManager, ManagerRouter);
// app.use('/dashboard', DeveloperRouter);




// Route API Middleware
// app.use('/api/users', userRouter);
// app.use('/api/tickets', protect, ticketRouter);
// app.use('/api/projects', protect, projectRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

app.use(notFound)
app.use(errorHandler)

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

const PORT = process.env.PORT || 3000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)