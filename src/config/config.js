import dotenv from 'dotenv'

dotenv.config();

export default {
    port: process.env.PORT,
    mongoURL: process.env.MONGO_URL,
    sessionSecret: process.env.SESSION_SECRET,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
}