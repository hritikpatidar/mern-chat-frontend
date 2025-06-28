import { useRef, useState } from 'react';
import { Mail, Lock, User, Calendar, UserCheck, EyeOff, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SignupForm = ({ handleSubmit, loading }) => {
    const navigate = useNavigate()
    const dobRef = useRef(null);
    const [formDetails, setFormDetails] = useState({
        name: "",
        user_name: "",
        email: "",
        phone_no: "",
        dob: "",
        gender: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    const openPicker = () => {
        if (dobRef.current && dobRef.current.showPicker) {
            dobRef.current.showPicker();
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        const newData = { [name]: value }

        setFormDetails(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 font-sans px-4">
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-md border border-gray-300">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    Create Account 👤
                </h2>

                <form onSubmit={handleSubmit} autoComplete="off">
                    {/* Full Name */}
                    <div className="mb-4 relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Full Name"
                            name="name"
                            value={formDetails?.name}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>

                    {/* Username */}
                    <div className="mb-4 relative">
                        <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="User_name"
                            name="user_name"
                            value={formDetails?.user_name}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-4 relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={formDetails?.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="mb-4 relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            name="phone_no"
                            value={formDetails?.phone_no}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>

                    {/* Date of Birth */}
                    <div className="mb-4 relative" onClick={openPicker}>
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            ref={dobRef}
                            type="date"
                            name="dob"
                            value={formDetails.dob}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
                        />
                    </div>

                    {/* Gender */}
                    <div className="mb-4 relative">
                        <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            name="gender"
                            value={formDetails?.gender}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Password */}
                    <div className="mb-6 relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            name="password"
                            value={formDetails?.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 rounded-md transition duration-200"
                        disabled={loading}
                    >
                        {loading ? "Signing up..." : "Sign Up"}
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
                    Already have an account?{" "}
                    <button
                        onClick={() => navigate("/login")}
                        className="text-gray-700 font-semibold hover:underline"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}
