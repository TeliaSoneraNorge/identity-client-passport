/* eslint-env node */
/* eslint-disable no-var, func-names, no-console */
import express from 'express';
import { renderFile } from 'ejs';
import bodyParser from 'body-parser';
import passport from 'passport';
import { Strategy } from 'passport-openidconnect';
import session from 'express-session';
import _ from 'lodash';


/* ---------------- Configuration ----------------  */
const issuer = 'https://login.telia.io/realms/telia';
const idpApiUrl = `${issuer}/protocol/openid-connect`;
const clientID = 'AddClientIDHere';
const clientSecret = 'AddClientSecretHere';
const callbackURL = 'http://localhost:3000/auth/callback';  // Change this in production
const scope = ['oidc'];


const app = express();
const users = {};
export default app;

app.engine('html', renderFile);
app.set('views', __dirname);
app.set('view engine', 'html');

app.use(express.static(`${__dirname}/../public`));
app.use('/vendor', express.static(`${__dirname}/../vendor`));
app.use(bodyParser.json());

passport.use(
  'openid-connect',
  new Strategy({
    issuer,
    authorizationURL: `${idpApiUrl}/auth`,
    tokenURL: `${idpApiUrl}/token`,
    userInfoURL: `${idpApiUrl}/userinfo`,
    clientID,
    clientSecret,
    callbackURL,
    scope,
  },
  (accessToken, refreshToken, profile, done) => {
    users[profile.preferred_username] = profile;
    done(null, profile);
  },
));

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});


app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/', passport.authenticate('openid-connect'));
app.get('/auth/callback',
  passport.authenticate('openid-connect', { successRedirect: '/',
    failureRedirect: '/' }));

app.get('/', (req, res) => {
  console.log(req.user);
  res.render('index', { user: _.omit(req.user, '_raw') });
});

app.listen(3000, () => {
  console.log('Example client is listening on port 3000!'); // eslint-disable-line no-console
});
