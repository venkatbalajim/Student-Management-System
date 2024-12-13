import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/login"
import Dashboard from "./pages/dashboard"
import NotFound from "./pages/not_found"
import ActivityLogs from "./pages/activity_logs"
import Report from "./pages/report"
import Settings from "./pages/settings"
import StudentForm from "./pages/student_form"
import StudentsDB from "./pages/students"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<StudentsDB />} />
        <Route path="/student-form" element={<StudentForm />} />
        <Route path="/students-logs" element={<ActivityLogs />} />
        <Route path="/report" element={<Report />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
