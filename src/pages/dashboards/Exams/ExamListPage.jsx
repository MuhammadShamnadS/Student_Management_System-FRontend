// src/pages/dashboards/ExamListPage.jsx
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
  TextField,
  MenuItem,
  Collapse,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";

const ExamListPage = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterScope, setFilterScope] = useState("all");
  const [standard, setStandard] = useState("all");
  const [expandedExamId, setExpandedExamId] = useState(null);

  const fetchExams = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/exams");
      setExams(res.data.results || []);
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

const filteredExams = exams.filter((e) => {
  if (filterScope === "school" && e.scope !== "school") return false;
  if (filterScope === "class" && e.scope === "school") return false;
  if (standard !== "all") {
    const examClass = e.scope === "school"
      ? e.target_standard
      : e.target_class?.split("-")[0];
    if (examClass !== standard) return false;
  }
  return true;
});


  const toggleExpand = (id) => {
    setExpandedExamId((prev) => (prev === id ? null : id));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Manage Exams
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          select
          size="small"
          label="Filter by Type"
          value={filterScope}
          onChange={(e) => setFilterScope(e.target.value)}
        >
          <MenuItem value="all">All Exams</MenuItem>
          <MenuItem value="school">School-Level</MenuItem>
          <MenuItem value="class">Class-Level</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          label="Filter by Class"
          value={standard}
          onChange={(e) => setStandard(e.target.value)}
        >
          <MenuItem value="all">All Classes</MenuItem>
          {Array.from({ length: 12 }, (_, i) => (
            <MenuItem key={i + 1} value={String(i + 1)}>
              Class {i + 1}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="outlined" onClick={fetchExams}>
          Refresh
        </Button>
      </Box>

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
                <TableCell>Type</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No exams found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredExams.map((exam) => (
                  <React.Fragment key={exam.id}>
                    <TableRow>
                      <TableCell>{exam.title}</TableCell>
                      <TableCell>{exam.scope}</TableCell>
                      <TableCell>
                        {exam.scope === "school"
                          ? `Class ${exam.target_standard}`
                          : exam.target_class}
                      </TableCell>
                      <TableCell>
                        {new Date(exam.start_time).toLocaleString()}
                      </TableCell>
                      <TableCell>{exam.duration_minutes} min</TableCell>
                      <TableCell>
                        {exam.scope === "school" && (
                          <IconButton
                            title="Edit"
                            color="secondary"
                            onClick={() =>
                              navigate(`/dashboard/exams/${exam.id}/edit`)
                            }
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        <IconButton
                          title="Update Questions"
                          onClick={() =>
                            navigate(`/dashboard/exams/${exam.id}/questions`)
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
                      <TableCell colSpan={6} sx={{ p: 0, border: "none" }}>
                        <Collapse in={expandedExamId === exam.id}>
                          <Box sx={{ p: 2, bgcolor: "#fafafa" }}>
                            <Typography variant="subtitle2">
                              <strong>Title:</strong> {exam.title}
                            </Typography>
                            <Typography variant="subtitle2">
                              <strong>Scope:</strong> {exam.scope}
                            </Typography>
                            <Typography variant="subtitle2">
                              <strong>Target Standard:</strong>{" "}
                              {exam.target_standard}
                            </Typography>
                            <Typography variant="subtitle2">
                              <strong>Start Time:</strong>{" "}
                              {new Date(exam.start_time).toLocaleString()}
                            </Typography>
                            <Typography variant="subtitle2">
                              <strong>Duration:</strong>{" "}
                              {exam.duration_minutes} minutes
                            </Typography>
                            <Typography variant="subtitle2">
                              <strong>Created By:</strong>{" "}
                              {exam.scope === "school"
                                ? "Admin"
                                : "Teacher"}
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

export default ExamListPage;
