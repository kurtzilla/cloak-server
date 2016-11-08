import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import commonValidations from '../shared/validations/signup';
import User from '../models/user';
import isEmpty from 'lodash/isEmpty';
import dotenv from 'dotenv';

dotenv.config();

let router = express.Router();


function validateInput(data, otherValidations){
  let { errors } = otherValidations(data);

  return User.query({
    where: { email: data.email },
    orWhere: { username: data.username }
  }).fetch().then(user => {
    if(user){
      if(user.get('username') === data.username){
        errors.username = 'Username already exists';
      }
      if(user.get('email') === data.email){
        errors.email = 'Email already exists';
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  })
}

router.get('/:identifier', (req, res) => {
  // console.log('users - GETTING', req.params)
  User.query({
    select: [ 'username','email' ],
    where: { email: req.params.identifier },
    orWhere: { username: req.params.identifier }
  }).fetch().then(user => {
    res.json({user});
  })
});

router.post('/', (req, res) => {
  // console.log('users - POSTING', req.params)
  // run input validations
  // then check for uniqueness
  // if all good then do a db insert
  validateInput(req.body, commonValidations)
  .then(({ errors, isValid }) => {
    if(isValid) {
      const { username, password, email } = req.body;
      // TODO do we need timezone?
      const timezone = 'local';
      const password_digest = bcrypt.hashSync(password, 10);

      User.forge({
        username, timezone, email, password_digest
      }, { hasTimestamps: true }).save()
      .then(user => {
        const token = jwt.sign({
          id: user.get('id'),
          username: user.get('username')
        }, process.env.REACT_APP_JWT_SECRET);

        res.json({ success: true, token });
      })
      .catch(err => res.status(500).json({ error: err }));

    } else {
      res.status(400).json(errors);
    }
  });
});


export default router;
