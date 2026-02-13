import Invoice from '../model/Invoice.js';

// CREATE
// CREATE
export const createInvoice = async (req, res) => {
  try {
    // Just pass the body. The Model's "pre-save" hook 
    // will automatically add the invoiceNumber.
    const newInvoice = new Invoice(req.body);

    console.log("body",req.body)
    
    console.log("Saving new invoice for:", req.body.customerName);
    
    const saved = await newInvoice.save();
    
    // Send the saved invoice (which now includes the auto-number) back to the frontend
    res.status(201).json(saved);
  } catch (err) {
    // If something goes wrong (like a missing name), show the error
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateInvoice = async (req, res) => {
  try {
    const updated = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
export const deleteInvoice = async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: "Invoice Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};