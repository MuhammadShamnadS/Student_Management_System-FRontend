// src/pages/dashboards/Students/StudentExamScorePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Grid,
} from "@mui/material";
import axios from "../../../api/axios";

const StudentExamScorePage = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/api/submissions")
      .then((res) => {
        setResults(res.data.results || []);
;
      })
      .catch(() => setError("Failed to fetch scores."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error)
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        My Exam Scores
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {results.map((result) => (
      <Paper
  sx={{ p: 3, cursor: "pointer" }}
  onClick={() => navigate(`/dashboard/student/scores/${result.id}`)}
>
  <Typography variant="h6">
    <strong>Exam:</strong> {result.exam_title || `Exam #${result.exam}`}
  </Typography>
  <Typography>
    <strong>Score:</strong> {result.score}
  </Typography>
  <Typography>
    <strong>Submitted At:</strong>{" "}
    {new Date(result.submitted_at).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour12: true,
    })}
  </Typography>
</Paper>

        ))}
      </Grid>
    </Container>
  );
};

export default StudentExamScorePage;
