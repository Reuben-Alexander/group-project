import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import Template from './../template.js'
import userRoutes from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'

const app = express()

app.get('/', (req, res) => {
    res.status(200).send(Template())
})

// Middleware to parse JSON and URL-encoded request bodies (should be first)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies
app.use(cookieParser());

// Middleware for response compression
app.use(compress());

// Middleware for setting security headers
app.use(helmet());

// Middleware for enabling CORS
app.use(cors());

// Route handling (should be after body parsing and other middleware)
app.use('/', userRoutes);
app.use('/', authRoutes);

// Error handling (should be last to catch errors from all previous middlewares and routes)
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ "error": err.name + ": " + err.message });
    } else if (err) {
        res.status(400).json({ "error": err.name + ": " + err.message });
        console.log(err);
    }
});



export default app
