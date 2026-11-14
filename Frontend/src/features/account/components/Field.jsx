const Field = ({ id, label, icon: Icon, error, endAdornment, ...inputProps }) => (
  <div>
    <label htmlFor={id} className="mb-2 block text-[11px] font-semibold tracking-[0.15em] text-white/40 uppercase">
      {label}
    </label>
    <div
      className={`group flex items-center gap-3 border-b bg-transparent pb-2.5 transition focus-within:border-[#f05a1a] ${
        error ? "border-red-400/70" : "border-white/15"
      }`}
    >
      {Icon && (
        <Icon className="size-4 shrink-0 text-white/30 transition-colors group-focus-within:text-[#f05a1a]" />
      )}
      <input
        id={id}
        aria-invalid={Boolean(error)}
        className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25"
        {...inputProps}
      />
      {endAdornment}
    </div>
    {error && <p className="mt-1.5 text-[11px] text-red-400">{error}</p>}
  </div>
);

export default Field;