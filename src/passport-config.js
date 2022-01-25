import passport from "passport";
import fbStrategy from 'passport-facebook';
import { userService } from "./daos/index.js";
const FacebookStrategy = fbStrategy.Strategy;

const initializePassportConfig = ()=>{
    passport.use('facebook', new FacebookStrategy({
        clientID: "4925718800799908",
        clientSecret: "fe8d5c82a3b28e15399ee6dab94c2f1d",
        callbackURL: "https://38c3-2803-9800-98c4-7a9b-e9b6-803-5e92-b89.ngrok.io/auth/facebook/callback",
        profileFields: ['emails', 'picture', 'displayName']
    }, async (accesToken, refreshToken, profile, done)=>{
        try{
            let user={
                _id:profile._json.id,
                name: profile.displayName,
                email:profile.emails[0].value,
                alias:profile.displayName,
                photo: profile._json.picture.data.url
            }
            //let user = await (await userService.getUser(profile.emails[0].value)).payload;
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
        userService.findById(id,done);
    })
}
export default initializePassportConfig;