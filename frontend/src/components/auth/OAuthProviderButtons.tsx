import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "~/config/api";
import { Button } from "../ui/Button";

export const OAuthProvidersButton = () => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (redirectTo) {
      localStorage.setItem("redirectTo", redirectTo);
    }
  }, [redirectTo]);

  const handleAuth = async (provider: string) => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/auth/${provider}`);
      if (data?.authUrl) {
        window.location.href = data.authUrl;
      } else {
        console.error("No auth URL received");
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="outline"
        className="w-full delay-150 transition-all"
        onClick={async () => handleAuth("google")}
        disabled={isLoading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
          <path
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            fill="currentColor"
          />
        </svg>
        Login with Google
      </Button>
      <Button
        variant="outline"
        className="w-full delay-150 transition-all"
        onClick={async () => handleAuth("github")}
        disabled={isLoading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
          <path
            fillRule="evenodd"
            d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.799 8.207 11.387.6.111.82-.261.82-.58 0-.286-.011-1.04-.016-2.04-3.338.726-4.042-1.609-4.042-1.609-.546-1.387-1.334-1.756-1.334-1.756-1.089-.744.083-.729.083-.729 1.205.085 1.84 1.239 1.84 1.239 1.07 1.834 2.805 1.304 3.488.996.108-.774.418-1.304.76-1.604-2.665-.303-5.466-1.334-5.466-5.932 0-1.31.465-2.381 1.235-3.22-.123-.303-.535-1.52.116-3.163 0 0 1.007-.322 3.3 1.23a11.526 11.526 0 0 1 3.006-.404c1.02.005 2.045.137 3.006.404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.643.243 2.86.12 3.163.77.84 1.235 1.91 1.235 3.22 0 4.609-2.805 5.625-5.475 5.921.429.37.816 1.102.816 2.222 0 1.605-.014 2.898-.014 3.293 0 .32.216.697.825.578C20.565 21.796 24 17.3 24 12c0-6.63-5.37-12-12-12z"
            fill="currentColor"
          />
        </svg>
        Login with Github
      </Button>
    </div>
  );
};