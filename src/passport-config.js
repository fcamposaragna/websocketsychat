import passport from "passport";
import fbStrategy from 'passport-facebook';
import UserService from './daos/users.js';
const User = new UserService()
const FacebookStrategy = fbStrategy.Strategy;

const initializePassportConfig = ()=>{
    passport.use('facebook', new FacebookStrategy({
        clientID: "4925718800799908",
        clientSecret: "fe8d5c82a3b28e15399ee6dab94c2f1d",
        callbackURL: "https://07e5-2803-9800-98c4-7a9b-f12a-7512-debb-9ead.ngrok.io/auth/facebook/callback",
        profileFields: ['emails']
    }, async (accesToken, refreshToken, profile, done)=>{
        try{
            //console.log(accesToken);
            //console.log(profile);
            console.log(profile.emails[0].value)
            let user = await User.getUser(profile.emails[0].value);
            done(null, user)
        }
        catch(error){
            done(error)
        }
    }))
    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })
    passport.deserializeUser((id,done)=>{
        User.findById(id,done);
    })
}
export default initializePassportConfig;