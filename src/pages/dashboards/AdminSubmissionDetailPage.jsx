import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import axios from "../../api/axios";

const AdminSubmissionDetailPage = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`/api/submissions/${id}`)
      .then((res) => {
        setSubmission(res.data);
        setError("");
      })
      .catch(() => setError("Submission not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  if (!submission) return null;

  const getOptionText = (question, optionNumber) => {
    if (!optionNumber) return "-";
    return question[`option${optionNumber}`];
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Submission Detail
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography>
          <strong>Student:</strong> {submission.student_name}
        </Typography>
        <Typography>
          <strong>Exam:</strong> {submission.exam_title}
        </Typography>
        <Typography>
          <strong>Score:</strong> {submission.score} / {submission.answers.length}
        </Typography>
        <Typography>
          <strong>Total Questions:</strong> {submission.answers.length}
        </Typography>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Answers
      </Typography>

      <List>
        {submission.answers.map((ans, index) => (
          <React.Fragment key={ans.id || index}>
            <ListItem alignItems="flex-start">
<ListItemText
  primary={`Q${index + 1}. ${ans.question_text}`}
  secondary={
    <>
      <Typography variant="body2" component="div">
        <strong>Selected Option:</strong>{" "}
        {ans[`option${ans.selected_option}`]} ({ans.selected_option})
      </Typography>
      <Typography variant="body2" component="div">
        <strong>Correct Option:</strong>{" "}
        {ans[`option${ans.correct_option}`]} ({ans.correct_option})
      </Typography>
      <Typography
        variant="body2"
        component="div"
        color={ans.selected_option === ans.correct_option ? "green" : "red"}
      >
        <strong>Status:</strong>{" "}
        {ans.selected_option === ans.correct_option ? "✅ Correct" : "❌ Incorrect"}
      </Typography>
    </>
  }
/>

            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
};

export default AdminSubmissionDetailPage;
