const passport = require('passport');
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [payload.id]);
      if (result.rows.length === 0) {
        return done(null, false);
      }
      const user = result.rows[0];
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);

module.exports = passport;
