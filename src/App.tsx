import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import DashboardPage from "@/pages/DashboardPage";
import TasksPage from "@/pages/TasksPage";
import UrgentPage from "@/pages/UrgentPage";
import TeamPage from "@/pages/TeamPage";
import SettingsPage from "@/pages/SettingsPage";

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
