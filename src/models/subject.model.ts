import { Schema, model, Document } from "mongoose";

export interface Subject extends Document {
    title: string;
    content: Buffer;
    mimeType: string;
    createdAt: Date;
    updatedAt: Date;
}

const subjectSchema = new Schema<Subject>({
    title: { type: String, required: true },
    content: { type: Buffer, required: true },
    mimeType: { type: String, default: "application/pdf" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }

});

export const SubjectModel = model<Subject>("Subject", subjectSchema);
