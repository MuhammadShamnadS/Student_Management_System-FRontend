import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import LogoutButton from "../../../components/LogoutButton";
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
} from "@mui/material";

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

  return (
    <Container>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Welcome, {teacher?.user?.first_name} {teacher?.user?.last_name}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Your Class</Typography>
              <Typography>{teacher?.assigned_class || "N/A"}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Students</Typography>
              <Typography>{students.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Exams</Typography>
              <Typography>{exams.filter(e => e.assigned_teacher === teacher?.id).length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />
    </Container>
  );
};

export default TeacherDashboard;