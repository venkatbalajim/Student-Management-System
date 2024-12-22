import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/login"
import Dashboard from "./pages/dashboard"
import NotFound from "./pages/not_found"
import StudentsLogs from "./pages/students_logs"
import Report from "./pages/report"
import Settings from "./pages/settings"
import StudentForm from "./pages/student_form"
import StudentsDB from "./pages/students"
import StaffsDB from "./pages/staffs"
import StaffsForm from "./pages/staff_form"
import StaffsLogs from "./pages/staffs_logs"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<StudentsDB />} />
        <Route path="/student-form" element={<StudentForm />} />
        <Route path="/student-logs" element={<StudentsLogs />} />
        <Route path="/report" element={<Report />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/staffs" element={<StaffsDB />} />
        <Route path="/staff-form" element={<StaffsForm />} />
        <Route path="/staff-logs" element={<StaffsLogs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
