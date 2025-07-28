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
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";

const TeacherExamScorePage = () => {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedExamTitle, setSelectedExamTitle] = useState("");

 useEffect(() => {
  const fetchExams = async () => {
    try {
      const response = await axios.get("/api/exams");
      console.log("Exam API Response:", response.data);

      if (Array.isArray(response.data)) {
        setExams(response.data);
      } else if (Array.isArray(response.data.results)) {
        setExams(response.data.results);
      } else {
        console.error("Unexpected exam response format:", response.data);
        setExams([]);
      }
    } catch (err) {
      console.error("Error fetching exams:", err);
      setExams([]);
    }
  };

  fetchExams();
}, []);


  const handleExamSelect = (examId, title) => {
    setSelectedExamId(examId);
    setSelectedExamTitle(title);
    setOpenModal(true);
    setLoading(true);
    axios
      .get(`/api/exams/${examId}/student_scores`)
      .then((res) => setStudents(res.data || []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  };

  const handleView = (submissionId) => {
    navigate(`/dashboard/teacher/submission/${submissionId}`);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box>
      <AppBar position="static" color="primary" sx={{ mb: 3 }}>
        <Toolbar>
          <AssessmentIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Assigned Exams & Scores
          </Typography>
        </Toolbar>
      </AppBar>

      <Container>
        {Array.isArray(exams) && exams.length > 0 ? (
  <Paper elevation={3} sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>
      Your Assigned Exams
    </Typography>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Exam Title</TableCell>
          <TableCell>Class</TableCell>
          <TableCell align="right">Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {exams.map((exam) => (
          <TableRow key={exam.id}>
            <TableCell>{exam.title}</TableCell>
            <TableCell>{exam.target_class || exam.target_standard}</TableCell>
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
  </Paper>
) : (
  <Alert severity="info">No assigned exams found.</Alert>
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
                No submissions from your students.
              </Alert>
            ) : (
              <Table sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell><PersonIcon sx={{ mr: 1 }} />Student Name</TableCell>
                    <TableCell>Roll Number</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((stu, idx) => (
                    <TableRow key={stu.student_id || idx}>
                      <TableCell>{stu.student_name}</TableCell>
                      <TableCell>{stu.student_roll_number}</TableCell>
                      <TableCell>
                        {stu.submission_id ? (
                          <Chip label={`Score: ${stu.score}`} color="success" variant="outlined" />
                        ) : (
                          <Chip label="Not Submitted" color="error" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {stu.submission_id && (
                          <IconButton onClick={() => handleView(stu.submission_id)} color="primary">
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

export default TeacherExamScorePage;
