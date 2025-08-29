import { Schema, model, Document } from "mongoose";
import {SubjectType} from "../types/types";

export interface Subject extends Document {
    type: SubjectType;
    title: string;
    filePath: string;
    mimeType: string;
    createdAt: Date;
    updatedAt: Date;
}

const subjectSchema = new Schema<Subject>({
    type: { type: String, enum: ["cours", "examen"], required: true },
    title: { type: String, required: true },
    filePath: { type: String, required: true },
    mimeType: { type: String, default: "application/pdf" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }

});

export const SubjectModel = model<Subject>("Subject", subjectSchema);
