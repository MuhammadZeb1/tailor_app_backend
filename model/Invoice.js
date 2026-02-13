import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
  // We remove 'required' because the computer will generate it automatically
  invoiceNumber: { type: Number, unique: true }, 
  refNumber: { type: Number },
  customerName: { type: String, required: true },
  contactNo: { type: String, required: true }, 

  bookingDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date },
  
  measurements: [{
    label: String,
    value: String
  }],
  
  specifications: [{
    label: String,
    checked: Boolean
  }],
  
  selectedImages: [String],

  totalAmount: { type: Number, default: 0 },
  advanceAmount: { type: Number, default: 0 },
  balanceAmount: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now }
});

// --- FIXED AUTO-COUNTER LOGIC ---
InvoiceSchema.pre('save', async function () {
  // If it's not a new document, just exit the function
  if (!this.isNew) return; 

  try {
    // 1. Look for the last invoice saved
    // Use the model name directly as a string to avoid circular dependency issues
    const lastInvoice = await mongoose.model('Invoice').findOne().sort({ invoiceNumber: -1 });
    
    // 2. Increment the number
    this.invoiceNumber = lastInvoice ? lastInvoice.invoiceNumber + 1 : 1;
    
    // In async hooks, you don't need to call next()
  } catch (error) {
    // If there is an error, throwing it will stop the save process
    throw error;
  }
});

export default mongoose.model('Invoice', InvoiceSchema);