// src/pages/dashboards/CreateExamPage.jsx
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Box,
  MenuItem,
} from "@mui/material";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";

const CreateExamPage = () => {
  const [form, setForm] = useState({
    title: "",
    target_standard: "",
    start_time: "",
    duration_minutes: 5,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  try {
    const res = await axios.post("/api/exams", form);
    const examId = res.data.id;
    navigate(`/dashboard/exams/${examId}/questions/`); // Redirect to add questions
  } catch (err) {
    const msg =
      err.response?.data?.detail ||
      err.response?.data?.target_standard?.[0] ||
      "Failed to create exam.";
    setError(msg);
  }
};


  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create School-Level Exam
        </Typography>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

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

          <TextField
            select
            fullWidth
            label="Target Standard"
            name="target_standard"
            value={form.target_standard}
            onChange={handleChange}
            margin="normal"
            required
          >
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i + 1} value={String(i + 1)}>
                Class {i + 1}
              </MenuItem>
            ))}
          </TextField>

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

export default CreateExamPage;
