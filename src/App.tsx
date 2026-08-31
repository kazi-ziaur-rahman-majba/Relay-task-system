import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { TaskManagerPage } from "@/pages/TaskManagerPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<TaskManagerPage />} />
          <Route path="/tasks" element={<TaskManagerPage />} />
          <Route path="/urgent" element={<TaskManagerPage />} />
          <Route path="/team" element={<TaskManagerPage />} />
          <Route path="*" element={<TaskManagerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
