import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
  Button,
  Paper,
} from "@mui/material";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const AdminExamScorePage = () => {
  const navigate = useNavigate();
  const [scope, setScope] = useState("school"); // "school" or "class"
  const [exams, setExams] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classOptions, setClassOptions] = useState([]);

  // Fetch exams based on scope
  useEffect(() => {
    axios.get(`/api/exams?scope=${scope}`).then((res) => {
      setExams(res.data.results || []);
      setSelectedExamId("");
      setSelectedClass("");
    });
  }, [scope]);

  // Extract unique classes/standards from exams
  useEffect(() => {
    const field = scope === "school" ? "target_standard" : "target_class";
    const unique = [...new Set(exams.map((e) => e[field]).filter(Boolean))];
    setClassOptions(unique);
  }, [exams, scope]);

  // Fetch students + submissions
  useEffect(() => {
    if (!selectedExamId) return;
    setLoading(true);
    axios.get(`/api/exams/${selectedExamId}/student_scores`)
      .then((res) => setStudents(res.data || []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, [selectedExamId]);
  

  const handleView = (submissionId) => {
    navigate(`/dashboard/admin/submission/${submissionId}`);
  };

  const filteredExams = exams.filter((e) =>
    scope === "school"
      ? e.target_standard === selectedClass
      : e.target_class === selectedClass
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Exam Scores
      </Typography>

      <Tabs value={scope} onChange={(e, val) => setScope(val)} sx={{ mb: 2 }}>
        <Tab label="School Level" value="school" />
        <Tab label="Class Level" value="class" />
      </Tabs>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>{scope === "school" ? "Standard" : "Class"}</InputLabel>
            <Select
              value={selectedClass}
              label={scope === "school" ? "Standard" : "Class"}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedExamId("");
              }}
            >
              {classOptions.map((cls) => (
                <MenuItem key={cls} value={cls}>
                  {cls}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth disabled={!selectedClass}>
            <InputLabel>Exam</InputLabel>
            <Select
              value={selectedExamId}
              label="Exam"
              onChange={(e) => setSelectedExamId(e.target.value)}
            >
              {filteredExams.map((exam) => (
                <MenuItem key={exam.id} value={exam.id}>
                  {exam.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {loading ? (
        <CircularProgress />
      ) : students.length === 0 ? (
        <Alert severity="info">No students to display.</Alert>
      ) : (
        <Grid container spacing={2}>
        {students.map((stu, index) => (
  <Grid
    item
    xs={12}
    md={6}
    lg={4}
    key={stu.student_id || stu.id || index}
  >
    <Paper sx={{ p: 2 }}>
      <Typography>
        <strong>{stu.student_name}</strong>
      </Typography>
      <Typography>
        <strong>{stu.student_roll_number}</strong>
      </Typography>
      <Typography>
        Score: {stu.score !== null ? stu.score : "Not Submitted"}
      </Typography>
      {stu.submission_id && (
        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 1 }}
          onClick={() => handleView(stu.submission_id)}
        >
          View Submission
        </Button>
      )}
    </Paper>
  </Grid>
))}

        </Grid>
      )}
    </Container>
  );
};

export default AdminExamScorePage;
