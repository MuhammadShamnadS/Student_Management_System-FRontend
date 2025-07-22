import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import axios from "../../../api/axios";
import { useParams, useNavigate } from "react-router-dom";

const TeacherEditExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    target_class: "",
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

        if (exam.scope !== "class") {
          setError("Only class-level exams can be edited by teacher.");
          setLoading(false);
          return;
        }

        setForm({
          title: exam.title,
          target_class: exam.target_class, // ✅ include this
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/exams/${examId}`, form);
      navigate("/dashboard/teachers/exams");
    } catch (err) {
      const msg =
        err.response?.data?.target_class?.[0] ||
        err.response?.data?.detail ||
        "Failed to update exam.";
      setError(msg);
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 10 }} />;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
          Edit Class-Level Exam
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
          {/* Readonly class assigned to teacher */}
          <TextField
            fullWidth
            name="target_class"
            label="Class"
            value={form.target_class}
            InputProps={{ readOnly: true }}
            margin="normal"
          />
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

export default TeacherEditExamPage;
