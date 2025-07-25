import React, { useEffect, useState } from "react";
import {
  Container, Typography, Paper, CircularProgress, Alert,
  Button, Grid, Box, Chip
} from "@mui/material";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "../../api/axios";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ScoreIcon from "@mui/icons-material/Score";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const AdminSubmissionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`/api/submissions/${id}`)
      .then((res) => {
        setSubmission(res.data);
        setError("");
      })
      .catch(() => setError("Submission not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBack = () => {
    navigate(`/dashboard/dashboard/admin/exam-scores?${searchParams.toString()}`);
  };

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;

  return (
    <Container sx={{ mt: 4 }}>
      <Button variant="outlined" onClick={handleBack} sx={{ mb: 3 }}>
        ← Back to Student Submissions
      </Button>

      {/* Student & Exam Details */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <PersonIcon sx={{ mr: 1 }} color="primary" />
              <Typography><strong>Student:</strong> {submission.student_name}</Typography>
            </Box>
            <Box display="flex" alignItems="center" mt={1}>
              <AssignmentIcon sx={{ mr: 1 }} color="primary" />
              <Typography><strong>Roll No:</strong> {submission.student_roll_number}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <AssignmentIcon sx={{ mr: 1 }} color="secondary" />
              <Typography><strong>Exam:</strong> {submission.exam_title}</Typography>
            </Box>
            <Box display="flex" alignItems="center" mt={1}>
              <ScoreIcon sx={{ mr: 1 }} color="success" />
              <Typography>
                <strong>Score:</strong> {submission.score} / {submission.answers.length}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Answer Section */}
      <Typography variant="h6" gutterBottom>
        Answer Details
      </Typography>

      <Grid container spacing={2}>
        {submission.answers.map((ans, index) => {
          const isCorrect = ans.selected_option === ans.correct_option;
          const selectedText = ans[`option${ans.selected_option}`] || "-";
          const correctText = ans[`option${ans.correct_option}`] || "-";

          return (
            <Grid item xs={12} key={index}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  <strong>Q{index + 1}:</strong> {ans.question_text}
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Selected:</strong> {selectedText} ({ans.selected_option || "-"})
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Correct:</strong> {correctText} ({ans.correct_option})
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    {isCorrect ? (
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="Correct"
                        color="success"
                        variant="outlined"
                      />
                    ) : (
                      <Chip
                        icon={<CancelIcon />}
                        label="Incorrect"
                        color="error"
                        variant="outlined"
                      />
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default AdminSubmissionDetailPage;
