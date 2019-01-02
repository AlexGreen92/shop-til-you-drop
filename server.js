const express = require('express');
const session = require('express-session');
const passport = require('./app/config/passport');
const db = require('./app/models');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('views'));

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

require('./app/controller/routes/api-routes.js')(app);
require('./app/controller/routes/html-routes.js')(app);

db.sequelize.sync({ force: true }).then(() => {
    app.get('/', function(req, res) {
        res.send({ hello: 'world' });
    });

    app.listen(PORT, () => {
        console.log('App listening on PORT ' + PORT);
    });
});
