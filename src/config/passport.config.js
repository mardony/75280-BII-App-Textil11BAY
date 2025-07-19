import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

const initializePassport = () => {
    // Local Strategy for Login
    passport.use(
        'login',
        new LocalStrategy(
            {
                usernameField: 'email',
            },
            async (email, password, done) => {
                try {
                    const user = await User.findOne({ email });
                    if (!user) {
                        return done(null, false, { message: 'Usuario no encontrado' });
                    }
                    if (!bcrypt.compareSync(password, user.password)) {
                        return done(null, false, { message: 'Contraseña incorrecta' });
                    }
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // JWT Strategy for Current User Validation
    passport.use(
        'current',
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: JWT_PRIVATE_KEY,
            },
            async (jwt_payload, done) => {
                try {
                    const user = await User.findById(jwt_payload.id).lean();
                    if (!user) {
                        return done(null, false, { message: 'Usuario no encontrado en el token' });
                    }
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

export default initializePassport;