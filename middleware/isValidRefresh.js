import jwt from 'jsonwebtoken';

const { TokenExpiredError } = jwt;

//checks if refresh token is valid
//if valid, then new access and new refresh token are issued. old refresh token is invalidated
//if invalid, then user is logged out and redirected to login page

export default async function isValidRefresh(req, res, next) {
  console.log('starting is valid refresh');
  const authHeader = req.get('Authorization');
  if (!authHeader || !authHeader.split(' ')[1]) {
    const error = new Error('No Token: Not authorized!');
    console.log('auth error1');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  console.debug('refresh token = ', token);
  console.debug(
    'process.env.JWT_REFRESH_TOKEN_SECRET = ',
    process.env.JWT_REFRESH_TOKEN_SECRET
  );
  jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, (err, decode) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        console.debug('refresh redirect');
        return res.status(401).redirect('/v1/login');
      }
      console.log(' err1 = ', err);
      //console.log(' type err1 = ',instanceof(err));
      console.log(' err.message1 = ', err.message);
      const error = new Error(err.message);
      error.statusCode = 401;
      throw error;
      //return res.status(401).json({ error: err.message });
    }

    req.username = decode.username;
    req.userID = decode.userID;

    //console.log('req jti = ', req.decode.jti);
    return next(); // !important, you need this here to run.
  });
}
