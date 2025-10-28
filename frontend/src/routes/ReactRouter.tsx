import { Route, Routes } from "react-router-dom";

import HomePage from "../pages/HomePage";
import AuthPage from "~/pages/AuthPage";
import PageError from "../pages/PageNotFound";
import WelcomePage from "~/pages/WelcomePage";
import AuthProviderCallbackPage from "~/pages/AuthProviderCallbackPage";
import { ProtectedRoute } from "~/components/ProtectedRoute";

export default () => (
  <>
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
      </Route>
      <Route path="/auth/:provider/callback" element={<AuthProviderCallbackPage />} />
      <Route path="*" element={<PageError />} />
    </Routes>
  </>
);
