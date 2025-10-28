import { useAuth } from "~/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { OAuthProvidersButton } from "~/components/auth/OAuthProviderButtons";

export default () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Sign In
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Choose your preferred authentication method
          </p>
          <OAuthProvidersButton />
        </div>
      </div>
    </div>
  );
};
