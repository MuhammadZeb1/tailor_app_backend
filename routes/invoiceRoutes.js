import express from 'express';
const router = express.Router();

import { createInvoice, getInvoices, updateInvoice, deleteInvoice } from '../controller/invoiceController.js';

router.post('/', createInvoice);
router.get('/', getInvoices);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);
export default router;