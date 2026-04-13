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
  
  // This now matches the "designLayers" array sent from your frontend
  designLayers: [DesignLayerSchema], 

  totalAmount: { type: Number, default: 0 },
  advanceAmount: { type: Number, default: 0 },
  balanceAmount: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now }
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