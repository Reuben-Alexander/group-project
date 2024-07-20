import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { expressjwt } from "express-jwt";
import config from './../../config/config.js';

// Controller function for user sign-in
const signin = async (req, res) => {
    try {
        // Find user by name from the request body
        let user = await User.findOne({ "name": req.body.name });
        if (!user) {
            // Return 401 Unauthorized if user not found
            return res.status('401').json({ error: "User not found" });
        }

        // Authenticate user by comparing provided password
        if (!user.authenticate(req.body.password)) {
            // Return 401 Unauthorized if password does not match
            return res.status('401').send({ error: "name and password don't match." });
        }

        // Generate JWT token
        const token = jwt.sign({ _id: user._id }, config.jwtSecret);

        // Set the token in a cookie with an expiration date
        res.cookie('t', token, { expire: new Date() + 9999 });

        // Send response with the token and user details
        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        // Return 401 Unauthorized if any error occurs
        return res.status('401').json({ error: "Could not sign in" });
    }
};

// Controller function for user sign-out
const signout = (req, res) => {
    // Clear the token cookie
    res.clearCookie("t");

    // Send response confirming sign-out
    return res.status('200').json({
        message: "signed out"
    });
};

// Middleware to ensure user is signed in
const requireSignin = expressjwt({
    secret: config.jwtSecret,
    algorithms: ["HS256"],  // Specify the algorithm used to sign the JWT
    userProperty: 'auth'   // Set the property in the request object where the user info will be stored
});

// Middleware to check if the authenticated user has authorization to access a resource
const hasAuthorization = (req, res, next) => {
    // Check if the user's profile and authentication details are present and match
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!authorized) {
        // Return 403 Forbidden if user is not authorized
        return res.status('403').json({
            error: "User is not authorized"
        });
    }
    // Proceed to next middleware if authorized
    next();
};

// Export controller functions and middlewares
export default { signin, signout, requireSignin, hasAuthorization };
