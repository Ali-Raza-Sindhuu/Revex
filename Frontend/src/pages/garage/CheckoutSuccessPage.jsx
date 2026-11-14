import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/api";

const CheckoutSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("confirming");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setMessage("The Stripe checkout session is missing. If you completed payment, contact support and share your checkout reference.");
      return undefined;
    }
    const controller = new AbortController();
    let active = true;
    let timeout;
    const deadline = Date.now() + 30000;
    const poll = async () => {
      try {
        const result = await apiRequest(`/api/payments/session/${encodeURIComponent(sessionId)}`, { signal: controller.signal });
        if (!active) return;
        if (result.status === "confirmed") { setStatus("received"); return; }
        if (result.status === "expired" || result.status === "refund_pending") { setStatus("error"); setMessage(result.status === "expired" ? "This checkout session expired before payment completed. No booking was made." : "The dates became unavailable while payment was processing. A refund has been initiated."); return; }
        if (Date.now() >= deadline) { setStatus("timeout"); return; }
        timeout = window.setTimeout(poll, 1800);
      } catch (error) {
        if (!active || error.name === "AbortError") return;
        // Stripe can redirect back before the API has finished starting up or
        // while the webhook is still being delivered. Retry temporary fetch
        // failures within the same verification window.
        if (Date.now() < deadline && (error.name === "TypeError" || error.status >= 500)) {
          timeout = window.setTimeout(poll, 1800);
          return;
        }
        setStatus("error");
        setMessage(`We could not verify the payment status: ${error.message}`);
      }
    };
    poll();
    return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
  }, [sessionId]);

  return (
    <section className="min-h-[65vh] bg-neutral-50 px-4 pb-20 pt-32 md:px-12 md:pt-36">
      <div className="mx-auto max-w-[680px] rounded-2xl border border-neutral-200 bg-white p-7 text-center md:p-10">
        {status === "received" ? <CheckCircle2 aria-hidden="true" className="mx-auto size-10 text-[#f05a1a]" /> : status === "error" ? <p aria-hidden="true" className="mx-auto size-10 rounded-full border border-red-200 bg-red-50" /> : <p aria-hidden="true" className="mx-auto size-10 rounded-full border-2 border-neutral-200 border-t-[#f05a1a] motion-safe:animate-spin" />}
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-neutral-950">{status === "received" ? "Rental confirmed" : status === "error" ? "Payment needs attention" : "Confirming your rental"}</h1>
        {status === "received" && <p role="status" className="mt-4 text-sm leading-relaxed text-neutral-600">Your Stripe payment was verified and your booking is confirmed.</p>}
        {status === "error" && <p role="alert" className="mt-4 text-sm text-red-700">{message}</p>}
        {status === "timeout" && <p role="status" className="mt-4 text-sm text-neutral-600">Your payment is still processing. Verify its status before trying again, or contact support with your checkout session.</p>}
        {(status === "error" || status === "timeout" || status === "received") && <Link to="/cart" className="mt-6 inline-flex rounded-lg bg-neutral-900 px-5 py-3 text-xs font-semibold uppercase text-white">Return to Garage</Link>}
      </div>
    </section>
  );
};

export default CheckoutSuccessPage;
