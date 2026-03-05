import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginSuccessful } from "../../features/auth/authSlice";
import axiosInstance from "../../utils/axios";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import { toast } from "sonner";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function LoginPage() {
  useDocumentTitle("Sign In")
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/user/login", form);
      const { user, accessToken} = res.data;
      console.log("the acc token when login : ", accessToken);
      
      dispatch(loginSuccessful({ user, accessToken}));
      navigate("/user/home");
    } catch (err) {
      toast.error( err.response?.data?.message);
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <AuthLayout title="Welcome Back!" subtitle="Sign In">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm mb-1 font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 shadow"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/user/register"
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Sign up here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}












