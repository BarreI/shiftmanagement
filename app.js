const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const { env } = require('process');
require('dotenv').config();

const Users = require('./models/user');
const Stores = require('./models/store');
const Shifts = require('./models/shift');
const Affiliations = require('./models/affiliation');

Users.sync().then(() => {
  Stores.belongsTo(Users, { foreignKey: 'ownerid' });
  Stores.sync().then(() => {
    Affiliations.belongsTo(Users, { foreignKey: 'systemid' });
    Affiliations.belongsTo(Stores, { foreignKey: 'storeid'});
    Affiliations.sync().then(() => {
      Shifts.belongsTo(Affiliations, { foreignKey: 'affiliationid' });
      Shifts.sync();
    });
  })
});

const accountRouter = require('./routes/account');
const loginRouter = require('./routes/login');
const homeRouter = require('./routes/homepage')
const newStoreRouter = require('./routes/newstore');
const logoutRouter = require('./routes/logout');
const authRouter = require('./routes/secondauth');
const joinRouter = require('./routes/join');

const app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('jsx', require('express-react-views').createEngine());

app.get('/test',function(req,res) {
  console.log("test通ってます");
  res.render('index.jsx');
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('views'));
app.use(session({ secret: env.sessionCode, resave: false, saveUninitialized: false }));

app.use('/', accountRouter);
app.use('/login', loginRouter);
app.use('/homepage', homeRouter);
app.use('/newstore', newStoreRouter);
app.use('/logout', logoutRouter);
app.use('/auth', authRouter);
app.use('/join', joinRouter);

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
