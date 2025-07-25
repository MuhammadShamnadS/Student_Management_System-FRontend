import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Chip,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "../../api/axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const AdminExamScorePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [scope, setScope] = useState(searchParams.get("scope") || "school");
  const [exams, setExams] = useState([]);
  const [selectedClass, setSelectedClass] = useState(searchParams.get("class") || "");
  const [selectedExamId, setSelectedExamId] = useState(searchParams.get("exam") || "");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classOptions, setClassOptions] = useState([]);
  const [openModal, setOpenModal] = useState(!!selectedExamId);
  const [selectedExamTitle, setSelectedExamTitle] = useState("");

  const updateSearchParams = (newParams) => {
    const updated = {
      scope,
      class: selectedClass,
      exam: selectedExamId,
      ...newParams,
    };
    setSearchParams(updated);
  };

  useEffect(() => {
    axios.get(`/api/exams?scope=${scope}`).then((res) => {
      setExams(res.data.results || []);
    });
  }, [scope]);

  useEffect(() => {
    const field = scope === "school" ? "target_standard" : "target_class";
    const unique = [...new Set(exams.map((e) => e[field]).filter(Boolean))];
    setClassOptions(unique);
  }, [exams, scope]);

  useEffect(() => {
    if (!selectedExamId) return;
    setLoading(true);
    axios
      .get(`/api/exams/${selectedExamId}/student_scores`)
      .then((res) => setStudents(res.data || []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, [selectedExamId]);

  const handleScopeChange = (e, val) => {
    setScope(val);
    setSelectedClass("");
    setSelectedExamId("");
    updateSearchParams({ scope: val, class: "", exam: "" });
  };

  const handleClassChange = (e) => {
    const value = e.target.value;
    setSelectedClass(value);
    setSelectedExamId("");
    updateSearchParams({ class: value, exam: "" });
  };

  const handleExamSelect = (examId, title) => {
    setSelectedExamId(examId);
    setSelectedExamTitle(title);
    updateSearchParams({ exam: examId });
    setOpenModal(true);
  };

  const handleView = (submissionId) => {
    navigate(`/dashboard/admin/submission/${submissionId}?${searchParams.toString()}`);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const filteredExams = exams.filter((e) =>
    scope === "school" ? e.target_standard === selectedClass : e.target_class === selectedClass
  );

  return (
    <Box>
      <AppBar position="static" color="primary" sx={{ mb: 3 }}>
        <Toolbar>
          <AssessmentIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Exam Scores
          </Typography>
        </Toolbar>
      </AppBar>

      <Container>
        <Tabs value={scope} onChange={handleScopeChange} sx={{ mb: 2 }}>
          <Tab icon={<SchoolIcon />} iconPosition="start" label="School Level" value="school" />
          <Tab icon={<ClassIcon />} iconPosition="start" label="Class Level" value="class" />
        </Tabs>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="large" sx={{ minWidth: 250 }}>
              <InputLabel>{scope === "school" ? "Standard" : "Class"}</InputLabel>
              <Select
                value={selectedClass}
                label={scope === "school" ? "Standard" : "Class"}
                onChange={handleClassChange}
              >
                {classOptions.map((cls) => (
                  <MenuItem key={cls} value={cls}>
                    {cls}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {selectedClass && (
          <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Available Exams
            </Typography>
            {filteredExams.length === 0 ? (
              <Alert severity="info">No exams found for this class.</Alert>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><AssessmentIcon fontSize="small" sx={{ mr: 1 }} />Exam Name</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredExams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell>{exam.title}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleExamSelect(exam.id, exam.title)}
                        >
                          View Submissions
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        )}

        <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="md">
          <AppBar position="static" color="default">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleCloseModal}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Submissions - {selectedExamTitle}
              </Typography>
            </Toolbar>
          </AppBar>

          <DialogContent>
            {loading ? (
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
              </Box>
            ) : students.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                No student submissions available.
              </Alert>
            ) : (
              <Table sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell><PersonIcon fontSize="small" sx={{ mr: 1 }} />Student Name</TableCell>
                    <TableCell>Roll Number</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((stu, index) => (
                    <TableRow key={stu.student_id || index}>
                      <TableCell>{stu.student_name}</TableCell>
                      <TableCell>{stu.student_roll_number}</TableCell>
                      <TableCell>
                        {stu.submission_id ? (
                          <Chip
                            label={`Score: ${stu.score}`}
                            color="success"
                            variant="outlined"
                          />
                        ) : (
                          <Chip label="Not Submitted" color="error" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {stu.submission_id && (
                          <IconButton
                            onClick={() => handleView(stu.submission_id)}
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseModal} variant="outlined">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminExamScorePage;
