import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
<<<<<<< HEAD
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";
=======
import TeacherDashboard from "./Teachers/TeacherDashboard";
import StudentDashboardPage from "./Students/StudentDashboard";
>>>>>>> feature/completeExamModule

const DashboardRouter = () => {
  const { user } = useContext(AuthContext);

  if (user?.role === "admin") return <AdminDashboard />;
  if (user?.role === "teacher") return <TeacherDashboard />;
<<<<<<< HEAD
  if (user?.role === "student") return <StudentDashboard />;
=======
  if (user?.role === "student") return <StudentDashboardPage/>;
>>>>>>> feature/completeExamModule
  

  return <div>Unauthorized or unknown role</div>;
};

export default DashboardRouter;

