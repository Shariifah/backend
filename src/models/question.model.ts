import mongoose, { Schema, model, Document } from "mongoose";

export interface Question extends Document {
    subjectId: mongoose.Types.ObjectId;
    text: string;
    options: string[];
    correctAnswers: number[];
    createdAt: Date;
}

const questionSchema = new Schema<Question>({
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    text: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswers: { type: [Number], required: true },
    createdAt: { type: Date, default: Date.now },
});

export const QuestionModel = model<Question>("Question", questionSchema);
