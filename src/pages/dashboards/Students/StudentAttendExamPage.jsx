// src/pages/dashboards/Students/StudentAttendExamPage.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Alert,
  Box,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../api/axios";

const StudentAttendExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`/api/exams/${examId}/questions`);
        setQuestions(res.data || []);
      } catch (err) {
        setError("Failed to load questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [examId]);

  // Handle answer selection
  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  // Submit exam
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(answers).length !== questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    const formattedAnswers = Object.entries(answers).map(
      ([questionId, selectedOption]) => ({
        question: parseInt(questionId),
        selected_option: selectedOption,
      })
    );

    try {
      await axios.post("/api/submissions", {
        exam: parseInt(examId),
        answers: formattedAnswers,
      });
      alert("Answers submitted successfully!");
      navigate(`student/scores/${examId}`);
    } catch (err) {
      console.error(err);
      setError("Submission failed. Please try again.");
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Attend Exam
      </Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          {questions.map((q, index) => (
            <Box key={q.id} sx={{ mb: 3 }}>
              <Typography fontWeight="bold">
                {index + 1}. {q.text}
              </Typography>
              <RadioGroup
                value={answers[q.id] || ""}
                onChange={(e) => handleOptionChange(q.id, parseInt(e.target.value))}
              >
                <FormControlLabel value={1} control={<Radio />} label={q.option1} />
                <FormControlLabel value={2} control={<Radio />} label={q.option2} />
                <FormControlLabel value={3} control={<Radio />} label={q.option3} />
                <FormControlLabel value={4} control={<Radio />} label={q.option4} />
              </RadioGroup>
            </Box>
          ))}

        <Button
      type="submit"
      variant="contained"
      fullWidth
      disabled={Object.keys(answers).length !== questions.length}
    >
      Submit Answers
    </Button>

        </form>
      </Paper>
    </Container>
  );
};

export default StudentAttendExamPage;
