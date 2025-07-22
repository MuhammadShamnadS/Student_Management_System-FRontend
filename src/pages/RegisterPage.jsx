import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
  Paper,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [teachers, setTeachers] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (role === "student") {
      axios
        .get("/api/teachers")
        .then((res) => {
          if (Array.isArray(res.data.results)) {
            setTeachers(res.data.results);
          } else {
            setTeachers([]);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch teachers", err.response?.data || err);
          setTeachers([]);
        });
    }
  }, [role]);

  const onSubmit = async (data) => {
    setError("");
    setSuccess("");

    const endpoint = role === "teacher" ? "/api/teachers" : "/api/students";
    const payload =
      role === "teacher"
        ? {
            user: {
              username: data.username,
              email: data.email,
              first_name: data.first_name,
              last_name: data.last_name,
              password: data.password,
            },
            phone: data.phone,
            subject_specialization: data.subject_specialization,
            employee_id: data.employee_id,
            date_of_joining: data.date_of_joining,
            status: data.status,
          }
        : {
            user: {
              username: data.username,
              email: data.email,
              first_name: data.first_name,
              last_name: data.last_name,
              password: data.password,
            },
            phone: data.phone,
            roll_number: data.roll_number,
            student_class: `${data.student_class}-${data.division}`,
            date_of_birth: data.date_of_birth,
            admission_date: data.admission_date,
            status: data.status,
            assigned_teacher: data.assigned_teacher || null,
          };

    try {
      await axios.post(endpoint, payload);
      setSuccess(`${role} created successfully!`);
      reset();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create user.");
    }
  };

  if (user?.role !== "admin") {
    return <Alert severity="error">Access denied. Admins only.</Alert>;
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
  
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard")}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>

        <Typography variant="h5" gutterBottom>
          Register New {role.charAt(0).toUpperCase() + role.slice(1)}
        </Typography>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Role</InputLabel>
          <Select value={role} label="Role" onChange={(e) => setRole(e.target.value)}>
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="teacher">Teacher</MenuItem>
          </Select>
        </FormControl>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          {/* Common Fields */}
          <TextField fullWidth label="Username" margin="normal" {...register("username", { required: true })} />
          <TextField fullWidth label="Email" margin="normal" {...register("email", { required: true })} />
          <TextField fullWidth label="First Name" margin="normal" {...register("first_name", { required: true })} />
          <TextField fullWidth label="Last Name" margin="normal" {...register("last_name", { required: true })} />
          <TextField fullWidth label="Password" type="password" margin="normal" {...register("password", { required: true })} />
          <TextField fullWidth label="Phone" margin="normal" {...register("phone", { required: true })} />
          <TextField fullWidth label="Status" margin="normal" defaultValue="active" {...register("status")} />

   
          {role === "teacher" && (
            <>
              <TextField fullWidth label="Subject" margin="normal" {...register("subject_specialization", { required: true })} />
              <TextField
                fullWidth
                label="Employee ID"
                margin="normal"
                defaultValue="EMP-"
                {...register("employee_id", { required: true })}
              />
              <TextField
                fullWidth
                label="Date of Joining"
                type="date"
                margin="normal"
                InputLabelProps={{ shrink: true }}
                {...register("date_of_joining", { required: true })}
              />
            </>
          )}

    
          {role === "student" && (
            <>
              <TextField fullWidth label="Roll Number" margin="normal" {...register("roll_number", { required: true })} />
              <FormControl fullWidth margin="normal">
  <InputLabel>Class</InputLabel>
  <Select
    defaultValue=""
    label="Class"
    {...register("student_class", { required: "Class is required" })}
    error={!!errors.student_class}
  >
    {Array.from({ length: 12 }, (_, i) => (
      <MenuItem key={i + 1} value={i + 1}>
        Class {i + 1}
      </MenuItem>
    ))}
  </Select>
</FormControl>
<FormControl fullWidth margin="normal">
  <InputLabel>Division</InputLabel>
  <Select
    defaultValue=""
    label="Division"
    {...register("division", { required: "Please select the Division"})}
    error={!!errors.division}
  >
    <MenuItem value="A">A</MenuItem>
    <MenuItem value="B">B</MenuItem>
  </Select>
</FormControl>

              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                margin="normal"
                InputLabelProps={{ shrink: true }}
                {...register("date_of_birth", { required: true })}
              />
              <TextField
                fullWidth
                label="Admission Date"
                type="date"
                margin="normal"
                InputLabelProps={{ shrink: true }}
                {...register("admission_date", { required: true })}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Assign Teacher</InputLabel>
                <Select
                  defaultValue=""
                  label="Assign Teacher"
                  {...register("assigned_teacher")}
                >
                  <MenuItem value="">None</MenuItem>
                  {Array.isArray(teachers) &&
                    teachers.map((t) => (
                      <MenuItem key={t.id} value={t.id}>
                        {t.user.first_name} {t.user.last_name} ({t.subject_specialization})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </>
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
