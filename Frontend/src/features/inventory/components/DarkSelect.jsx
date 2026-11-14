import { useState } from "react";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EMPTY_VALUE = "__empty__";

const DarkSelect = ({ id, value = "", onChange, placeholder, options = [], disabled = false, variant = "dark", searchable = false, searchPlaceholder = "Search options…", className = "" }) => {
  const [query, setQuery] = useState("");
  const filteredOptions = options.filter((option) => String(option.label).toLowerCase().includes(query.trim().toLowerCase()));
  const searchBox = searchable && (
    <label className="relative mt-2 block">
      <Search aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-white/45" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => event.stopPropagation()}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        className="h-9 w-full rounded-lg border border-white/10 bg-white/5 pl-8 pr-3 text-xs text-white placeholder:text-white/45 outline-none focus:border-[#f05a1a]"
      />
    </label>
  );

  return (
    <Select
      value={value === "" || value === undefined || value === null ? EMPTY_VALUE : String(value)}
      onValueChange={(nextValue) => {
        setQuery("");
        onChange?.(nextValue === EMPTY_VALUE ? "" : nextValue);
      }}
      onOpenChange={(open) => { if (!open) setQuery(""); }}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        className={`${variant === "dark" ? "h-10 rounded-none border-0 border-b border-white/25 bg-transparent px-0 text-xs text-white shadow-none hover:bg-transparent focus:border-[#f05a1a] focus-visible:border-[#f05a1a] focus-visible:ring-0" : "h-9 rounded-lg border-neutral-200 bg-white px-3 text-xs text-neutral-900 hover:bg-neutral-50 focus-visible:border-[#f05a1a]"} w-full disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent align="start" search={searchBox} className="w-[var(--radix-select-trigger-width)] border-white/10 bg-neutral-900">
        {placeholder && <SelectItem value={EMPTY_VALUE} className="text-white/60 data-[highlighted]:bg-[#f05a1a]/10 data-[highlighted]:text-[#f05a1a] data-[state=checked]:text-[#f05a1a]">{placeholder}</SelectItem>}
        {filteredOptions.map((option) => (
          <SelectItem key={option.value} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
        {searchable && filteredOptions.length === 0 && <div role="status" className="px-3 py-2 text-xs text-white/50">No options found</div>}
      </SelectContent>
    </Select>
  );
};

export default DarkSelect;
