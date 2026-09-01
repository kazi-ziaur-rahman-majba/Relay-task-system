import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaUser } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  //   async function handleSubmit(e: React.FormEvent) {
  //     e.preventDefault();
  //     const res = await fetch("/api/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //     });
  // 
  //     if (res.ok) {
  //       navigate(callbackUrl);
  //     } else {
  //       alert("Invalid credentials");
  //     }
  //   }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF5EC] via-[#fff] to-[#fe9f43]/10 p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 relative overflow-hidden border border-[var(--color-primary-light)]">

        <div className="absolute -top-20 -right-20 w-56 h-56 bg-[var(--color-primary)] rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-[var(--color-secondary)] rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-24 h-24 bg-[var(--color-primary-light)] rounded-full opacity-30 blur-xl"></div>


        <div className="flex justify-center mb-4">
          <div className="bg-[var(--color-primary)] bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
            <FaUser size={26} className="text-white" />
          </div>
        </div>

        <p className="text-3xl font-extrabold mb-1 text-center tracking-tight drop-shadow-sm">
          Welcome Back, Admin!
        </p>
        <p className="text-gray-600 text-center mb-8 text-base">
          Enter your credentials to continue.
        </p>

        <form className="flex flex-col gap-6">
          {/* Email */}
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              autoComplete="email"
              className="peer w-full border border-gray-300 p-4 rounded-xl bg-white/80
                focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
                transition placeholder-transparent text-gray-800 font-medium shadow-sm"
            />
            <label
              htmlFor="email"
              className="pointer-events-none absolute left-4 -top-2 text-xs text-gray-500
                bg-white px-1 transition-all
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[var(--color-primary)]"
            >
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              autoComplete="current-password"
              className="peer w-full border border-gray-300 p-4 rounded-xl bg-white/80
                focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
                transition placeholder-transparent text-gray-800 font-medium shadow-sm"
            />
            <label
              htmlFor="password"
              className="pointer-events-none absolute left-4 -top-2 text-xs text-gray-500
                bg-white px-1 transition-all
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[var(--color-primary)]"
            >
              Password
            </label>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-bold p-4 rounded-xl
              transform transition-all shadow-lg  hover:shadow-xl focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none cursor-pointer"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
