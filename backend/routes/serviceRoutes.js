const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const auth = require('../middleware/auth');
const { body, query } = require('express-validator');

router.get('/', 
  auth,
  query('status').optional().isIn(['requested', 'confirmed', 'in_progress', 'completed', 'cancelled']),
  query('date_from').optional().isISO8601(),
  query('date_to').optional().isISO8601(),
  serviceController.getAllServices
);

router.get('/statistics', 
  auth,
  query('date_from').optional().isISO8601(),
  query('date_to').optional().isISO8601(),
  serviceController.getStatistics
);

router.get('/:id', auth, serviceController.getServiceById);

router.put('/:id/status', 
  auth,
  body('status').isIn(['confirmed', 'in_progress', 'completed', 'cancelled']).withMessage('Estado inválido'),
  serviceController.updateStatus
);

router.post('/:id/assign', 
  auth,
  body('employee_id').isUUID().withMessage('ID de empleada inválido'),
  serviceController.assignEmployee
);

router.get('/:id/chat', auth, serviceController.getChatMessages);

router.post('/:id/chat', 
  auth,
  body('message').trim().isLength({ min: 1, max: 500 }).withMessage('Mensaje inválido'),
  serviceController.sendMessage
);

module.exports = router;