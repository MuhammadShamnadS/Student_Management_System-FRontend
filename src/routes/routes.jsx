import React from "react";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import RequireAuth from "../components/RequireAuth";

import LoginPage from "../pages/LoginPage";
import ForgotPasswordPage from "../pages/ForgetPasswordpage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import RegisterPage from "../pages/RegisterPage";

import DashboardRouter from "../pages/dashboards/DashboardRouter";
import AllTeachers from "../pages/dashboards/AllTeachers";
import AllStudents from "../pages/dashboards/AllStudents";
import TeacherDashboard from "../pages/dashboards/TeacherDashboard";
import StudentDashboard from "../pages/dashboards/StudentDashboard";
import StudentsUnderTeacher from "../pages/dashboards/StudentUnderTeacher";
import CreateExamPage from "../pages/dashboards/Exams/CreateExamPage";
import ExamListPage from "../pages/dashboards/Exams/ExamListPage";
import ExamQuestionsPage from "../pages/dashboards/Exams/ExamQuestionsPage";
import EditExamPage from "../pages/dashboards/Exams/EditExamPage";



const routes = [
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <LoginPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
    ],
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardRouter /> },
          {
            path: "teachers",
            element: (
              <RequireAuth allowedRoles={["admin"]}>
                <AllTeachers />
              </RequireAuth>
            ),
          },
          {
  path: "exams/create",
  element: (
    <RequireAuth allowedRoles={["admin"]}>
      <CreateExamPage />
    </RequireAuth>
  ),
},
{
  path: "exams",
  element: (
    <RequireAuth allowedRoles={["admin"]}>
      <ExamListPage />
    </RequireAuth>
  ),
},
{
  path: "exams/:examId/questions",
  element: (
    <RequireAuth allowedRoles={["admin"]}>
      <ExamQuestionsPage />
    </RequireAuth>
  ),
},
{
  path: "exams/:examId/edit",
  element: (
    <RequireAuth allowedRoles={["admin"]}>
      <EditExamPage />
    </RequireAuth>
  ),
},


          {
            path: "students",
            element: (
              <RequireAuth allowedRoles={["admin"]}>
                <AllStudents />
              </RequireAuth>
            ),
          },
          {
            path: "teacher",
            element: (
              <RequireAuth allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </RequireAuth>
            ),
          },
          {
            path: "student",
            element: (
              <RequireAuth allowedRoles={["student"]}>
                <StudentDashboard />
              </RequireAuth>
            ),
          },
          {
            path: "teacher/:teacherId/students",
            element: (
              <RequireAuth allowedRoles={["admin"]}>
                <StudentsUnderTeacher />
              </RequireAuth>
            ),
          },
        ],
      },
    ],
  },
];

export default routes;
