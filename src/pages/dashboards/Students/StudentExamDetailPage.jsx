import React, { useEffect, useState } from "react";
import {
  Container, Typography, CircularProgress, Paper, Alert, Box
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "../../../api/axios";

const StudentExamDetailPage = () => {
  const { id } = useParams(); 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`/api/submissions/${id}`)
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load exam details."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Exam: {data.exam_title}
      </Typography>
      <Typography variant="h6" sx={{ mt: 1 }}>
        Score: {data.score}
      </Typography>
      <Typography variant="body2" sx={{ mb: 3 }}>
        Submitted at: {new Date(data.submitted_at).toLocaleString()}
      </Typography>

      {data.answers && data.answers.length > 0 ? (
        <Paper sx={{ p: 3 }}>
          {data.answers.map((ans, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Typography>
                <strong>Q{idx + 1}:</strong> {ans.question_text}
              </Typography>
              <Typography>
                <strong>Selected:</strong> Option {ans.selected_option}
              </Typography>
              <Typography>
                <strong>Correct:</strong> Option {ans.correct_option}
              </Typography>
              <Typography color={ans.is_correct ? "green" : "red"}>
                {ans.is_correct ? "Correct ✅" : "Incorrect ❌"}
              </Typography>
            </Box>
          ))}
        </Paper>
      ) : (
        <Typography>No answers available.</Typography>
      )}
    </Container>
  );
};

export default StudentExamDetailPage;
