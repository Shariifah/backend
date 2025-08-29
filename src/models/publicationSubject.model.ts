import { Schema, model, Document, Types } from "mongoose";

export interface Publication extends Document {
    subject: Types.ObjectId;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const publicationSchema = new Schema<Publication>({
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const PublicationSubjectModel = model<Publication>("Publication", publicationSchema);
