import passport from "passport";
import fbStrategy from 'passport-facebook';
import { userService } from "../daos/index.js";
const FacebookStrategy = fbStrategy.Strategy
import config from "./config.js";

const initializePassportConfig = ()=>{
    passport.use('facebook', new FacebookStrategy({
        clientID: config.clientId,
        clientSecret: config.clientSecret,
        callbackURL: "https://cd32-2803-9800-98c4-7a9b-c124-7edd-523a-101a.ngrok.io/auth/facebook/callback",
        profileFields: ['emails', 'picture', 'displayName']
    }, async (accesToken, refreshToken, profile, done)=>{
        try{
            let exists = await userService.getUser(profile.emails[0].value)
            if(exists){
                return done(null,exists.payload)   
            }else{
                let newUser = {
                    nombre: profile.displayName,
                    email:profile.emails[0].value,
                    alias:profile.displayName,
                    avatar: profile._json.picture.data.url
                }
                let create = await userService.saveUser(newUser);
                console.log('Se creo un nuevo usuario '+create.payload)
                return done(null, create.payload)
            }
        }
        catch(error){
            return done(error)
        }
    }))

    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })
    passport.deserializeUser(async (id,done)=>{
        let getUser = await userService.findById(id)
        done(null,getUser.payload)
    })
}
export default initializePassportConfig;