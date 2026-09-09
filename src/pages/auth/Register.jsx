import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "buyer",
  });

  const [showPassword, setShowPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setSubmitting(true);

    try {
      const { confirmPassword, ...payload } = formData;

      await register(payload);

      setSuccess("Account created successfully. You can now log in.");
      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create your account."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-5 py-12 sm:px-8">
        <div className="grid w-full overflow-hidden rounded-xl bg-white shadow-xl lg:grid-cols-2">
          <div className="hidden bg-primary p-12 lg:flex lg:flex-col lg:justify-between">
            <Link
              to="/"
              className="font-heading text-2xl font-bold text-white"
            >
              Nestora
            </Link>

            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Join Nestora
              </p>

              <h1 className="mt-4 font-heading text-5xl font-bold leading-tight text-white">
                Find your place. Build your future.
              </h1>

              <p className="mt-5 max-w-md font-body leading-7 text-white/60">
                Create an account and become part of a
                smarter way to discover and manage property.
              </p>
            </div>

            <p className="font-body text-xs text-white/30">
              © {new Date().getFullYear()} Nestora
            </p>
          </div>

          <div className="p-6 sm:p-10 lg:p-12">
            <div className="lg:hidden">
              <Link
                to="/"
                className="font-heading text-2xl font-bold text-primary"
              >
                Nestora
              </Link>
            </div>

            <div className="mt-8 lg:mt-0">
              <Link
                to="/"
                className="mb-6 inline-flex items-center font-body text-sm font-semibold text-primary/60 hover:text-accent"
              >
                Back to Home
              </Link>

              <h2 className="font-heading text-4xl font-bold text-primary">
                Create your account
              </h2>

              <p className="mt-3 font-body text-sm text-primary/50">
                Choose how you want to use Nestora.
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 font-body text-sm text-green-700">
                {success}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="font-body text-sm font-semibold text-primary">
                    First Name
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-lg border border-primary/10 px-4 py-3 font-body text-sm outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="font-body text-sm font-semibold text-primary">
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-lg border border-primary/10 px-4 py-3 font-body text-sm outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="font-body text-sm font-semibold text-primary">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-primary/10 px-4 py-3 font-body text-sm outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="font-body text-sm font-semibold text-primary">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 08123456789"
                  className="mt-2 w-full rounded-lg border border-primary/10 px-4 py-3 font-body text-sm outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="font-body text-sm font-semibold text-primary">
                  Password
                </label>

                <div className="relative mt-2">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full rounded-lg border border-primary/10 px-4 py-3 pr-12 font-body text-sm outline-none focus:border-accent"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-body text-sm font-semibold text-primary">
                  Confirm Password
                </label>

                <div className="relative mt-2">
                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full rounded-lg border border-primary/10 px-4 py-3 pr-12 font-body text-sm outline-none focus:border-accent"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-body text-sm font-semibold text-primary">
                  I want to
                </label>

                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        role: "buyer",
                      }))
                    }
                    className={`rounded-lg border px-4 py-3 font-body text-sm font-semibold transition ${
                      formData.role === "buyer"
                        ? "border-primary bg-primary text-white"
                        : "border-primary/10 text-primary/60"
                    }`}
                  >
                    Find Property
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        role: "owner",
                      }))
                    }
                    className={`rounded-lg border px-4 py-3 font-body text-sm font-semibold transition ${
                      formData.role === "owner"
                        ? "border-primary bg-primary text-white"
                        : "border-primary/10 text-primary/60"
                    }`}
                  >
                    List Property
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3.5 font-body text-sm font-semibold text-white disabled:opacity-60"
              >
                {submitting
                  ? "Creating account..."
                  : "Create Account"}

                {!submitting && (
                  <ArrowRight size={17} />
                )}
              </button>
            </form>

            <p className="mt-7 text-center font-body text-sm text-primary/50">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:text-accent"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
