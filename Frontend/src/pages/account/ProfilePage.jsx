import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Heart, Car, Power, ShieldCheck, TriangleAlert, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearCredentials } from "@/features/account/authSlice";
import { clearPersistedAuth } from "@/features/account/authStorage";
import { authRequest } from "@/features/account/authApi";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  const displayName = user.name || user.fullName || "Driver";
  const plate = displayName.replace(/\s+/g, "").slice(0, 7).toUpperCase();
  const isVerified = Boolean(user.emailVerifiedAt);

  useEffect(() => {
    document.title = "Profile | REVEX";
  }, []);

  const handleLogout = () => {
    clearPersistedAuth();
    dispatch(clearCredentials());
    navigate("/", { replace: true });
  };

  const handleResendVerification = async () => {
    setIsSendingVerification(true);
    setVerificationStatus("");
    try {
      const response = await authRequest("resend-verification", {}, token);
      setVerificationStatus(response.message);
    } catch (error) {
      setVerificationStatus(error.message || "Unable to resend the verification email. Please try again.");
    } finally {
      setIsSendingVerification(false);
    }
  };

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-neutral-950 px-4 pb-20 pt-32 md:pt-36">
      <style>{`
        @keyframes revex-road { from { background-position: 0 0; } to { background-position: 0 120px; } }
        @keyframes revex-shine { from { transform: translateX(-120%) skewX(-20deg); } to { transform: translateX(260%) skewX(-20deg); } }
        @keyframes revex-blink { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
      `}</style>

      {/* Headlight glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70%] bg-[radial-gradient(30%_45%_at_30%_0%,rgba(240,90,26,0.16),transparent_70%),radial-gradient(30%_45%_at_70%_0%,rgba(240,90,26,0.16),transparent_70%)]"
      />

      {/* Night road with moving lane dashes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55%] overflow-hidden [perspective:500px]">
        <div className="absolute inset-x-[-40%] bottom-[-10%] top-0 origin-bottom [transform:rotateX(62deg)] bg-gradient-to-t from-neutral-900 to-transparent">
          <div
            className="absolute left-1/2 top-0 h-full w-3 -translate-x-1/2 [background-image:linear-gradient(to_bottom,rgba(255,255,255,0.85)_0_60px,transparent_60px_120px)] [background-size:100%_120px]"
            style={{ animation: "revex-road 1.2s linear infinite" }}
          />
          <div className="absolute inset-y-0 left-[18%] w-1 bg-[#f05a1a]/60" />
          <div className="absolute inset-y-0 right-[18%] w-1 bg-[#f05a1a]/60" />
        </div>
      </div>

      <div className="mx-auto flex max-w-md flex-col items-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/50">
          REVEX Driver Club
        </p>

        {/* Membership card */}
        <div className="group relative mt-6 w-full overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-neutral-800 via-neutral-950 to-black p-6 shadow-[0_30px_80px_-20px_rgba(240,90,26,0.45)] transition duration-500 hover:-translate-y-1 hover:rotate-[-1deg]">
          {/* tire-tread texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(135deg,#fff_0_2px,transparent_2px_12px)]"
          />
          {/* orange speed streak */}
          <div aria-hidden="true" className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#f05a1a]/40 blur-3xl" />
          {/* holographic shine */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100"
            style={{ animation: "revex-shine 1.4s ease-in-out infinite" }}
          />

          <div className="relative flex items-start justify-between">
            <span className="text-xl font-black italic tracking-tighter text-white">
              REV<span className="text-[#f05a1a]">EX</span>
            </span>
            {isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified
              </span>
            )}
          </div>

          {/* chip */}
          <div aria-hidden="true" className="relative mt-8 h-9 w-12 rounded-md bg-gradient-to-br from-[#f05a1a] to-[#d94e14] shadow-inner">
            <div className="absolute inset-x-0 top-1/2 h-px bg-black/30" />
            <div className="absolute inset-y-0 left-1/3 w-px bg-black/30" />
            <div className="absolute inset-y-0 right-1/3 w-px bg-black/30" />
          </div>

          <h1 className="relative mt-6 text-3xl font-semibold tracking-tight text-white">
            {displayName}
          </h1>
          <p className="relative mt-1 text-sm text-white/55">{user.email}</p>

          {/* License plate */}
          <div className="relative mt-8 flex items-end justify-between">
            <div className="rounded-md border-2 border-[#f05a1a] bg-neutral-100 px-3 py-1 shadow-lg">
              <span className="font-mono text-lg font-black tracking-[0.25em] text-neutral-900">
                {plate}
              </span>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
              Member
            </span>
          </div>
        </div>

        {/* Check engine light */}
        {!isVerified && (
          <div className="mt-5 w-full rounded-2xl border border-[#f05a1a]/30 bg-[#f05a1a]/10 p-4 backdrop-blur">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#f05a1a]">
              <TriangleAlert className="h-4 w-4" style={{ animation: "revex-blink 1.4s ease-in-out infinite" }} />
              Check engine · Email not verified
            </p>
            <Button
              type="button"
              disabled={isSendingVerification}
              onClick={handleResendVerification}
              className="mt-3 h-9 rounded-lg bg-[#f05a1a] px-4 text-xs font-semibold text-white hover:bg-[#d94e14]"
            >
              {isSendingVerification ? "Sending…" : "Resend verification email"}
            </Button>
            {verificationStatus && (
              <p role="status" className="mt-3 text-xs text-white/80">
                {verificationStatus}
              </p>
            )}
          </div>
        )}

        {/* Quick links */}
        <nav aria-label="Your REVEX links" className="mt-5 grid w-full grid-cols-2 gap-4">
          <Link
            to="/saved"
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-[#f05a1a]/60 hover:bg-white/10"
          >
            <Heart className="h-6 w-6 text-[#f05a1a] transition group-hover:scale-110" />
            <p className="mt-6 text-sm font-semibold text-white">Saved cars</p>
            <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-white/30 transition group-hover:text-white" />
          </Link>
          <Link
            to="/cart"
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-[#f05a1a]/60 hover:bg-white/10"
          >
            <Car className="h-6 w-6 text-[#f05a1a] transition group-hover:translate-x-1" />
            <p className="mt-6 text-sm font-semibold text-white">Garage</p>
            <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-white/30 transition group-hover:text-white" />
          </Link>
        </nav>

        {/* Engine off */}
        <Button
          type="button"
          onClick={handleLogout}
          className="mt-6 flex h-11 items-center gap-2 rounded-full border border-white/15 bg-transparent px-6 text-xs font-semibold uppercase tracking-widest text-white/80 hover:border-[#f05a1a] hover:bg-[#f05a1a] hover:text-white"
        >
          <Power className="h-4 w-4" />
          Engine off
        </Button>
      </div>
    </section>
  );
};

export default ProfilePage;
