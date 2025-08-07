const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('name').trim().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  body('phone').trim().isMobilePhone('es-AR').withMessage('Teléfono inválido'),
  body('user_type').isIn(['client', 'employee']).withMessage('Tipo de usuario inválido')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida')
];

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', 
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  authController.forgotPassword
);
router.post('/reset-password', 
  body('token').notEmpty().withMessage('Token requerido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  authController.resetPassword
);

module.exports = router;