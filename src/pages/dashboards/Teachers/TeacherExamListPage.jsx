// src/pages/dashboards/Teachers/TeacherExamListPage.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  Alert,
  Box,
  Button,
  Collapse,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";

const TeacherExamListPage = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedExamId, setExpandedExamId] = useState(null);

  const fetchExams = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/exams");
      const classLevelExams = res.data.results.filter((e) => e.scope === "class");
      setExams(classLevelExams);
    } catch {
      setError("Failed to load exams.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    try {
      await axios.delete(`/api/exams/${id}`);
      setExams((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Delete failed. Only allowed if you created the exam.");
    }
  };

  const toggleExpand = (id) => {
    setExpandedExamId((prev) => (prev === id ? null : id));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        My Exams
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper elevation={2}>
          <Table>
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No exams found.
                  </TableCell>
                </TableRow>
              ) : (
                exams.map((exam) => (
                  <React.Fragment key={exam.id}>
                    <TableRow>
                      <TableCell>{exam.title}</TableCell>
                      <TableCell>{exam.target_class}</TableCell>
                      <TableCell>
                        {new Date(exam.start_time).toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour12: true,
})}
                      </TableCell>
                      <TableCell>{exam.duration_minutes} min</TableCell>
                      <TableCell>
                        <IconButton
                          title="Edit"
                          color="secondary"
                          onClick={() =>
                            navigate(`/dashboard/teachers/exams/${exam.id}/edit`)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          title="Questions"
                          onClick={() =>
                            navigate(`/dashboard/teachers/exams/${exam.id}/questions`)
                          }
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          title="Delete"
                          color="error"
                          onClick={() => handleDelete(exam.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          title="More"
                          onClick={() => toggleExpand(exam.id)}
                        >
                          {expandedExamId === exam.id ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={5} sx={{ p: 0, border: "none" }}>
                        <Collapse in={expandedExamId === exam.id}>
                          <Box sx={{ p: 2, bgcolor: "#fafafa" }}>
                            <Typography variant="subtitle2">
                              <strong>Title:</strong> {exam.title}
                            </Typography>
                            <Typography variant="subtitle2">
                              <strong>Start Time:</strong>{" "}
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
                            <Typography variant="subtitle2">
                              <strong>Duration:</strong>{" "}
                              {exam.duration_minutes} minutes
                            </Typography>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default TeacherExamListPage;
