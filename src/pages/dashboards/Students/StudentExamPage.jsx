import React, { useEffect, useState } from "react";
import {
  Container, Typography, CircularProgress, Card, CardContent, Button, Grid, Alert
} from "@mui/material";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";

const StudentExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/exams")
      .then(res => setExams(res.data.results || []))
      .catch(() => setError("Failed to load exams"))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();

  const canAttend = (exam) => {
    const start = new Date(exam.start_time);
    const end = new Date(start.getTime() + exam.duration_minutes * 60000);
    return now >= start && now <= end;
  };

  const handleAttend = (examId) => {
    navigate(`/dashboard/student/exams/${examId}/attend`);
  };

  if (loading) return <CircularProgress sx={{ mt: 6 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Upcoming Exams
      </Typography>
      <Grid container spacing={2}>
        {exams.map((exam) => (
          <Grid item xs={12} md={6} lg={4} key={exam.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{exam.title}</Typography>
                <Typography variant="body2">Starts: {new Date(exam.start_time).toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour12: true,
})}</Typography>
                <Typography variant="body2">Duration: {exam.duration_minutes} minutes</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1 }}
                  onClick={() => handleAttend(exam.id)}
                  disabled={!canAttend(exam)}
                >
                  {canAttend(exam) ? "Attend" : "Not Available Yet"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StudentExamsPage;
