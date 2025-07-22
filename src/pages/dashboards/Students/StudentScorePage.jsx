import React, { useEffect, useState } from "react";
import {
  Container, Typography, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, Alert
} from "@mui/material";
import axios from "../../../api/axios";

const StudentScoresPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("/api/students/my_marks")
      .then(res => setResults(res.data || []))
      .catch(() => setError("Failed to load results"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        My Scores
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Exam Title</TableCell>
            <TableCell>Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2}>No results yet.</TableCell>
            </TableRow>
          ) : (
            results.map((r, i) => (
              <TableRow key={i}>
                <TableCell>{r.exam_title}</TableCell>
                <TableCell>{r.score}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Container>
  );
};

export default StudentScoresPage;
