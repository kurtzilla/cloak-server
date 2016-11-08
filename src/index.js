import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import users from './routes/users';
import auth from './routes/auth';
import events from './routes/events';

// const dotenv = require('dotenv').config();
//
// console.log('DOT', dotenv)
// console.log('PE', process.env.REACT_APP_DATABASE_URL)

let app = express();

app.use(bodyParser.json());

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/events', events);

app.listen(8080, () => console.log('Running on localhost:8080'));
