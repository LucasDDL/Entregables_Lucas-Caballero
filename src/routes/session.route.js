import { Router } from "express";
import User from '../dao/models/userModel.js'
import { comparePassword, hashPassword } from "../utils/hashing.js";
import passport from "passport";

const router = Router()

router.get('/github', passport.authenticate('github', {scope:['user:email']}), async(req,res)=>{})

router.get('/githubCallback', passport.authenticate('github', {failureRedirect: '/login', failureMessage: true}), async(req, res)=>{
    req.session.user = {id: req.user._id}
    res.redirect('/products')
})

router.post('/register', passport.authenticate('register', { failureRedirect: '/registerFailed', failureMessage: true }), (req, res) => {
        res.redirect('/products')
})

router.get('/registerFailed', (req, res) => {
    console.log('Failed Strategy');
    res.send({error: 'Register failed'})
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/registerFailed', failureMessage:true}), async(req, res) => {
    if (!req.user) return res.status(401).send('Invalid credentials')
    req.session.user = {
        id: req.user._id
    }
    res.redirect('/products')
})

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al cerrar sesión')
        }
        res.redirect('/')
    })
})

router.post('/restore-password', async (req, res) => {
    const { email, password } = req.body
    try {
        const hashedPassword = await hashPassword(password)
        const user = await User.findOneAndUpdate({ email }, { password: hashedPassword })
        if (!user) {
            return res.status(400).send('User not found')
        }
        res.send('Password updated successfully')
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error')
    }

})

export default router
