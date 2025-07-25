import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import {
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  Avatar,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, examRes, teacherRes] = await Promise.all([
          axios.get("/api/students"),
          axios.get("/api/exams"),
          axios.get("/api/teachers/me"),
        ]);
        setStudents(studentRes.data.results || []);
        setExams(examRes.data.results || []);
        setTeacher(teacherRes.data || null);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <CircularProgress sx={{ mt: 10 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const totalExams = exams.filter(
    (e) => e.assigned_teacher === teacher?.id
  ).length;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {teacher?.user?.first_name} {teacher?.user?.last_name}
      </Typography>

      {/* Profile Card */}
      <Card sx={{ mb: 4, display: "flex", alignItems: "center", p: 2 }}>
  <Avatar sx={{ width: 64, height: 64, mr: 2 }}>
    {teacher?.user?.first_name?.charAt(0)}
  </Avatar>
  <Box>
    <Typography variant="h6">
      {teacher?.user?.first_name} {teacher?.user?.last_name}
    </Typography>

    {/* Corrected: Fields directly from teacher, not teacher.user */}
    <Typography color="text.secondary">
      Employee ID: {teacher?.employee_id || "N/A"}
    </Typography>
    <Typography color="text.secondary">
      Email: {teacher?.user?.email || "N/A"}
    </Typography>
    <Typography color="text.secondary">
      Phone: {teacher?.phone || "N/A"}
    </Typography>
    <Typography color="text.secondary">
      Subject: {teacher?.subject_specialization || "N/A"}
    </Typography>
    <Typography color="text.secondary">
      Date of Joining: {teacher?.date_of_joining || "N/A"}
    </Typography>
    <Typography color="text.secondary">
      Assigned Class: {teacher?.assigned_class || "N/A"}
    </Typography>
  </Box>
</Card>


      {/* Stats Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: "#f0f4ff", p: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Your Class</Typography>
              </Box>
              <Typography variant="h5" sx={{ mt: 1 }}>
                {teacher?.assigned_class || "N/A"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: "#f5fff4", p: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <GroupIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Students</Typography>
              </Box>
              <Typography variant="h5" sx={{ mt: 1 }}>
                {students.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: "#fff7f0", p: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AssignmentIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Exams</Typography>
              </Box>
              <Typography variant="h5" sx={{ mt: 1 }}>
                {totalExams}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TeacherDashboard;
