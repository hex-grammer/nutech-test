import React from "react";

const CardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse rounded-lg bg-white shadow-md">
      <div className="relative h-40 w-full overflow-hidden rounded-t-lg bg-gray-300"></div>
      <div className="p-4 pt-2">
        <div className="mb-4 h-6 w-2/3 rounded-full bg-gray-300"></div>
        <div className="mb-2 h-6 w-1/2 rounded-full bg-gray-300"></div>
        <div className="mb-2 h-6 w-2/3  rounded-full bg-gray-300"></div>
        <div className="mb-2 h-6 w-1/3  rounded-full bg-gray-300"></div>
        <div className="mt-4 flex justify-end space-x-2">
          <div className="h-10 w-16 rounded-md bg-gray-300"></div>
          <div className="h-10 w-16 rounded-md bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
