const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

/**
 * 1. Helmet Middleware
 * Sets secure HTTP headers to prevent XSS, Clickjacking, and Sniffing.
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://maps.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://maps.gstatic.com"],
      connectSrc: ["'self'", "https://api.open-meteo.com"],
    },
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

/**
 * 2. CORS Configuration
 * Restricts access to specific origins only.
 */
const allowedOrigins = [
  'https://elected-app.run.app',
  'https://www.elected-app.run.app',
  process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : null
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

/**
 * 3. Rate Limiting Strategy
 * Prevents API abuse and Brute-force attacks.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

app.use('/api/', apiLimiter);

app.listen(8080, () => {
  console.log('Secure server running on port 8080');
});
