const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const axios = require('axios');
const querystring = require('querystring');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'https://ticlub.netlify.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Trust proxy (needed for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://www.google.com', 'https://www.gstatic.com', 'https://cdnjs.cloudflare.com'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:3000'],
            fontSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'", 'https://www.google.com']
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    name: 'sessionId', // Don't reveal we're using express-session
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        touchAfter: 24 * 3600 // Only update session once per day unless data changes
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Only send cookies over HTTPS in production
        httpOnly: true, // Prevent XSS
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        sameSite: 'strict'
    }
}));

// Rate limiting with different rules for different endpoints
const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per windowMs for sensitive operations
    message: 'Too many attempts, please try again later.'
});

const standardLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use('/api/join', strictLimiter); // Stricter limits for form submission
app.use('/api/', standardLimiter); // Standard limits for other API routes

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp());

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.CORS_ORIGIN.split(',')
        : 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 3600
};
app.use(cors(corsOptions));

// Body parser with size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Security headers for static files
app.use(express.static(__dirname + '/..', {
    setHeaders: (res, path, stat) => {
        res.set('X-Content-Type-Options', 'nosniff');
        res.set('X-Frame-Options', 'SAMEORIGIN');
        res.set('X-XSS-Protection', '1; mode=block');
        res.set('Referrer-Policy', 'same-origin');
        
        // Cache control for static assets
        if (path.endsWith('.html')) {
            res.set('Cache-Control', 'no-cache');
        } else {
            res.set('Cache-Control', 'public, max-age=31536000'); // 1 year for static assets
        }
    }
}));

// Request validation middleware
const validateJoinRequest = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]*$/)
        .withMessage('Name can only contain letters and spaces'),
    
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email address'),
    
    body('phone')
        .trim()
        .matches(/^[\d\s\-+()]{10,15}$/)
        .withMessage('Please enter a valid phone number'),
    
    body('department')
        .trim()
        .notEmpty()
        .withMessage('Department is required'),
    
    body('interests')
        .trim()
        .notEmpty()
        .withMessage('Interests are required'),
    
    body('year')
        .trim()
        .notEmpty()
        .withMessage('Year is required'),
    
    body('agreeToTerms')
        .isBoolean()
        .equals('true')
        .withMessage('You must agree to the terms and conditions')
];

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname + '/..' });
});

// MongoDB Connection
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Member Schema
const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    interests: { type: String, required: true },
    experience: String,
    year: { type: String, required: true },
    agreeToTerms: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Member = mongoose.model('Member', memberSchema);

// Email configuration
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    debug: true, // Enable debug logging
    logger: true // Log to console
});

// Test email configuration
async function testEmailConfig() {
    try {
        await transporter.verify();
        console.log('Email configuration is valid');
        
        // Send a test email
        const testMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Test Email',
            text: 'This is a test email to verify the email configuration.'
        };
        
        const info = await transporter.sendMail(testMailOptions);
        console.log('Test email sent successfully:', info.messageId);
    } catch (error) {
        console.error('Email configuration error:', error);
        
        // Try recreating transporter with different settings
        console.log('Attempting alternative email configuration...');
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            debug: true
        });
        
        try {
            await transporter.verify();
            console.log('Alternative email configuration is valid');
        } catch (err) {
            console.error('Alternative email configuration also failed:', err);
        }
    }
}

// Run email test on startup
testEmailConfig();

// Verify reCAPTCHA token
async function verifyRecaptchaToken(token) {
    try {
        console.log('Verifying reCAPTCHA token...');
        
        const verificationURL = 'https://www.google.com/recaptcha/api/siteverify';
        const data = querystring.stringify({
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: token
        });

        const response = await axios.post(verificationURL, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('reCAPTCHA response:', response.data);

        if (!response.data.success) {
            throw new Error('reCAPTCHA verification failed: ' + response.data['error-codes'].join(', '));
        }

        return { success: true };
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        throw new Error('reCAPTCHA verification failed: ' + (error.response?.data?.['error-codes']?.join(', ') || error.message));
    }
}

// Form submission endpoint
app.post('/api/join', validateJoinRequest, async (req, res) => {
    const startTime = new Date();
    console.log('\n=== New Form Submission ===');
    console.log(`[${startTime.toISOString()}] Starting form submission process`);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('[Validation] Request validation failed:', errors.array());
        return res.status(400).json({ 
            error: 'Invalid input',
            details: errors.array()
        });
    }

    try {
        // Verify reCAPTCHA first
        const recaptchaResult = await verifyRecaptchaToken(req.body['g-recaptcha-response']);
        if (!recaptchaResult.success) {
            throw new Error('reCAPTCHA verification failed');
        }

        // Sanitize inputs
        const sanitizedData = {
            name: req.body.name.trim(),
            email: req.body.email.toLowerCase().trim(),
            phone: req.body.phone.replace(/\s+/g, ''),
            department: req.body.department.trim(),
            interests: req.body.interests.trim(),
            experience: req.body.experience ? req.body.experience.trim() : '',
            year: req.body.year.trim(),
            agreeToTerms: Boolean(req.body.agreeToTerms)
        };

        // Check for existing member
        const existingMember = await Member.findOne({
            $or: [
                { email: sanitizedData.email },
                { phone: sanitizedData.phone }
            ]
        });

        if (existingMember) {
            throw new Error('A member with this email or phone number already exists');
        }

        // Create new member
        const member = new Member(sanitizedData);
        await member.save();

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: sanitizedData.email,
            subject: 'Welcome to TIC - Application Received',
            html: `
                <h2>Thank you for applying to TIC!</h2>
                <p>Dear ${sanitizedData.name},</p>
                <p>We have received your application for the Technical Innovation Club. Here are the details we received:</p>
                <ul>
                    <li>Name: ${sanitizedData.name}</li>
                    <li>Department: ${sanitizedData.department}</li>
                    <li>Year: ${sanitizedData.year}</li>
                </ul>
                <p>We will review your application and get back to you shortly.</p>
                <p>Best regards,<br>TIC Team</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully'
        });

    } catch (error) {
        console.error('\n[Error] Registration failed:', error);
        console.error('Stack trace:', error.stack);
        
        res.status(error.status || 500).json({
            error: error.message || 'An error occurred while processing your application'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    // Remove sensitive error details in production
    const error = process.env.NODE_ENV === 'production'
        ? 'An error occurred'
        : err.message;
    
    res.status(err.status || 500).json({ error });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Performing graceful shutdown...');
    
    // Close server
    server.close(() => {
        console.log('Server closed');
        
        // Close database connection
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
