import { useNavigate } from "react-router-dom";
import { Button } from "~/components/ui/Button";
import { useAuth } from "~/lib/AuthContext";

export default () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/home");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to CineBase
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
          Your personal collection of favorite movies and TV shows
        </p>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-10">
          Track your viewing history, add detailed information, and discover your next binge-watch
        </p>
        <Button 
          size="lg" 
          className="text-lg px-8 py-6"
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};
