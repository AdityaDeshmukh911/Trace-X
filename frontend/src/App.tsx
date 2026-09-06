import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CaseListPage from "./pages/CaseListPage";
import AlertsPage from "./pages/AlertsPage";
import IngestionPage from "./pages/IngestionPage";
import FreezeWorkflowPage from "./pages/FreezeWorkflowPage";
import ClusterExplorerPage from "./pages/ClusterExplorerPage";
import EvidenceVerifyPage from "./pages/EvidenceVerifyPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <AlertsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ingest"
          element={
            <ProtectedRoute>
              <IngestionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freeze"
          element={
            <ProtectedRoute>
              <FreezeWorkflowPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clusters"
          element={
            <ProtectedRoute>
              <ClusterExplorerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cases"
          element={
            <ProtectedRoute>
              <CaseListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/evidence"
          element={<EvidenceVerifyPage />}
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
