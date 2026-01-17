import mongoose, { Schema, Document } from "mongoose";

export interface IPdfReference extends Document {
  userId: string;
  month: number;
  year: number;
  r2Key: string;
  pdfGeneratedAt: Date;
  fileSize: number;
  status: "generated" | "sent" | "failed";
  emailSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const pdfReferenceSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      trim: true,
      description: "User identifier",
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
      description: "Month (1-12)",
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
      description: "Year (e.g., 2024, 2025)",
    },
    r2Key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      description:
        "Path in R2 storage: pdfs/{userId}/{year}/{month}/report.pdf",
    },
    pdfGeneratedAt: {
      type: Date,
      required: true,
      default: Date.now,
      description: "Timestamp when PDF was generated",
    },
    fileSize: {
      type: Number,
      required: true,
      min: 0,
      description: "File size in bytes",
    },
    status: {
      type: String,
      required: true,
      enum: ["generated", "sent", "failed"],
      default: "generated",
      description: "PDF status: generated, sent, or failed",
    },
    emailSentAt: {
      type: Date,
      description: "Timestamp when email with PDF was sent",
    },
  },
  {
    timestamps: true,
    collection: "pdf_references",
  },
);

const PdfReferenceModel = mongoose.model<IPdfReference>(
  "PdfReference",
  pdfReferenceSchema,
);
export default PdfReferenceModel;
