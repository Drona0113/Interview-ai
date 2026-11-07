import { useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import "./LogoutButton.scss";

const LogoutButton = () => {
    const { handleLogout } = useAuth();
    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);
    const [error, setError] = useState("");

    const onLogout = async () => {
        setLoggingOut(true);
        setError("");

        try {
            await handleLogout();
            navigate("/login", { replace: true });
        } catch (logoutError) {
            setError(
                logoutError.response?.data?.message ??
                    logoutError.message ??
                    "Could not log out. Please try again."
            );
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <div className="logout-control">
            <button
                className="logout-control__button"
                disabled={loggingOut}
                onClick={onLogout}
                type="button"
            >
                <LogOut aria-hidden="true" />
                {loggingOut ? "Logging out…" : "Log out"}
            </button>
            {error && (
                <p className="logout-control__error" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
};

export default LogoutButton;
