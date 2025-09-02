import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Name required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Valid email required";
    if (!form.password || form.password.length < 6)
      newErrors.password = "Password must be 6+ characters";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords must match";
    if (!form.agreeToTerms) newErrors.agreeToTerms = "Must agree to terms";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    
    try {
      // Call your backend register endpoint
      const response = await axios.post("/api/auth/register", {
        username: form.fullName,
        email: form.email,
        password: form.password
      });

      if (response.data.success) {
        // Store the token in localStorage
        localStorage.setItem("token", response.data.token);
        
        // Redirect to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      // Handle different types of errors
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: "Registration failed. Please try again." });
      }
    }
    setLoading(false);
  };

  const InputField = ({
    label,
    name,
    type = "text",
    placeholder,
    className = "",
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
          errors[name] ? "border-red-300" : "border-gray-300"
        } ${className}`}
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600">Start your fitness journey</p>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800 text-sm">
              {errors.submit}
            </div>
          )}

          <div className="space-y-4" onSubmit={handleSubmit}>
            <InputField
              label="Full Name"
              name="fullName"
              placeholder="Enter your full name"
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Create a password"
            />

            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
            />

            {/* Terms */}
            <div>
              <label className="flex items-start">
                <input
                  name="agreeToTerms"
                  type="checkbox"
                  checked={form.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 rounded mt-1"
                />
                <span className="ml-3 text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-500">
                    Terms & Privacy Policy
                  </a>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.agreeToTerms}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
