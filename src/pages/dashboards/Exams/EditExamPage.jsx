// src/pages/dashboards/EditExamPage.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import axios from "../../../api/axios";
import { useParams, useNavigate } from "react-router-dom";

const EditExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    target_standard: "",
    start_time: "",
    duration_minutes: 5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(`/api/exams`);
        const exam = res.data.results.find((e) => e.id === parseInt(examId));

        if (exam.scope !== "school") {
          setError("Only school-level exams can be edited.");
          setLoading(false);
          return;
        }

        setForm({
          title: exam.title,
          target_standard: exam.target_standard,
          start_time: exam.start_time.slice(0, 16),
          duration_minutes: exam.duration_minutes,
        });
      } catch {
        setError("Failed to fetch exam.");
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [examId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/exams/${examId}`, form);
      navigate("/dashboard/exams");
    } catch {
      setError("Failed to update exam.");
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 10 }} />;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
          Edit Exam
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Title"
            fullWidth
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
            label="Start Time"
            name="start_time"
            type="datetime-local"
            fullWidth
            value={form.start_time}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Duration (minutes)"
            name="duration_minutes"
            type="number"
            fullWidth
            value={form.duration_minutes}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Update Exam
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditExamPage;
