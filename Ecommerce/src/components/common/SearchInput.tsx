import { ChangeEvent } from "react";
import { MdOutlineSearch } from "react-icons/md";

interface SearchInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

function SearchInput({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
  className = "",
}: SearchInputProps) {
  return (
    <div className={`relative flex-1 ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MdOutlineSearch
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark"
        />
      </div>
      <input
        onChange={onChange}
        value={value}
        className="block w-full rounded-lg border-0 bg-[#e7f3ea] dark:bg-gray-800 py-3 pl-10 text-text-main dark:text-white placeholder:text-text-secondary focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
        placeholder={placeholder}
        type="text"
      />
    </div>
  );
}

export default SearchInput;
