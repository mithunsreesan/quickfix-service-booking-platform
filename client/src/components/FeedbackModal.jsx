import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

/* ── Star icon (filled / outlined) ── */
const StarIcon = ({ filled, hovered, onClick, onMouseEnter, onMouseLeave }) => (
    <svg
        role="button" tabIndex={0} aria-label="Select rating" onKeyDown={e => { if(e.key === "Enter" || e.key === " ") onClick(); }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-8 h-8 cursor-pointer transition-colors duration-200"
        fill={filled || hovered ? "#2563eb" : "none"}
        stroke={filled || hovered ? "#2563eb" : "#c4c7d2"}
        strokeWidth="1.5"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
    </svg>
);

/* ── Animation variants ── */
const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.92, y: 30 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", damping: 25, stiffness: 350 },
    },
    exit: { opacity: 0, scale: 0.92, y: 30, transition: { duration: 0.2 } },
};

const FeedbackModal = ({ isOpen, onClose, booking, onSubmitSuccess }) => {
    const { axios } = useAppContext();
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [feedbackText, setFeedbackText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleClose = () => {
        setRating(0);
        setHoveredStar(0);
        setFeedbackText("");
        onClose();
    };

    const handleSubmit = async () => {
        if (rating === 0 || !feedbackText.trim()) {
            toast.error("Please select a rating and write your feedback");
            return;
        }
        try {
            setSubmitting(true);
            const { data } = await axios.post("/api/bookings/feedback", {
                bookingId: booking._id,
                rating,
                feedback: feedbackText,
            });
            if (data.success) {
                toast.success("Feedback submitted successfully!");
                handleClose();
                onSubmitSuccess?.();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="overlay"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={handleClose}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                >
                    <motion.div
                        key="modal"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-[90%] max-w-md bg-white rounded-xl shadow-2xl p-8"
                    >
                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors
                cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>

                        {/* Header */}
                        <h2 className="text-xl font-semibold text-gray-800 mb-1">Share Your Feedback</h2>
                        <p className="text-gray-400 text-sm mb-6">
                            How was your experience with{" "}
                            <span className="text-primary font-medium">
                                {booking?.service?.title}
                            </span>
                            ?
                        </p>

                        {/* Star Rating */}
                        <div className="mb-6">
                            <p className="text-gray-500 mb-2">Rating</p>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon
                                        key={star}
                                        filled={star <= rating}
                                        hovered={star <= hoveredStar}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredStar(star)}
                                        onMouseLeave={() => setHoveredStar(0)}
                                    />
                                ))}
                                {rating > 0 && (
                                    <span className="ml-3 text-sm text-primary font-medium">
                                        {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Feedback Text */}
                        <div className="mb-6">
                            <p className="text-gray-500 mb-2">Your Feedback</p>
                            <textarea
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                placeholder="Tell us about your experience…"
                                rows={4} maxLength={2000} aria-label="Your feedback"
                                className="w-full border border-borderColor rounded-lg px-4 py-3 text-sm
                  text-gray-700 placeholder:text-gray-300 resize-none
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                  transition-all duration-200"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={handleClose}
                                className="px-5 py-2 rounded-lg text-gray-500 hover:bg-light transition-colors
                  duration-200 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="px-5 py-2 rounded-lg bg-primary text-white font-medium
                  hover:bg-primary-dull transition-colors duration-200 cursor-pointer
                  disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Submitting…" : "Submit Feedback"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FeedbackModal;
