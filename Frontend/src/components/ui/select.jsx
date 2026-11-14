import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = ({ className, children, ...props }) => (
  <SelectPrimitive.Trigger
    data-slot="select-trigger"
    className={cn("flex h-9 w-full items-center justify-between gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none focus-visible:border-[#f05a1a] focus-visible:ring-2 focus-visible:ring-[#f05a1a]/30 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className)}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild><ChevronDown aria-hidden="true" className="size-4 shrink-0 opacity-60" /></SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
);

const SelectScrollUpButton = ({ className, ...props }) => (
  <SelectPrimitive.ScrollUpButton className={cn("flex cursor-default items-center justify-center py-1", className)} {...props}>
    <ChevronUp aria-hidden="true" className="size-4" />
  </SelectPrimitive.ScrollUpButton>
);

const SelectScrollDownButton = ({ className, ...props }) => (
  <SelectPrimitive.ScrollDownButton className={cn("flex cursor-default items-center justify-center py-1", className)} {...props}>
    <ChevronDown aria-hidden="true" className="size-4" />
  </SelectPrimitive.ScrollDownButton>
);

const SelectContent = ({ className, children, position = "popper", search, ...props }) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      data-slot="select-content"
      position={position}
    className={cn("relative z-50 max-h-96 min-w-32 overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900 text-white shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className)}
      {...props}
    >
      <SelectScrollUpButton />
      {search && <div className="border-b border-white/10 px-2 pb-2" onKeyDown={(event) => event.stopPropagation()}>{search}</div>}
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);

const SelectLabel = ({ className, ...props }) => (
  <SelectPrimitive.Label className={cn("px-2 py-1.5 text-xs font-semibold text-white/55", className)} {...props} />
);

const SelectItem = ({ className, children, ...props }) => (
  <SelectPrimitive.Item
    data-slot="select-item"
    className={cn("relative flex w-full cursor-default select-none items-center rounded-lg py-2 pl-3 pr-8 text-sm text-white outline-none data-[highlighted]:bg-[#f05a1a]/10 data-[highlighted]:text-[#f05a1a] data-[state=checked]:text-[#f05a1a] data-[disabled]:pointer-events-none data-[disabled]:opacity-40", className)}
    {...props}
  >
    <span className="absolute right-2 flex size-4 items-center justify-center text-[#f05a1a]"><SelectPrimitive.ItemIndicator><Check aria-hidden="true" className="size-4" /></SelectPrimitive.ItemIndicator></span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
);

const SelectSeparator = ({ className, ...props }) => (
  <SelectPrimitive.Separator className={cn("-mx-1 my-1 h-px bg-white/10", className)} {...props} />
);

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
