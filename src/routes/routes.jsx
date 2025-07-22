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
<<<<<<< HEAD
import TeacherDashboard from "../pages/dashboards/TeacherDashboard";
import StudentDashboard from "../pages/dashboards/StudentDashboard";
=======
import TeacherDashboard from "../pages/dashboards/Teachers/TeacherDashboard";
import StudentDashboardPage from "../pages/dashboards/Students/StudentDashboard";
>>>>>>> feature/completeExamModule
import StudentsUnderTeacher from "../pages/dashboards/StudentUnderTeacher";
import CreateExamPage from "../pages/dashboards/Exams/CreateExamPage";
import ExamListPage from "../pages/dashboards/Exams/ExamListPage";
import ExamQuestionsPage from "../pages/dashboards/Exams/ExamQuestionsPage";
import EditExamPage from "../pages/dashboards/Exams/EditExamPage";
<<<<<<< HEAD
=======
import MyStudents from "../pages/dashboards/Teachers/TeacherViewStudents";
import TeacherCreateExamPage from "../pages/dashboards/Teachers/TeacherCreateExam";
import TeacherExamQuestionsPage from "../pages/dashboards/Teachers/TeacherExamQuestionsPage";
import TeacherExamListPage from "../pages/dashboards/Teachers/TeacherExamListPage";
import TeacherEditExamPage from "../pages/dashboards/Teachers/TeacherEditExamPage";
import StudentExamsPage from "../pages/dashboards/Students/StudentExamPage";
import StudentScoresPage from "../pages/dashboards/Students/StudentScorePage";
import StudentAttendExamPage from "../pages/dashboards/Students/StudentAttendExamPage";

>>>>>>> feature/completeExamModule



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
<<<<<<< HEAD


=======
{path: "/dashboard/teachers/student",
  element: (
    <RequireAuth allowedRoles={["teacher"]}>
      <MyStudents/>
    </RequireAuth>
  )
},
{
  path: "teacher/exams/create",
  element: (
    <RequireAuth allowedRoles={["teacher"]}>
      <TeacherCreateExamPage />
    </RequireAuth>
  ),
},
{
  path: "teachers/exams",
  element: (
    <RequireAuth allowedRoles={["teacher"]}>
      <TeacherExamListPage />
    </RequireAuth>
  ),
},
{
  path: "teachers/exams/:examId/questions",
  element: (
    <RequireAuth allowedRoles={["teacher"]}>
      <TeacherExamQuestionsPage />
    </RequireAuth>
  ),
},
{
    path: "/dashboard/teachers/exams/:examId/edit",
    element : (
      <RequireAuth allowedRoles={["teacher"]}>
      <TeacherEditExamPage />
    </RequireAuth>
    )
},
{
  path: "/dashboard/students/myexam" ,
      element : (
      <RequireAuth allowedRoles={["student"]}>
      <StudentExamsPage />
    </RequireAuth>
    )
},
{
  path: "/dashboard/students/score" ,
      element : (
      <RequireAuth allowedRoles={["student"]}>
      <StudentScoresPage/>
    </RequireAuth>
    )
},
{
  path : "/dashboard/student/exams/:examId/attend",
  element : (
          <RequireAuth allowedRoles={["student"]}>
      <StudentAttendExamPage/>
    </RequireAuth>

  )
},
>>>>>>> feature/completeExamModule
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
<<<<<<< HEAD
                <StudentDashboard />
=======
                <StudentDashboardPage/>
>>>>>>> feature/completeExamModule
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
