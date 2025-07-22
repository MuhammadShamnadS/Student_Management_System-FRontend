import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  IconButton,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Stack,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const StudentsUnderTeacher = () => {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/api/teachers/${teacherId}/students`);
      setStudents(res.data.results || []);
    } catch (err) {
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacher = async () => {
    try {
      const res = await axios.get(`/api/teachers/${teacherId}`);
      setTeacher(res.data);
    } catch (err) {
      console.error("Could not load teacher");
    }
  };

  useEffect(() => {
    fetchTeacher();
    fetchStudents();
  }, [teacherId]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Students Under {teacher?.user?.first_name || "Teacher"}
        </Typography>
      </Box>

      {/* Teacher Info */}
      {teacher && (
        <Card
          sx={{
            mb: 4,
            p: 3,
            boxShadow: 3,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main" }}>
              {teacher.user?.first_name?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h6" gutterBottom>
                {teacher.user?.first_name} {teacher.user?.last_name}
              </Typography>
              <Stack spacing={0.5}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Email:</strong> {teacher.user?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Phone:</strong> {teacher.phone}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Subject:</strong> {teacher.subject_specialization}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Employee ID:</strong> {teacher.employee_id}
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Card>
      )}

      {/* Loading/Error */}
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {/* No Students */}
      {!loading && !error && students.length === 0 && (
        <Alert severity="info">No students assigned to this teacher.</Alert>
      )}

      {/* Students Grid */}
      {!loading && !error && students.length > 0 && (
        <Grid container spacing={3}>
          {students.map((student) => (
            <Grid item xs={12} sm={6} md={4} key={student.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 2,
                  backgroundColor: "#f9f9f9",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {student.user?.first_name} {student.user?.last_name}
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Stack spacing={0.5}>
                    <Typography variant="body2">
                      <strong>Roll No:</strong> {student.roll_number}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Class:</strong> {student.student_class}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {student.user?.email}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Phone:</strong> {student.phone}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> {student.status}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default StudentsUnderTeacher;
