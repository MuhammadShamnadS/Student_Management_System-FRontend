// src/pages/dashboards/Teachers/TeacherCreateExamPage.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Box,
} from "@mui/material";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";

const TeacherCreateExamPage = () => {
  const [form, setForm] = useState({
    title: "",
    target_class: "", 
    start_time: "",
    duration_minutes: 5,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/teachers/me")
      .then((res) => {
        const assignedClass = res.data.assigned_class;
        if (assignedClass) {
          setForm((prev) => ({ ...prev, target_class: assignedClass }));
        }
      })
      .catch((err) => {
        setError("Failed to fetch teacher info.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await axios.post("/api/exams", form);
    const examId = res.data.id;
    navigate(`/dashboard/teachers/exams/${examId}/questions`); 
  } catch (err) {
    const msg =
      err.response?.data?.target_class?.[0] ||
      err.response?.data?.detail ||
      "Failed to create exam.";
    setError(msg);
  }
};


  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create Class-Level Exam
        </Typography>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            margin="normal"
            required
          />

          {/* Read-only field for assigned class */}
          <TextField
            fullWidth
            label="Class"
            name="target_class"
            value={form.target_class}
            margin="normal"
            InputProps={{ readOnly: true }}
          />

          <TextField
            fullWidth
            label="Start Time"
            name="start_time"
            type="datetime-local"
            value={form.start_time}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />

          <TextField
            fullWidth
            label="Duration (minutes)"
            name="duration_minutes"
            type="number"
            value={form.duration_minutes}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Create Exam
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TeacherCreateExamPage;
