const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const auth = require('../middleware/auth');
const { body, query } = require('express-validator');

router.get('/', 
  query('zone').optional().isString(),
  query('services').optional().isString(),
  query('min_rating').optional().isFloat({ min: 0, max: 5 }),
  query('latitude').optional().isFloat(),
  query('longitude').optional().isFloat(),
  query('radius').optional().isInt({ min: 1, max: 50 }),
  employeeController.getAllEmployees
);

router.get('/search', employeeController.searchEmployees);

router.get('/near-me', 
  query('latitude').isFloat().withMessage('Latitud requerida'),
  query('longitude').isFloat().withMessage('Longitud requerida'),
  query('radius').optional().isInt({ min: 1, max: 50 }),
  employeeController.getEmployeesNearLocation
);

router.get('/:id', employeeController.getEmployeeById);

router.post('/', 
  auth,
  [
    body('name').trim().isLength({ min: 2 }).withMessage('El nombre es requerido'),
    body('phone').isMobilePhone('es-AR').withMessage('Teléfono inválido'),
    body('zone').trim().notEmpty().withMessage('La zona es requerida'),
    body('services_offered').isArray().withMessage('Los servicios deben ser un array'),
    body('hourly_rate').isFloat({ min: 0 }).withMessage('Tarifa por hora inválida')
  ],
  employeeController.createEmployee
);

router.put('/:id', 
  auth,
  employeeController.updateEmployee
);

router.delete('/:id', 
  auth,
  employeeController.deleteEmployee
);

router.post('/:id/availability', 
  auth,
  body('availability').isObject().withMessage('Disponibilidad inválida'),
  employeeController.updateAvailability
);

router.get('/:id/reviews', employeeController.getEmployeeReviews);

router.post('/:id/reviews', 
  auth,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Calificación inválida'),
    body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comentario muy largo')
  ],
  employeeController.addReview
);

module.exports = router;