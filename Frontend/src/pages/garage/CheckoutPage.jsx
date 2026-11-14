import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { formatPrice } from "@/features/inventory/details/components/CarSummary";

const rentalDays = (start, end) => Math.floor((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000) + 1;

const CheckoutPage = () => {
  const token = useSelector((state) => state.auth.token);
  const [searchParams] = useSearchParams();
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    apiRequest("/api/cart", { token, signal: controller.signal }).then(({ cart: serverCart }) => {
      setCart(serverCart);
    }).catch((requestError) => {
      if (requestError.name !== "AbortError") setError(requestError.message);
    });
    return () => controller.abort();
  }, [token]);

  const rentals = cart?.items?.filter((item) => item.listing_type === "rent") ?? [];
  const purchaseCount = cart?.items?.filter((item) => item.listing_type === "buy").length ?? 0;
  const total = rentals.reduce((sum, item) => sum + Number(item.car.price) * rentalDays(item.start_date, item.end_date), 0);

  const startPayment = async () => {
    setPaying(true);
    setError("");
    try {
      const { url } = await apiRequest("/api/payments/checkout-session", { method: "POST", token, body: {} });
      if (!url) throw new Error("Stripe did not return a checkout link. Please try again.");
      window.location.assign(url);
    } catch (paymentError) {
      setError(paymentError.message);
      setPaying(false);
    }
  };

  return (
    <section className="min-h-[65vh] bg-neutral-50 px-4 pb-20 pt-32 md:px-12 md:pt-36">
      <div className="mx-auto max-w-[850px]">
        <Link to="/cart" className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 hover:text-[#f05a1a]"><ArrowLeft className="size-4" />Back to Garage</Link>
        <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">Secure rental checkout</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 md:text-5xl">Review and pay</h1>
        {searchParams.has("cancelled") && <p role="status" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Checkout was cancelled. Your rental dates are still in your garage; no payment was taken.</p>}
        {error && <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!cart && !error && <p role="status" className="mt-6 text-sm text-neutral-500">Loading your garage…</p>}
        {cart && (
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 md:p-7">
            <h2 className="text-lg font-semibold text-neutral-900">Your rental plan</h2>
            {!rentals.length ? (
              <p className="mt-4 text-sm text-neutral-500">{purchaseCount ? "Your Garage has purchase cars saved as a shortlist; there are no rentals to pay for yet." : "Your garage is empty."} <Link to="/inventory?listingType=rent" className="font-semibold text-[#f05a1a]">Browse rental cars</Link></p>
            ) : (
              <ul className="mt-5 divide-y divide-neutral-200">
                {rentals.map((item) => {
                  const days = rentalDays(item.start_date, item.end_date);
                  return <li key={item.id} className="flex items-start justify-between gap-4 py-4 text-sm"><div><p className="font-medium text-neutral-900">{item.car.year} {item.car.make} {item.car.model}</p><p className="mt-1 text-xs text-neutral-500">{item.start_date} – {item.end_date} · {days} day{days === 1 ? "" : "s"}</p></div><p className="shrink-0 font-medium text-neutral-900">{formatPrice(Number(item.car.price) * days)}</p></li>;
                })}
              </ul>
            )}
            {purchaseCount > 0 && <p className="mt-4 rounded-lg bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-600">Your {purchaseCount} purchase car{purchaseCount === 1 ? " stays" : "s stay"} saved in the Garage. Only rentals are included in this payment.</p>}
            <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-sm font-semibold text-neutral-900"><span>Estimated total</span><span>{formatPrice(total)}</span></div>
            <p className="mt-3 text-xs leading-relaxed text-neutral-500">Rental rates are charged in USD. Taxes, deposits and optional extras are not included in this estimate. Your dates are held for up to 35 minutes during checkout.</p>
            <button type="button" disabled={!rentals.length || paying} onClick={startPayment} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#f05a1a] px-5 text-xs font-semibold text-white transition hover:bg-[#d94e14] disabled:cursor-not-allowed disabled:opacity-50">{paying ? "Opening secure checkout…" : <>Pay securely with Stripe <ArrowRight className="size-4" /></>}</button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-neutral-500"><LockKeyhole className="size-3" />Payment details are entered securely on Stripe.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CheckoutPage;
