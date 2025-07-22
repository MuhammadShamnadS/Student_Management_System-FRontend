import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  Typography,
  Container,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [studentsRes, teachersRes] = await Promise.all([
          axios.get("/api/students"),
          axios.get("/api/teachers"),
        ]);
        setStudents(studentsRes.data.results || []);
        setTeachers(teachersRes.data.results || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard stats.");
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <CircularProgress sx={{ mt: 10 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Welcome, Admin
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Use the sidebar to manage teachers, students, and user registration.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              bgcolor: "#f0f4ff",
              borderLeft: "5px solid #1976d2",
            }}
          >
            <Typography variant="subtitle1">Total Teachers</Typography>
            <Typography variant="h3">{teachers.length}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              bgcolor: "#fff7f0",
              borderLeft: "5px solid #ff9800",
            }}
          >
            <Typography variant="subtitle1">Total Students</Typography>
            <Typography variant="h3">{students.length}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
