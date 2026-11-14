import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthShell from "@/features/account/components/AuthShell";
import Field from "@/features/account/components/Field";
import PasswordField from "@/features/account/components/PasswordField";
import GoogleButton, { OrDivider } from "@/features/account/components/GoogleButton";
import { PrimaryButton } from "@/features/account/components/FormButtons";
import { staggerContainer, staggerItem } from "@/features/account/components/formMotion";
import { emailPattern } from "@/features/account/validation";
import { authRequest, googleAuthRequest } from "@/features/account/authApi";
import { setCredentials } from "@/features/account/authSlice";
import { persistAuth } from "@/features/account/authStorage";
import { mergeGuestGarageSafely } from "@/features/garage/garageApi";

const LoginPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  };

  const goToDestination = (fallback) => {
    const destination = location.state?.from;
    navigate(
      destination?.pathname
        ? `${destination.pathname}${destination.search || ""}${destination.hash || ""}`
        : fallback,
      { replace: true },
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    const nextErrors = {};
    if (!emailPattern.test(values.email)) nextErrors.email = "Enter a valid email address";
    if (!values.password) nextErrors.password = "Enter your password";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus("");
    setIsSubmitting(true);
    try {
      const session = await authRequest("login", values);
      const token = session.token || session.accessToken;
      if (!session.user || !token) {
        throw new Error("The server did not return a user and access token.");
      }
      persistAuth(session.user, token);
      dispatch(setCredentials({ user: session.user, token }));
      await mergeGuestGarageSafely(token, dispatch);
      goToDestination("/profile");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credential) => {
    setStatus("");
    try {
      const session = await googleAuthRequest(credential);
      if (!session.user || !session.token) {
        throw new Error("The server did not return a user and access token.");
      }
      persistAuth(session.user, session.token);
      dispatch(setCredentials({ user: session.user, token: session.token }));
      await mergeGuestGarageSafely(session.token, dispatch);
      goToDestination("/profile");
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <AuthShell
      word="Welcome"
      eyebrow="Your driver account"
      headline={<>Good to have you <em className="not-italic text-[#f05a1a]">back.</em></>}
      title="Log in to your account"
      subtitle="Pick up where you left off and get back to the cars you love."
      footer={<>New to REVEX? <Link to="/signup" state={location.state} className="font-semibold text-[#f05a1a] hover:underline">Create an account</Link></>}
    >
      <AnimatePresence mode="wait">
        {status && (
          <motion.p
            key={status}
            role="status"
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-4 overflow-hidden border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white/70"
          >
            {status}
          </motion.p>
        )}
      </AnimatePresence>

      <GoogleButton onCredential={handleGoogleSuccess} onError={setStatus} />
      <OrDivider />
      <motion.form
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-5"
        aria-busy={isSubmitting}
      >
        <motion.div variants={staggerItem}>
          <Field
            id="email"
            name="email"
            type="email"
            label="Email address"
            icon={Mail}
            placeholder="you@example.com"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <PasswordField
            id="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
          />
        </motion.div>
        <motion.div variants={staggerItem} className="flex items-center justify-between gap-3 text-xs text-white/50">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="remember" className="size-3.5 accent-[#f05a1a]" /> Keep me logged in
          </label>
          <Link to="/forgot-password" className="font-medium text-white/70 hover:text-[#f05a1a]">Forgot password?</Link>
        </motion.div>
        <motion.div variants={staggerItem}>
          <PrimaryButton type="submit" loading={isSubmitting}>
            {isSubmitting ? "LOGGING IN" : "LOG IN"}
          </PrimaryButton>
        </motion.div>
      </motion.form>
    </AuthShell>
  );
};

export default LoginPage;