import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import VehicleImage from "@/components/shared/VehicleImage";
import { apiRequest } from "@/lib/api";
import { formatPrice } from "@/features/inventory/details/components/CarSummary";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeZone: "UTC" }).format(date);
};

const statusDot = {
  confirmed: "bg-emerald-500",
  pending: "bg-amber-500",
  cancelled: "bg-neutral-400",
};

const statusText = {
  confirmed: "text-emerald-700",
  pending: "text-amber-800",
  cancelled: "text-neutral-500",
};

// A boarding-pass style stub - keeps the one number that actually matters
// (what was paid) visually separated from the booking summary, instead of
// burying it in a spec sheet.
const Stub = ({ amount, currency, listingHref }) => (
  <div className="relative flex shrink-0 flex-col items-center justify-center gap-1.5 border-t border-dashed border-neutral-200 px-6 py-5 md:w-44 md:border-t-0 md:border-l md:py-6">
    <span
      aria-hidden="true"
      className="absolute top-0 left-0 hidden size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-50 md:block"
    />
    <span
      aria-hidden="true"
      className="absolute bottom-0 left-0 hidden size-5 -translate-x-1/2 translate-y-1/2 rounded-full bg-neutral-50 md:block"
    />
    <p className="text-[10px] font-semibold tracking-[0.16em] text-neutral-400 uppercase">Total paid</p>
    <p className="text-2xl font-semibold text-neutral-950">{formatPrice(amount)}</p>
    <p className="text-[11px] text-neutral-400">{currency}</p>
    {listingHref && (
      <Link
        to={listingHref}
        className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#f05a1a] hover:text-[#d94e14]"
      >
        View listing <ArrowRight className="size-3.5" />
      </Link>
    )}
  </div>
);

const BookingsPage = () => {
  const token = useSelector((state) => state.auth.token);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    apiRequest("/api/payments/bookings", { token, signal: controller.signal })
      .then(({ bookings: results = [] }) => setBookings(results))
      .catch((requestError) => {
        if (requestError.name !== "AbortError") setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [token]);

  return (
    <section className="min-h-[65vh] bg-neutral-50 px-4 pt-32 pb-20 md:px-12 md:pt-36">
      <div className="mx-auto max-w-[1100px]">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-neutral-500 uppercase">Your reservations</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 md:text-5xl">Booked cars</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
          A quick summary of every rental - dates, status and what you paid.
        </p>

        {loading && <p role="status" className="mt-8 text-sm text-neutral-500">Loading your bookings…</p>}
        {error && (
          <p role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Unable to load your bookings: {error}
          </p>
        )}
        {!loading && !error && bookings.length === 0 && (
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white px-6 py-14 text-center">
            <CalendarDays aria-hidden="true" className="mx-auto size-9 text-neutral-400" />
            <h2 className="mt-5 text-xl font-semibold text-neutral-900">No bookings yet</h2>
            <p className="mt-2 text-sm text-neutral-500">Once a rental payment is confirmed, its details will appear here.</p>
            <Link
              to="/inventory?listingType=rent"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-3 text-xs font-semibold text-white uppercase"
            >
              Browse rentals <ArrowRight className="size-4" />
            </Link>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="mt-8 space-y-4">
            {bookings.map((booking) => {
              const car = booking.car;
              const title = car ? `${car.year} ${car.make} ${car.model}` : "Vehicle details unavailable";
              const amount = Number(booking.amount_total || 0) / 100;
              const listingHref = car ? `/inventory/${encodeURIComponent(car.id ?? car._id)}` : null;

              return (
                <article
                  key={booking.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white md:flex-row"
                >
                  <div className="flex flex-1 gap-5 p-5 md:p-6">
                    <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:size-24">
                      <VehicleImage src={car?.image_url} alt={title} className="size-full object-contain p-2" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`flex items-center gap-1.5 text-xs font-semibold capitalize ${
                            statusText[booking.status] || statusText.pending
                          }`}
                        >
                          <span className={`size-1.5 rounded-full ${statusDot[booking.status] || statusDot.pending}`} />
                          {booking.status}
                        </span>
                        <span className="text-xs text-neutral-300">·</span>
                        <span className="truncate font-mono text-[11px] text-neutral-400">{booking.id}</span>
                      </div>

                      <h2 className="mt-1.5 truncate text-lg font-semibold text-neutral-950">{title}</h2>

                      {car?.details?.dealer?.city && (
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
                          <MapPin className="size-3.5" /> {car.details.dealer.city}
                        </p>
                      )}

                      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                        <div>
                          <dt className="text-[10px] tracking-wide text-neutral-400 uppercase">Pickup</dt>
                          <dd className="mt-0.5 font-medium text-neutral-900">{formatDate(booking.start_date)}</dd>
                        </div>
                        <div>
                          <dt className="text-[10px] tracking-wide text-neutral-400 uppercase">Return</dt>
                          <dd className="mt-0.5 font-medium text-neutral-900">{formatDate(booking.end_date)}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <Stub amount={amount} currency={(booking.currency || "usd").toUpperCase()} listingHref={listingHref} />
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default BookingsPage;