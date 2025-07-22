import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";

const DashboardRouter = () => {
  const { user } = useContext(AuthContext);

  if (user?.role === "admin") return <AdminDashboard />;
  if (user?.role === "teacher") return <TeacherDashboard />;
  if (user?.role === "student") return <StudentDashboard />;
  

  return <div>Unauthorized or unknown role</div>;
};

export default DashboardRouter;

