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
const idpApiUrl = 'https://sandbox.login.telia.io/realms/telia/protocol/openid-connect';
const clientID = 'AddClientIDHere';
const clientSecret = 'AddClientSecretHere';
const callbackURL = 'AddRedirectURLHere';  // Example: http://localhost:3000/auth/callback
const scope = ['AddScopeHere'];


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
  'provider',
  new Strategy({
    issuer: idpApiUrl,
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

app.get('/auth/provider', passport.authenticate('provider'));
app.get('/auth/provider/callback',
  passport.authenticate('provider', { successRedirect: '/',
    failureRedirect: '/login' }));

app.get('/', (req, res) => {
  console.log(req.user);
  res.render('index', { user: _.omit(req.user, '_raw') });
});

app.listen(3000, () => {
  console.log('Example client is listening on port 3000!'); // eslint-disable-line no-console
});
