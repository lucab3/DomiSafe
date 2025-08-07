const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { body, query } = require('express-validator');

router.use(auth, adminAuth);

router.get('/dashboard', adminController.getDashboard);

router.get('/employees', 
  query('status').optional().isIn(['active', 'inactive', 'pending']),
  query('zone').optional().isString(),
  adminController.getAllEmployees
);

router.get('/employees/pending', adminController.getPendingEmployees);

router.post('/employees/:id/approve', adminController.approveEmployee);

router.post('/employees/:id/reject', 
  body('reason').trim().notEmpty().withMessage('Razón de rechazo requerida'),
  adminController.rejectEmployee
);

router.put('/employees/:id/status', 
  body('status').isIn(['active', 'inactive']).withMessage('Estado inválido'),
  adminController.updateEmployeeStatus
);

router.get('/clients', 
  query('subscription').optional().isIn(['basic', 'premium', 'vip']),
  adminController.getAllClients
);

router.get('/services/requests', adminController.getServiceRequests);

router.post('/services/:id/assign', 
  body('employee_id').isUUID().withMessage('ID de empleada inválido'),
  adminController.assignServiceToEmployee
);

router.get('/statistics', 
  query('period').optional().isIn(['daily', 'weekly', 'monthly', 'yearly']),
  query('date_from').optional().isISO8601(),
  query('date_to').optional().isISO8601(),
  adminController.getStatistics
);

router.get('/statistics/zones', adminController.getZoneStatistics);

router.get('/reviews', 
  query('min_rating').optional().isInt({ min: 1, max: 5 }),
  query('status').optional().isIn(['active', 'hidden']),
  adminController.getAllReviews
);

router.put('/reviews/:id/toggle', adminController.toggleReviewVisibility);

router.get('/settings', adminController.getSettings);

router.put('/settings', 
  body('show_employees_to_clients').isBoolean().withMessage('Configuración inválida'),
  body('allow_client_reviews').optional().isBoolean(),
  body('max_employees_per_zone').optional().isInt({ min: 1 }),
  adminController.updateSettings
);

router.get('/revenue', 
  query('period').optional().isIn(['daily', 'weekly', 'monthly']),
  query('date_from').optional().isISO8601(),
  query('date_to').optional().isISO8601(),
  adminController.getRevenueStatistics
);

router.post('/notifications/broadcast', 
  body('title').trim().notEmpty().withMessage('Título requerido'),
  body('message').trim().notEmpty().withMessage('Mensaje requerido'),
  body('target').isIn(['all', 'clients', 'employees']).withMessage('Objetivo inválido'),
  adminController.sendBroadcastNotification
);

module.exports = router;