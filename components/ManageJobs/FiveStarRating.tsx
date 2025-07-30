"use client";

import { Dispatch, SetStateAction } from "react";
import { IoIosStarOutline, IoIosStar } from "react-icons/io";

interface FiveStarRatingProps {
  rating: number;
  setRating: Dispatch<SetStateAction<number>>;
  hover: number;
  setHover: Dispatch<SetStateAction<number>>;
  onRatingChange?: (rating: number) => void;
}

const FiveStarRating: React.FC<FiveStarRatingProps> = ({
  rating,
  setRating,
  hover,
  setHover,
  onRatingChange,
}) => {
  const handleRating = (rate: number) => {
    setRating(rate);
    if (onRatingChange) onRatingChange(rate);
  };

  return (
    <div className="flex space-x-1">
      {Array.from({ length: 5 }, (_, index) => {
        const starIndex = index + 1;

        return (
          <button
            key={starIndex}
            onClick={() => handleRating(starIndex)}
            onMouseEnter={() => setHover(starIndex)}
            onMouseLeave={() => setHover(0)}
            className="cursor-pointer"
          >
            {starIndex <= (hover || rating) ? (
              <IoIosStar size={32} color="#FAB427" />
            ) : (
              <IoIosStarOutline size={32} color="#FAB427" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default FiveStarRating;