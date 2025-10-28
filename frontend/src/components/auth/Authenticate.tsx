import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "~/config/api";
import { useAuth } from "~/lib/AuthContext";

export const Authenticate = ({ provider }: { provider: string }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const { initContext } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        if (code) {
          const res = await api.get(`/auth/${provider}/callback?code=${code}`);
          await initContext(res);
          const redirect = localStorage.getItem("redirectTo");
          localStorage.removeItem("redirectTo");
          navigate(redirect || "/home");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/auth");
      }
    })();
  }, [code, provider, navigate, initContext]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-36 w-36 border-b-4 border-indigo-400">
        <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-indigo-400">
          <div className="animate-spin duration-1000 rounded-full h-16 w-16 border-b-4 border-indigo-400"></div>
        </div>
      </div>
    </div>
  );
};