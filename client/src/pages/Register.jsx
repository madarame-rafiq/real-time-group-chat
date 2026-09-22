import { useState } from "react";

import {
    Link,
    Navigate,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
    const { user, register } = useAuth();

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (user) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        const trimmedUsername = username.trim();

        if (!trimmedUsername || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setSubmitting(true);

            await register(trimmedUsername, password);

            navigate("/login", {
                replace: true,
                state: {
                    message:
                        "Account created successfully. Please log in.",
                },
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-8 text-zinc-100">
            <div className="w-full max-w-md">

                {/* Logo / Heading */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-lg font-bold text-zinc-950">
                        C
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create your account
                    </h1>

                    <p className="mt-2 text-sm text-zinc-500">
                        Create an account and start chatting.
                    </p>
                </div>

                {/* Register card */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-2xl sm:p-8">

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
                                placeholder="Choose a username"
                                maxLength={30}
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
                                autoComplete="new-password"
                                disabled={submitting}
                                placeholder="Create a password"
                                minLength={8}
                                maxLength={72}
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        {/* Confirm password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-medium text-zinc-300"
                            >
                                Confirm Password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value
                                    )
                                }
                                autoComplete="new-password"
                                disabled={submitting}
                                placeholder="Enter your password again"
                                minLength={8}
                                maxLength={72}
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
                                ? "Creating account..."
                                : "Create account"}
                        </button>
                    </form>

                    {/* Login link */}
                    <p className="mt-6 border-t border-zinc-800 pt-6 text-center text-sm text-zinc-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-zinc-200 transition hover:text-white"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default Register;