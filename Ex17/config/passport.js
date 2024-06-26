const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      pool.query('SELECT * FROM users WHERE id = $1', [jwt_payload.id], (err, result) => {
        if (err) {
          return done(err, false);
        }
        if (result.rows.length > 0) {
          return done(null, result.rows[0]);
        } else {
          return done(null, false);
        }
      });
    })
  );
};
