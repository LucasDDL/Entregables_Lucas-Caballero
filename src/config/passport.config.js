import passport from "passport";
import local from "passport-local"
import GithubStrategy from 'passport-github2'
import User from "../dao/models/userModel.js";
import { comparePassword, hashPassword } from "../utils/hashing.js";

const LocalStrategy = local.Strategy

const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        usernameField: "email",
        passReqToCallback: true
    },
        async function (req, username, password, done) {
            const { first_name, last_name, email, age } = req.body
            try {
                const user = await User.findOne({ email: username })
                const hashedPassword = await hashPassword(password)
                const role = (email.startsWith('admin') && password.startsWith('admin')) ? 'admin' : 'user';
                if (user) {
                    console.log('Ya existe un usuario con ese correo');
                    return done(null, false, { message: "Ya existe n usuario con ese correo" })
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: hashedPassword,
                    role
                }
                const result = await User.create(newUser)

                return done(null, result)
            } catch (error) {
                return done(error)
            }
        }))
    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await User.findOne({ email: username })
            const hashedPassword = user.password
            const validPassword = await comparePassword(password, hashedPassword)
            if (!user) {
                console.log('User not found')
                return done(null, false)
            }
            if (!validPassword) return done(null, false)
            return done(null, user)
        } catch (error) {
            console.error('fallo el login de passport', error);
            return done(error)
        }
    }))

    passport.use('github', new GithubStrategy.Strategy({
        clientID: 'Iv1.ac83708a25d55437',
        clientSecret: '268c6a4a577db961698f9f086915553e818416b7',
        callbackURL: 'http://localhost:8080/api/sessions/githubCallback'
    }, async(_accessToken, _refreshToken, profile, done) => {
        try {
            console.log(profile);
            const user = await User.findOne({email: profile._json.email})
            const name = profile._json.name
            const [first_name, last_name] = name.split(' ')
            if (!user) {
                let newUser = {
                    first_name: first_name,
                    last_name: last_name,
                    email: profile._json.email
                } 
                let result = await User.create(newUser)
                done(null, result)
            } else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }
))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        let user = await User.findById(id)
        done(null, user)
    })
}

export default initializePassport