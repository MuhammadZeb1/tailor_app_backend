import mongoose from 'mongoose';

// 1. Define what a "Marker" looks like
const MarkerSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  text: String
});

// 2. Define what a "Design Layer" looks like
const DesignLayerSchema = new mongoose.Schema({
  name: String,
  url: String,
  x: Number,
  y: Number,
  markers: [MarkerSchema] 
});

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: Number, unique: true }, 
  refNumber: { type: Number },
  customerName: { type: String, required: true },
  contactNo: { type: String, required: true }, 
  customerAddress: { type: String },
  additionalNotes: { type: String },
  tadad: { type: Number, default: 1 },

  bookingDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date },
  
  // WORK STATUS: This is the manual "Ready" switch
  status: { 
    type: String, 
    enum: ["Pending", "Completed"], 
    default: "Pending" 
  },
  
  measurements: [{
    label: String,
    value: String
  }],
  
  specifications: [{
    label: String,
    checked: Boolean,
  }],
  
  designLayers: [DesignLayerSchema], 

  totalAmount: { type: Number, default: 0 },
  advanceAmount: { type: Number, default: 0 },
  balanceAmount: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- VIRTUAL 1: WORK READINESS (smartStatus) ---
// Returns "Ready" if Completed, otherwise calculates time-based status
InvoiceSchema.virtual('smartStatus').get(function() {
  if (this.status === "Completed") return "Ready";
  
  if (!this.deliveryDate) return "Pending";
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const delivery = new Date(this.deliveryDate);
  delivery.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((delivery - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Overdue";
  if (diffDays <= 2) return "Urgent";
  return "Upcoming";
});

// --- VIRTUAL 2: AUTOMATIC PAYMENT STATUS ---
// Calculates automatically: 0 balance = Paid, otherwise Unpaid
InvoiceSchema.virtual('paymentStatus').get(function() {
  // If balance is 0 or less, it's Paid. Otherwise, it's Unpaid.
  return this.balanceAmount <= 0 ? "Paid" : "Unpaid";
});

// --- AUTO-COUNTER LOGIC ---
InvoiceSchema.pre('save', async function () {
  if (!this.isNew) return; 
  try {
    const lastInvoice = await mongoose.model('Invoice').findOne().sort({ invoiceNumber: -1 });
    this.invoiceNumber = lastInvoice ? lastInvoice.invoiceNumber + 1 : 1;
  } catch (error) {
    throw error;
  }
});

export default mongoose.model('Invoice', InvoiceSchema);