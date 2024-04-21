import { Router } from "express";
import User from '../dao/models/userModel.js'

const router = Router()

router.post('/register', async(req, res) => {
    const {first_name, last_name, email, age, password} = req.body
try {
    const role = (email.startsWith('admin') && password.startsWith('admin')) ? 'admin' : 'user';
   
    const user = await User.create({
        first_name,
        last_name,
        email,
        age,
        password,
        role
    })
    req.session.user = {id: user._id, email: user.email, role: user.role}
    res.redirect('/products')
} catch (error) {
    console.error(error);
    res.status(400).send('error creando usuario')
}
   
})

router.post('/login', async(req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email, password})
        if (!user) {
            return res.status(400).send('Usuario no encontrado o contraseña incorrecta ')
        }
        req.session.user = {id: user._id, email: user.email, role: user.role}
        res.redirect('/products')
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor') 
    }
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

export default router
