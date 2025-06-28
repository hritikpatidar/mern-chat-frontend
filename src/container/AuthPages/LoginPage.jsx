import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import { LoginFormValidation } from "../../Utils/validation";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { setLanguage } from "../../Redux/features/Language/languageSlice";
import toast from "react-hot-toast";
import { loginFormData, profileDetails } from "../../Redux/features/adminAuth/authSlice";
import { setItemLocalStorage } from "../../Utils/browserServices";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const [loginFormDetails, setLoginFormDetails] = useState({
    email: "",
    password: "",
  });

  const [errorMessages, setErrorMessages] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const toggleShowPassword = (e) => {
    setShowPassword((prevState) => !prevState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { [name]: value };

    setLoginFormDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    const { errors } = LoginFormValidation(newData, t);
    setErrorMessages({
      ...errorMessages,
      ...errors,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { errors, isValid } = LoginFormValidation(loginFormDetails, t);
    setErrorMessages({
      ...errorMessages,
      ...errors,
    });
    if (!isValid) return;
    setLoading(true);
    try {
      const response = await dispatch(loginFormData(loginFormDetails));
      if (response?.payload?.status === true) {
        const decodedToken = jwtDecode(response?.payload?.token);
        setItemLocalStorage("userRole", "User");
        toast.success(response?.payload?.message);
        setItemLocalStorage("token", response?.payload?.token);
        await dispatch(profileDetails());
        navigate("/");
      } else {
        toast.error(
          response.payload?.message || "Email or Password Does Not Exist"
        );
        // setItemLocalStorage("token","nasidbclkzkjdnadsscknc");
        // navigate("/"); 
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 font-sans px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-md border border-gray-300">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Welcome Back 👋</h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4 relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={loginFormDetails?.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={loginFormDetails?.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 rounded-md transition duration-200"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center justify-between text-sm text-gray-500">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/sign-up")}
            className="text-gray-700 font-semibold hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
