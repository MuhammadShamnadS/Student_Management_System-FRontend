// src/pages/dashboards/Students/StudentExamsPage.jsx
import React, { useEffect, useState } from "react";
import {
  Container, Typography, CircularProgress, Card, CardContent, Button, Grid, Alert
} from "@mui/material";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";

const StudentExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [submittedMap, setSubmittedMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //  Load all eligible exams
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get("/api/exams");
        const examsData = res.data.results || [];


        setExams(examsData);

        // Fetch submission status for each exam
        const statusPromises = examsData.map((exam) =>
  axios
    .get(`/api/submissions/check/${exam.id}`)
    .then((res) => ({
      id: exam.id,
      submitted: res.data.submitted,
      submissionId: res.data.submission_id,
    }))
    .catch(() => ({ id: exam.id, submitted: false }))
);

const results = await Promise.all(statusPromises);
const map = {};
results.forEach((r) => (map[r.id] = r));
setSubmittedMap(map);
      } catch (err) {
        setError("Failed to load exams.");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const now = new Date();

  // 2. Compute status label
  const getExamStatus = (exam) => {
    const start = new Date(exam.start_time);
    const end = new Date(start.getTime() + exam.duration_minutes * 60000);
    const submission = submittedMap[exam.id];

    if (submission?.submitted === true) {
    return {
      label: "View Score",
      color: "success",
      action: "score",
      submissionId: submission.submissionId,
    };
  }

    if (now < start) return { label: "Not Started Yet", color: "warning", disabled: true };
    if (now > end) return { label: "Expired", color: "error", disabled: true };
    return { label: "Attend Now", color: "primary", action: "attend" };
  };

  const handleAction = (examId, type) => {
  const submissionId = submittedMap[examId]?.submissionId;
  if (type === "attend") {
    navigate(`/dashboard/student/exams/${examId}/attend`);
  } else if (type === "score" && submissionId) {
    navigate(`/dashboard/student/scores/${submissionId}`);
  }
};


  if (loading) return <CircularProgress sx={{ mt: 6 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        My Exams
      </Typography>
      <Grid container spacing={2}>
        {exams.map((exam) => {
          const { label, color, action, disabled } = getExamStatus(exam);
          return (
            <Grid item xs={12} md={6} lg={4} key={exam.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{exam.title}</Typography>
                  <Typography variant="body2">
                    Starts:{" "}
                    {new Date(exam.start_time).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      hour: "2-digit",
                      minute: "2-digit",
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour12: true,
                    })}
                  </Typography>
                  <Typography variant="body2">Duration: {exam.duration_minutes} mins</Typography>
                  <Button
                    variant="contained"
                    color={color}
                    sx={{ mt: 2 }}
                    disabled={disabled}
                    onClick={() => handleAction(exam.id, action)}
                  >
                    {label}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default StudentExamsPage;
