import jwt from 'jsonwebtoken';

const { TokenExpiredError } = jwt;

// const catchError = (err, res) => {
//   if (err instanceof TokenExpiredError) {
//     return res
//       .status(401)
//       .send({ message: 'Unauthorized! Access Token was expired!' });
//   }

//   return res.sendStatus(401).send({ message: 'Unauthorized!' });
// };

// const verifyToken = (req, res, next) => {
//   let token = req.headers['x-access-token'];

//   if (!token) {
//     return res.status(403).send({ message: 'No token provided!' });
//   }

//   jwt.verify(token, config.secret, (err, decoded) => {
//     if (err) {
//       return catchError(err, res);
//     }
//     req.userId = decoded.id;
//     next();
//   });
// };

export default async function isAuth(req, res, next) {
  const authHeader = req.get('Authorization');
  console.log('starting auth1');
  if (!authHeader || !authHeader.split(' ')[1]) {
    const error = new Error('No Token: Not authorized!');
    console.log('auth error1');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decode) => {
    if (err) {
      console.debug('isAuth invalid token err =', err);
      if (err instanceof TokenExpiredError) {
        return res
          .status(401)
          .send({ message: 'Unauthorized! Access Token was expired!' });
      }
      console.log(' err.message1 = ', err.message);
      const error = new Error(err.message);
      error.statusCode = 401;
      throw error;
      //return res.status(401).json({ error: err.message });
    }
    req.user = decode;
    req.userID = decode.userID;
    console.log('req  = ', decode);
    //console.log('req jti = ', req.decode.jti);
    return next(); // !important, you need this here to run.
  });
}
