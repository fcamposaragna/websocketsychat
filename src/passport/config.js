import dotenv from 'dotenv'
import __dirname from '../utils.js'
dotenv.config()

const config ={
    clientId : process.env.CLIENTID,
    clientSecret : process.env.CLIENTSECRET
}
export default config;