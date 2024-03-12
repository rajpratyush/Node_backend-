const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('./db');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 151, // limit each IP to 5 requests per windowMs
  message: "Too many login attempts. Try again later."
});
