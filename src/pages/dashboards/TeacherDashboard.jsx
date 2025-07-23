import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import LogoutButton from "../../components/LogoutButton";
import {
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/api/students")
      .then((res) => {
        setStudents(res.data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load students");
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress sx={{ mt: 10 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        My Assigned Students
      </Typography>
      <Paper>
        <List>
          {students.length === 0 && (
            <ListItem>
              <ListItemText primary="No students assigned." />
            </ListItem>
          )}
          {students.map((student) => (
            <ListItem key={student.id}>
              <ListItemText
                primary={`${student.user.first_name} ${student.user.last_name}`}
                secondary={`Class: ${student.student_class}, Roll No: ${student.roll_number}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default TeacherDashboard;
