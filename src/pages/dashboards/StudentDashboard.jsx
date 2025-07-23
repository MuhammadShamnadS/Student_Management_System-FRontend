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

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/api/students/me")
      .then((res) => {
        setStudent(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load student profile");
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress sx={{ mt: 10 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        My Profile
      </Typography>
      <Paper>
        <List>
          <ListItem>
            <ListItemText primary="Name" secondary={`${student.user.first_name} ${student.user.last_name}`} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Username" secondary={student.user.username} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Class" secondary={student.student_class} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Roll Number" secondary={student.roll_number} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Phone" secondary={student.phone} />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default StudentDashboard;
