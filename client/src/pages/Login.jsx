import { useState } from "react";

import {
    Link,
    Navigate,
    useLocation,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
    const { user, login } = useAuth();

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const location = useLocation();

    if (user) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        const trimmedUsername = username.trim();

        if (!trimmedUsername || !password) {
            setError("Username and password are required.");
            return;
        }

        try {
            setSubmitting(true);

            await login(trimmedUsername, password);

            navigate("/", { replace: true });
        } catch (error) {
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
            <div className="w-full max-w-md">

                {/* Logo / Heading */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-lg font-bold text-zinc-950">
                        C
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-zinc-500">
                        Sign in to continue to your conversations.
                    </p>
                </div>

                {/* Login card */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-2xl sm:p-8">

                    {/* Success message */}
                    {location.state?.message && (
                        <div className="mb-5 rounded-xl border border-emerald-900/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-400">
                            {location.state.message}
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="mb-5 rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {/* Username */}
                        <div>
                            <label
                                htmlFor="username"
                                className="mb-2 block text-sm font-medium text-zinc-300"
                            >
                                Username
                            </label>

                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(event) =>
                                    setUsername(event.target.value)
                                }
                                autoComplete="username"
                                disabled={submitting}
                                placeholder="Enter your username"
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-zinc-300"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                autoComplete="current-password"
                                disabled={submitting}
                                placeholder="Enter your password"
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {submitting
                                ? "Logging in..."
                                : "Login"}
                        </button>
                    </form>

                    {/* Register link */}
                    <p className="mt-6 border-t border-zinc-800 pt-6 text-center text-sm text-zinc-500">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-medium text-zinc-200 transition hover:text-white"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default Login;