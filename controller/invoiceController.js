import Invoice from '../model/Invoice.js';

// CREATE
export const createInvoice = async (req, res) => {
  try {
    // It's good practice to log the incoming body to verify designLayers is present
    console.log("Incoming Invoice Data:", JSON.stringify(req.body, null, 2));

    const newInvoice = new Invoice(req.body);
    const saved = await newInvoice.save();
    
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
export const getInvoices = async (req, res) => {
  try {
    // .lean() makes the query faster if you're only reading data
    const invoices = await Invoice.find().sort({ createdAt: -1 }).lean();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateInvoice = async (req, res) => {
  try {
    // runValidators ensures the update follows your Schema rules
    const updated = await Invoice.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } 
    );
    
    if (!updated) return res.status(404).json({ error: "Invoice not found" });
    
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
export const deleteInvoice = async (req, res) => {
  try {
    const deleted = await Invoice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Invoice not found" });
    
    res.json({ message: "Invoice Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};