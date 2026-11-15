/** Return a responsive Cloudinary URL sized for the rendered image. */
export const optimizedImageUrl = (src, width = 720) => {
  if (typeof src !== "string" || !src) return src;
  try {
    const url = new URL(src);
    if (url.hostname !== "res.cloudinary.com" || !url.pathname.includes("/image/upload/")) return src;

    // Cloudinary transformations belong immediately after /upload/. Keep
    // existing format/quality options while adding a pixel cap and auto crop.
    const marker = "/image/upload/";
    const [before, after] = url.pathname.split(marker);
    const transformations = `w_${width},c_limit,f_auto,q_auto`;
    url.pathname = `${before}${marker}${transformations}/${after}`;
    url.search = "";
    return url.toString();
  } catch {
    return src;
  }
};
