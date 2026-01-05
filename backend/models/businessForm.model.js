import mongoose from "mongoose";

const BusinessSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  middlename: {
    type: String,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ["step1", "step2", "step3", "complete"],
    default: "complete"
  },
  controlNumber: {
    type: String,
    unique: true
  }
}, { timestamps: true });

// Auto-generate controlNumber before saving - SIMPLIFIED VERSION
BusinessSchema.pre("save", async function() {
  // Only generate for new documents without a controlNumber
  if (this.isNew && !this.controlNumber) {
    const currentYear = new Date().getFullYear();
    
    // Use this.constructor to get the model
    const BusinessModel = this.constructor;
    
    // Find last record for this year
    const lastRecord = await BusinessModel.findOne({
      controlNumber: { $regex: `^${currentYear}-` }
    }).sort({ controlNumber: -1 });

    let sequence = 1;
    if (lastRecord && lastRecord.controlNumber) {
      const parts = lastRecord.controlNumber.split("-");
      if (parts.length === 2) {
        const lastSeq = parseInt(parts[1], 10);
        sequence = !isNaN(lastSeq) ? lastSeq + 1 : 1;
      }
    }

    // Pad sequence with leading zeros (0001, 0002, etc.)
    const paddedSeq = String(sequence).padStart(4, "0");
    this.controlNumber = `${currentYear}-${paddedSeq}`;
  }
});

const Business = mongoose.model("Business", BusinessSchema);

export default Business;