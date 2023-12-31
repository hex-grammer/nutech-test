import React from "react";
import { FiSearch } from "react-icons/fi";

interface SearchInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSearch,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        className="h-10 w-full rounded-md border bg-gray-50 pl-10 pr-4 shadow-sm focus:border-blue-500 focus:outline-none sm:w-52"
        placeholder="Search..."
        onKeyDown={handleKeyDown}
        onChange={onChange}
      />
      <div
        className="absolute inset-y-0 left-0 flex cursor-pointer items-center pl-3"
        onClick={onSearch}
      >
        <FiSearch className="text-gray-400 hover:text-blue-600" />
      </div>
    </div>
  );
};

export default SearchInput;
