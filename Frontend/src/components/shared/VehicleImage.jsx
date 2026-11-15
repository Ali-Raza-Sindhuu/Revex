import { useState } from "react";
import { Car } from "lucide-react";
import { optimizedImageUrl } from "@/lib/imageUrl";

const VehicleImage = ({ src, alt, className = "", fallbackClassName = "", ...props }) => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <div role="img" aria-label={alt ? `${alt} — image unavailable` : "Vehicle image unavailable"} className={`flex size-full flex-col items-center justify-center gap-2 bg-neutral-100 text-neutral-400 ${fallbackClassName}`}><Car aria-hidden="true" className="size-8" strokeWidth={1.5} /><span className="text-center text-[11px]">Image coming soon</span></div>;
  }
  const { width = 720, ...imageProps } = props;
  return <img src={optimizedImageUrl(src, width)} alt={alt} className={className} loading="lazy" decoding="async" onError={() => setFailed(true)} {...imageProps} />;
};
export default VehicleImage;
