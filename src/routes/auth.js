import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


let router = express.Router();

router.post('/', (req, res) => {

  const { identifier, password } = req.body;

  User.query({
    where: { email: identifier },
    orWhere: { username: identifier }
  }).fetch().then(user => {
    // console.log('bubba', user)

      if(user){
        if(bcrypt.compareSync(password, user.get('password_digest'))){
          // generate jwt
          const token = jwt.sign({
            id: user.get('id'),
            username: user.get('username')
          }, process.env.REACT_APP_JWT_SECRET);
          res.json({ token });
        } else {
          res.status(401).json({ errors: { form: 'Invalid Credentials'} });
        }
      } else {
        // console.log('GUMP')
        res.status(401).json({ errors: { form: 'Invalid Credentials'} });
      }
  });
});

export default router;
