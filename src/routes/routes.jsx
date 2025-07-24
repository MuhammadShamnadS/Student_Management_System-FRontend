// src/routes/index.jsx
import React from "react";
import { Navigate } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import RequireAuth from "../components/RequireAuth";

import LoginPage from "../pages/LoginPage";
import ForgotPasswordPage from "../pages/ForgetPasswordpage";
import ResetPasswordPage from "../pages/ResetPasswordPage";


import DashboardRouter from "../pages/dashboards/DashboardRouter";
import StudentRegisterForm from "../pages/RegisterStudentForm";
import TeacherRegisterForm from "../pages/RegisterTeacherForm";
import EditTeacherForm from "../pages/TeacherEditForm";
import EditStudentForm from "../pages/StudentEditForm";
import AllTeachers from "../pages/dashboards/AllTeachers";
import AllStudents from "../pages/dashboards/AllStudents";
import AdminExamScorePage from "../pages/dashboards/AdminExamScoresPage";
import TeacherDashboard from "../pages/dashboards/Teachers/TeacherDashboard";
import StudentDashboardPage from "../pages/dashboards/Students/StudentDashboard";

import StudentsUnderTeacher from "../pages/dashboards/StudentUnderTeacher";
import CreateExamPage from "../pages/dashboards/Exams/CreateExamPage";
import ExamListPage from "../pages/dashboards/Exams/ExamListPage";
import ExamQuestionsPage from "../pages/dashboards/Exams/ExamQuestionsPage";
import EditExamPage from "../pages/dashboards/Exams/EditExamPage";
import MyStudents from "../pages/dashboards/Teachers/TeacherViewStudents";
import TeacherCreateExamPage from "../pages/dashboards/Teachers/TeacherCreateExam";
import TeacherExamQuestionsPage from "../pages/dashboards/Teachers/TeacherExamQuestionsPage";
import TeacherExamListPage from "../pages/dashboards/Teachers/TeacherExamListPage";
import TeacherEditExamPage from "../pages/dashboards/Teachers/TeacherEditExamPage";
import StudentExamsPage from "../pages/dashboards/Students/StudentExamPage";
import StudentScoresPage from "../pages/dashboards/Students/StudentScorePage";
import StudentAttendExamPage from "../pages/dashboards/Students/StudentAttendExamPage";
import StudentExamDetailPage from "../pages/dashboards/Students/StudentExamDetailPage";
import AdminSubmissionDetailPage from "../pages/dashboards/AdminSubmissionDetailPage";



const routes = [
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <LoginPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
      { path: "/register", element: <Navigate to="/dashboard/register" replace /> }, // redirect to nested
    ],
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardRouter /> },
          { path: "students", element: <RequireAuth allowedRoles={["admin"]}><AllStudents /></RequireAuth> },
          { path: "teachers", element: <RequireAuth allowedRoles={["admin"]}><AllTeachers /></RequireAuth> },
          { path: "register/student", element: <RequireAuth allowedRoles={["admin"]}><StudentRegisterForm /></RequireAuth>, },
          { path: "register/teacher", element: <RequireAuth allowedRoles={["admin"]}><TeacherRegisterForm /></RequireAuth>, },

          { path: "exams", element: <RequireAuth allowedRoles={["admin"]}><ExamListPage /></RequireAuth> },
          { path: "exams/create", element: <RequireAuth allowedRoles={["admin"]}><CreateExamPage /></RequireAuth> },
          { path: "exams/:examId/questions", element: <RequireAuth allowedRoles={["admin"]}><ExamQuestionsPage /></RequireAuth> },
          { path: "exams/:examId/edit", element: <RequireAuth allowedRoles={["admin"]}><EditExamPage /></RequireAuth> },
          { path: "teachers/:id/edit", element: ( <RequireAuth allowedRoles={["admin"]}><EditTeacherForm /></RequireAuth>), },
          { path: "students/:id/edit", element: ( <RequireAuth allowedRoles={["admin"]}><EditStudentForm /></RequireAuth>), },
          { path: "dashboard/admin/exam-scores", element: ( <RequireAuth allowedRoles={["admin"]}><AdminExamScorePage /></RequireAuth> ), },{ path: "admin/submission/:id", element: ( <RequireAuth allowedRoles={["admin"]}><AdminSubmissionDetailPage /></RequireAuth>), },
          { path: "admin/submission/:id", element: ( <RequireAuth allowedRoles={["admin"]}><AdminSubmissionDetailPage /></RequireAuth>), },



          { path: "teacher", element: <RequireAuth allowedRoles={["teacher"]}><TeacherDashboard /></RequireAuth> },
          { path: "teacher/:teacherId/students", element: <RequireAuth allowedRoles={["admin"]}><StudentsUnderTeacher /></RequireAuth> },
          { path: "teachers/student", element: <RequireAuth allowedRoles={["teacher"]}><MyStudents /></RequireAuth> },
          { path: "teacher/exams/create", element: <RequireAuth allowedRoles={["teacher"]}><TeacherCreateExamPage /></RequireAuth> },
          { path: "teachers/exams", element: <RequireAuth allowedRoles={["teacher"]}><TeacherExamListPage /></RequireAuth> },
          { path: "teachers/exams/:examId/questions", element: <RequireAuth allowedRoles={["teacher"]}><TeacherExamQuestionsPage /></RequireAuth> },
          { path: "teachers/exams/:examId/edit", element: <RequireAuth allowedRoles={["teacher"]}><TeacherEditExamPage /></RequireAuth> },

          { path: "student", element: <RequireAuth allowedRoles={["student"]}><StudentDashboardPage /></RequireAuth> },
          { path: "students/myexam", element: <RequireAuth allowedRoles={["student"]}><StudentExamsPage /></RequireAuth> },
          { path: "students/score", element: <RequireAuth allowedRoles={["student"]}><StudentScoresPage /></RequireAuth> },
          { path: "student/exams/:examId/attend", element: <RequireAuth allowedRoles={["student"]}><StudentAttendExamPage /></RequireAuth> },
          { path: "student/scores/:id", element: <RequireAuth allowedRoles={["student"]}><StudentExamDetailPage /></RequireAuth> },
    ],
  },
],
  },
]


export default routes;
