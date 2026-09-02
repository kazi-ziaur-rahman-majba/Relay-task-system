import React, { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminLayout from "@/components/admin/AdminLayout";

// Lazy-loaded page components for Code-Splitting & bundle size optimization
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const TasksPage = lazy(() => import("@/pages/TasksPage"));
const UrgentPage = lazy(() => import("@/pages/UrgentPage"));
const TeamPage = lazy(() => import("@/pages/TeamPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/urgent" element={<UrgentPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
