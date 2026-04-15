import Invoice from '../model/Invoice.js';

// --- CREATE INVOICE ---
export const createInvoice = async (req, res) => {
  try {
    const newInvoice = new Invoice(req.body);
    const saved = await newInvoice.save();
    
    // Return with virtuals to show "Upcoming" and "Unpaid" immediately
    res.status(201).json(saved.toJSON({ virtuals: true }));
  } catch (err) {
    console.error("Create Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// --- GET ALL INVOICES (For Dashboard & History) ---
export const getInvoices = async (req, res) => {
  try {
    // We fetch documents without .lean() so Mongoose can calculate virtuals
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    
    // Force calculation of smartStatus (Ready) and paymentStatus (Paid/Unpaid)
    const responseData = invoices.map(doc => doc.toJSON({ virtuals: true }));
    
    res.json(responseData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- UPDATE FULL INVOICE (Details, Measurements, Money) ---
export const updateInvoice = async (req, res) => {
  try {
    // If you update totalAmount or advanceAmount here, 
    // the virtual paymentStatus will automatically update to "Paid" if balance hits 0
    const updated = await Invoice.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } 
    );
    
    if (!updated) return res.status(404).json({ error: "Invoice not found" });
    
    res.json(updated.toJSON({ virtuals: true }));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// --- UPDATE WORK STATUS ONLY (The "Ready" Button) ---
export const updateWorkStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expecting "Pending" or "Completed"

    const updated = await Invoice.findByIdAndUpdate(
      id,
      { $set: { status: status } },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Invoice not found" });

    // Returns smartStatus as "Ready" if status was set to "Completed"
    res.json(updated.toJSON({ virtuals: true }));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// --- DELETE INVOICE ---
export const deleteInvoice = async (req, res) => {
  try {
    const deleted = await Invoice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Invoice not found" });
    
    res.json({ message: "Invoice Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};