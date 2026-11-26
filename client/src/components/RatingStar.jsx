
const RatingStar = ({ rating, size = "w-4 h-4", count }) => {
    return (
        <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className={size}
                    fill={star <= Math.round(rating || 0) ? "#2563eb" : "none"}
                    stroke={star <= Math.round(rating || 0) ? "#2563eb" : "#c4c7d2"}
                    strokeWidth="1.5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                </svg>
            ))}
            <span className="text-xs text-gray-400 ml-1">
                ({count !== undefined ? count : (rating || 0).toFixed(1)})
            </span>
        </div>
    );
};

export default RatingStar;