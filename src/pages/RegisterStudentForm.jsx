// src/pages/dashboards/Students/StudentRegisterForm.jsx
import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../api/axios";

const StudentRegisterForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [teachers, setTeachers] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setError: setFieldError,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    axios
      .get("/api/teachers")
      .then((res) => {
        if (Array.isArray(res.data.results)) {
          setTeachers(res.data.results);
        }
      })
      .catch(() => setTeachers([]));
  }, []);

  const flattenErrors = (errors, parentKey = "") => {
    let flatErrors = {};
    for (const [key, value] of Object.entries(errors)) {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      if (Array.isArray(value)) {
        flatErrors[fullKey] = value.join(" ");
      } else if (typeof value === "object" && value !== null) {
        flatErrors = { ...flatErrors, ...flattenErrors(value, fullKey) };
      }
    }
    return flatErrors;
  };

  const onSubmit = async (data) => {
    setError("");
    setSuccess("");
    const payload = {
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
      await axios.post("/api/students", payload);
      setSuccess("Student registered successfully!");
      reset();
    } catch (err) {
      console.error("Error response:", err.response?.data);
      const errorData = err.response?.data;

      if (typeof errorData === "object" && errorData !== null) {
        const flatErrors = flattenErrors(errorData);

        for (const [field, message] of Object.entries(flatErrors)) {
          const formField = field.includes("user.") ? field.split(".")[1] : field;

          if (formField in data) {
            setFieldError(formField, { type: "manual", message });
          } else {
            setError((prev) => prev + `${field}: ${message}\n`);
          }
        }
      } else {
        setError("Registration failed.");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/dashboard/students")}>
          Back
        </Button>

        <Typography variant="h5" gutterBottom>Register Student</Typography>

        {error && <Alert severity="error" sx={{ mt: 2, whiteSpace: 'pre-line' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <TextField fullWidth label="Username" margin="normal" {...register("username", { required: "Username is required" })} error={!!errors.username} helperText={errors.username?.message} />
          <TextField fullWidth label="Email" margin="normal" {...register("email", { required: "Email is required" })} error={!!errors.email} helperText={errors.email?.message} />
          <TextField fullWidth label="First Name" margin="normal" {...register("first_name", { required: "First name is required" })} error={!!errors.first_name} helperText={errors.first_name?.message} />
          <TextField fullWidth label="Last Name" margin="normal" {...register("last_name") } error={!!errors.last_name} helperText={errors.last_name?.message} />
          <TextField fullWidth label="Password" type="password" margin="normal" {...register("password", { required: "Password is required" })} error={!!errors.password} helperText={errors.password?.message} />
          <TextField fullWidth label="Phone" margin="normal" {...register("phone", { required: "Phone is required" })} error={!!errors.phone} helperText={errors.phone?.message} />
          <TextField fullWidth label="Roll Number" margin="normal" {...register("roll_number", { required: "Roll number is required" })} error={!!errors.roll_number} helperText={errors.roll_number?.message} />

          <FormControl fullWidth margin="normal" error={!!errors.student_class}>
            <InputLabel>Class</InputLabel>
            <Select defaultValue="" label="Class" {...register("student_class", { required: "Class is required" })}>
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>Class {i + 1}</MenuItem>
              ))}
            </Select>
            {errors.student_class && <Typography variant="caption" color="error">{errors.student_class.message}</Typography>}
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.division}>
            <InputLabel>Division</InputLabel>
            <Select defaultValue="" label="Division" {...register("division", { required: "Division is required" })}>
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="B">B</MenuItem>
            </Select>
            {errors.division && <Typography variant="caption" color="error">{errors.division.message}</Typography>}
          </FormControl>

          <TextField fullWidth label="Date of Birth" type="date" margin="normal" InputLabelProps={{ shrink: true }} {...register("date_of_birth", { required: "Date of birth is required" })} error={!!errors.date_of_birth} helperText={errors.date_of_birth?.message} />
          <TextField fullWidth label="Admission Date" type="date" margin="normal" InputLabelProps={{ shrink: true }} {...register("admission_date", { required: "Admission date is required" })} error={!!errors.admission_date} helperText={errors.admission_date?.message} />

          <TextField fullWidth label="Status" margin="normal" defaultValue="active" {...register("status")} />

          <FormControl fullWidth margin="normal">
            <InputLabel>Assign Teacher</InputLabel>
            <Select defaultValue="" label="Assign Teacher" {...register("assigned_teacher")}> 
              <MenuItem value="">None</MenuItem>
              {teachers.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.user.first_name} {t.user.last_name} ({t.assigned_class})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Register</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default StudentRegisterForm;
