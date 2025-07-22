// src/pages/dashboards/Students/StudentDashboardPage.jsx

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "../../../api/axios";

const StudentDashboardPage = () => {
  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [studentRes, examRes, resultRes] = await Promise.all([
        axios.get("/api/students/me"),
        axios.get("/api/exams"),
        axios.get("/api/students/my_marks"),
      ]);

      setStudent(studentRes.data);
      setExams(examRes.data.results || []);
      setResults(resultRes.data || []);
    } catch (err) {
      setError("Failed to load student dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <CircularProgress sx={{ mt: 6 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  // Stats
  const attendedExamIds = new Set(results.map((r) => r.exam));
  const attendedCount = attendedExamIds.size;
  const totalExams = exams.length;
  const averageScore =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.marks_obtained, 0) / results.length)
      : 0;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Student Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Info */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Profile</Typography>
            <Box mt={1}>
              <Typography><strong>Name:</strong> {student.first_name} {student.last_name}</Typography>
              <Typography><strong>Email:</strong> {student.email}</Typography>
              <Typography><strong>Class:</strong> {student.student_class}</Typography>
              <Typography><strong>Assigned Teacher:</strong> {student.assigned_teacher_name}</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Stats */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Exam Statistics</Typography>
            <Box mt={1}>
              <Typography><strong>Total Exams Assigned:</strong> {totalExams}</Typography>
              <Typography><strong>Exams Attended:</strong> {attendedCount}</Typography>
              <Typography><strong>Average Score:</strong> {averageScore}%</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboardPage;
