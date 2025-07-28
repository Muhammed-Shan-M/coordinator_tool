import React, { useState } from "react";

interface PerformancePopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (rating: number) => void;
}

const PerformancePopup: React.FC<PerformancePopupProps> = ({ isOpen, onClose, onSelect }) => {
    const [hovered, setHovered] = useState<number | null>(null);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50">
            <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-xl border border-[#333333] w-[320px] text-center">
                <h2 className="text-gray-100 text-lg font-semibold mb-4">
                    How do you rate the performance?
                </h2>

                <div className="flex justify-center gap-4 mb-4">
                    {[1, 2, 3].map((star) => (
                        <button
                            key={star}
                            onClick={() => {
                                onSelect(star);
                                setHovered(null);
                                onClose();
                            }}
                            onMouseEnter={() => setHovered(star)}
                            onMouseLeave={() => setHovered(null)}
                            className={`text-3xl transition-transform transform hover:scale-110 ${hovered !== null && star <= hovered
                                    ? "text-yellow-400"
                                    : "text-gray-600"
                                }`}
                        >
                            ★
                        </button>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="text-sm text-gray-400 hover:text-white"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default PerformancePopup;
