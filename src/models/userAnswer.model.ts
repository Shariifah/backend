import mongoose, { Schema, model, Document } from "mongoose";

export interface UserAnswer extends Document {
    userId: mongoose.Types.ObjectId;
    questionId: mongoose.Types.ObjectId;
    selectedAnswers: number[];
    isCorrect: boolean;
    createdAt: Date;
}

const userAnswerSchema = new Schema<UserAnswer>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    selectedAnswers: { type: [Number], required: true },
    isCorrect: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const UserAnswerModel = model<UserAnswer>("UserAnswer", userAnswerSchema);
