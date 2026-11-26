import { Schema, model, Document } from "mongoose";

export interface FeedbackDocument extends Document {
    userId: Schema.Types.ObjectId;
    serviceId: Schema.Types.ObjectId;
    bookingId: Schema.Types.ObjectId;
    rating: number;
    feedback: string;
    createdAt: Date;
    updatedAt: Date;
}

const feedbackSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    rating: { type: Number, required: true },
    feedback: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Feedback = model<FeedbackDocument>("Feedback", feedbackSchema);

export default Feedback;

