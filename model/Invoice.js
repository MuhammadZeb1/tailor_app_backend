import mongoose from 'mongoose';

// 1. Define what a "Marker" (the 3.3, 2.2 text on the image) looks like
const MarkerSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  text: String
});

// 2. Define what a "Design Layer" (the image + its markers) looks like
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
  // --- UNIQUE FEATURE CONFIG: Makes smartStatus visible to Frontend ---
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- UNIQUE FEATURE: DYNAMIC STATUS TRACKING ---
// Calculates status in real-time based on your FYP Proposal Section 4
InvoiceSchema.virtual('smartStatus').get(function() {
  if (this.balanceAmount <= 0) return "Completed";
  if (!this.deliveryDate) return "Pending";
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const delivery = new Date(this.deliveryDate);
  delivery.setHours(0, 0, 0, 0);

  const diffTime = delivery - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Overdue";      // Delivery date passed
  if (diffDays <= 2) return "Urgent";       // Today or Tomorrow
  return "Upcoming";                        // Normal future orders
});

// --- AUTO-COUNTER LOGIC ---
// Fixed the "next is not a function" by following async/await pattern properly
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