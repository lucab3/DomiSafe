const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');

router.get('/profile', auth, clientController.getProfile);

router.put('/profile', 
  auth,
  [
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Nombre inválido'),
    body('phone').optional().isMobilePhone('es-AR').withMessage('Teléfono inválido'),
    body('address').optional().trim().notEmpty().withMessage('Dirección inválida')
  ],
  clientController.updateProfile
);

router.get('/services', auth, clientController.getServices);

router.post('/services/request', 
  auth,
  [
    body('employee_id').optional().isUUID().withMessage('ID de empleada inválido'),
    body('service_date').isISO8601().withMessage('Fecha de servicio inválida'),
    body('service_type').isIn(['cleaning', 'cooking', 'babysitting', 'elderly_care', 'event']).withMessage('Tipo de servicio inválido'),
    body('duration_hours').isFloat({ min: 1, max: 12 }).withMessage('Duración inválida'),
    body('special_requests').optional().trim().isLength({ max: 500 }).withMessage('Solicitudes especiales muy largas')
  ],
  clientController.requestService
);

router.get('/services/:id', auth, clientController.getServiceById);

router.put('/services/:id/cancel', auth, clientController.cancelService);

router.post('/services/:id/review', 
  auth,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Calificación inválida'),
    body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comentario muy largo')
  ],
  clientController.reviewService
);

router.put('/preferences', 
  auth,
  body('preferences').isObject().withMessage('Preferencias inválidas'),
  clientController.updatePreferences
);

router.get('/favorites', auth, clientController.getFavoriteEmployees);

router.post('/favorites/:employee_id', auth, clientController.addFavoriteEmployee);

router.delete('/favorites/:employee_id', auth, clientController.removeFavoriteEmployee);

router.post('/referral', 
  auth,
  body('referred_email').isEmail().withMessage('Email del referido inválido'),
  clientController.referFriend
);

router.get('/subscription', auth, clientController.getSubscription);

router.post('/subscription/upgrade', 
  auth,
  body('plan').isIn(['basic', 'premium', 'vip']).withMessage('Plan inválido'),
  clientController.upgradeSubscription
);

module.exports = router;