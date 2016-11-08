import jwt from 'jsonwebtoken';
import User from '../models/user';
import dotenv from 'dotenv';

dotenv.config();

export default (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];
  let token;

  if(authorizationHeader){
    token = authorizationHeader.split(' ')[1];
  }

  if(token){
    jwt.verify(token, process.env.REACT_APP_JWT_SECRET, (err, decoded) => {
      if(err){
        res.status(401).json({ error: 'Failed to authenticate' });
      } else {
        // 1) avoid db hits on every request
        req.userId = decoded.id;
        next();

        // - or -
        // 2) this method guarantees a valid user
        // User.query({
        //   where: { id: decoded.id },
        //   select: [ 'email', 'username', 'id' ]
        // }).fetch().then(user => {
        //   console.log('USER',user)
        //   if(!user){
        //     res.status(404).json({ error: 'No such user' });
        //   } else {
        //     // define a new var on request
        //     req.currentUser = user;
        //     next();
        //   }
        // });
      }
    });
  } else {
    res.status(403).json({
      errors: 'No token provided'
    });
  }
}
