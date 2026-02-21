import { Route, Routes } from "react-router-dom";

// Layouts
import AuthLayout from "./layouts/AuthLayout";

// Components
import ProtectedRoute from "./components/share/ProtectedRoute";

// Pages
import DashboardPage from "./pages/protected/DashboardPage";
import LoginPage from "./pages/auth/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import CreditEvaluatorPage from "./pages/protected/CreditEvaluatorPage";
import ManageMembersPage from "./pages/protected/ManageMembersPage";
import ManageCareerCategoryPage from "./pages/protected/ManageCareerCategoryPage";
import ManageSubCareer from "./pages/protected/ManageSubCareer";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/credit-evaluator" element={<CreditEvaluatorPage />} />
        <Route path="/manage-member" element={<ManageMembersPage />} />
        <Route
          path="/manage-career-category"
          element={<ManageCareerCategoryPage />}
        />
        <Route path="/manage-sub-career" element={<ManageSubCareer />} />
      </Route>

      {/* Not Found Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
