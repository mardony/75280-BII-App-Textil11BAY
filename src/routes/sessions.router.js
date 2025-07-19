import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const sessionsRouter = Router();
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

sessionsRouter.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
    try {
        const user = req.user;
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_PRIVATE_KEY, { expiresIn: '1h' });
        res.status(200).json({ status: 'success', message: 'Login exitoso', token });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error en el login', error: error.message });
    }
});

sessionsRouter.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    if (req.user) {
        res.json({ status: 'success', payload: req.user });
    } else {
        res.status(401).json({ status: 'error', message: 'Token inválido o no proporcionado' });
    }
});

export default sessionsRouter;