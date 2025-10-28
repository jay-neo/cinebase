import { AuthProvider } from "./lib/AuthContext";
import { ThemeProvider } from "./lib/ThemeContext";
import ReactRouter from "./routes/ReactRouter";

export default () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground">
          <ReactRouter />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};
