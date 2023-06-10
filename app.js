const createError = require('http-errors');
const express = require('express');
const session = require('express-session')
const path = require('path');
const logger = require('morgan');
const hbs = require('express-handlebars')
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user')
const fileUpload = require('express-fileupload')
const db = require('./config/connection')
const app = express();``

app.use(session({
  secret: 'arunSecretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 100000 * 60 }
}))

app.use((req, res, next) => {
  res.set(
    "Cache-control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({ layoutsDir: __dirname + '/views/layouts', extname: 'hbs', defaultLayout: 'layout', partialsDir: __dirname + '/views/partials/' }))

//---database connection------
db.connect((err) => {
  if (err) console.log('connection error'+err);
  else console.log('database succesfully connected')
})


app.use(fileUpload())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
