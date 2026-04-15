import express from 'express';
const router = express.Router();
import { 
  createInvoice, 
  getInvoices, 
  updateInvoice, 
  deleteInvoice,
  updateWorkStatus 
} from '../controller/invoiceController.js';

router.post('/', createInvoice);
router.get('/', getInvoices);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);

// This is your ONLY separate status API
router.patch('/:id/work-status', updateWorkStatus);

export default router;