import React, { useEffect, useState, useRef } from "react";
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

  const [examInfo, setExamInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [examStarted, setExamStarted] = useState(false);
  const timerRef = useRef(null);

  // Format MM:SS
  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // Countdown Timer
  useEffect(() => {
    if (timeLeft === null) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(); // Auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  // Fetch exam info & questions
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(`/api/exams/${examId}`);
        setExamInfo(res.data);

        const qRes = await axios.get(`/api/exams/${examId}/questions`);
        setQuestions(qRes.data || []);

        const now = new Date();
        const start = new Date(res.data.start_time);
        const endOfDay = new Date(start);
        endOfDay.setHours(23, 59, 59, 999);

        if (now < start) {
          setError("Exam has not started yet.");
          return;
        }

        if (now > endOfDay) {
          setError("This exam has expired.");
          return;
        }

        // Check if already started
        const startedAt = localStorage.getItem(`exam_${examId}_startedAt`);
        if (startedAt) {
          const elapsed = Math.floor((now - new Date(startedAt)) / 1000);
          const remaining = res.data.duration_minutes * 60 - elapsed;
          if (remaining <= 0) {
            setError("Time is over. Exam auto-submitted.");
            handleSubmit(); // Auto-submit if expired
          } else {
            setTimeLeft(remaining);
            setExamStarted(true);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load exam info or questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  const handleStartExam = () => {
    const now = new Date();
    localStorage.setItem(`exam_${examId}_startedAt`, now.toISOString());
    setTimeLeft(examInfo.duration_minutes * 60);
    setExamStarted(true);
  };

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    clearInterval(timerRef.current);

    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const formattedAnswers = Object.entries(answers).map(
      ([questionId, selectedOption]) => ({
        question: parseInt(questionId),
        selected_option: selectedOption,
      })
    );

    try {
      const res = await axios.post("/api/submissions", {
        exam: parseInt(examId),
        answers: formattedAnswers,
      });

      localStorage.removeItem(`exam_${examId}_startedAt`);

      const submissionId = res.data?.id;
      if (!submissionId) throw new Error("Submission failed.");

      alert("Submitted successfully.");
      navigate(`/dashboard/student/scores/${submissionId}`);
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
        {examInfo?.title || "Attend Exam"}
      </Typography>

      {!examStarted && (
        <Button variant="contained" onClick={handleStartExam}>
          Start Exam
        </Button>
      )}

      {examStarted && (
        <>
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            Time Left: {formatTime(timeLeft)}
          </Typography>

          <Paper sx={{ p: 3 }}>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
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
        </>
      )}
    </Container>
  );
};

export default StudentAttendExamPage;
