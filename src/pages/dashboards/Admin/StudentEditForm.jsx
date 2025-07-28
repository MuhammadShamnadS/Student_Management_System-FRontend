// src/pages/dashboards/Students/EditStudentForm.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
  MenuItem,
  Stack,
  Typography
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "../api/axios";

const EditStudentForm = ({ studentId, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [initialData, setInitialData] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setError: setFieldError,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    axios
      .get(`/api/students/${studentId}`)
      .then((res) => {
        const s = res.data;
        const data = {
          username: s.user.username,
          email: s.user.email,
          first_name: s.user.first_name,
          last_name: s.user.last_name,
          phone: s.phone,
          roll_number: s.roll_number,
          student_class: s.student_class,
          date_of_birth: s.date_of_birth,
          admission_date: s.admission_date,
          status: s.status,
        };
        reset(data);
        setInitialData(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load student data.");
        setLoading(false);
      });
  }, [studentId, reset]);

  const onSubmit = async (data) => {
    setError("");
    const payload = {};

    if (!initialData) return;

    const userPayload = {};
    ["username", "email", "first_name", "last_name"].forEach((field) => {
      if (data[field] !== initialData[field]) {
        userPayload[field] = data[field];
      }
    });

    if (Object.keys(userPayload).length > 0) {
      payload.user = userPayload;
    }

    [
      "phone",
      "roll_number",
      "student_class",
      "date_of_birth",
      "admission_date",
      "status",
    ].forEach((field) => {
      if (data[field] !== initialData[field]) {
        payload[field] = data[field];
      }
    });

    if (Object.keys(payload).length === 0) {
      setError("No changes detected.");
      return;
    }

    try {
      await axios.patch(`/api/students/${studentId}`, payload);
      onUpdate();
      onClose();
    } catch (err) {
      const errorData = err.response?.data;
      if (typeof errorData === "object" && errorData !== null) {
        for (const [field, message] of Object.entries(errorData)) {
          const formField = field.includes("user.") ? field.split(".")[1] : field;
          setFieldError(formField, {
            type: "manual",
            message: Array.isArray(message) ? message.join(" ") : message,
          });
        }
      } else {
        setError("Update failed.");
      }
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Student</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box textAlign="center" my={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Stack spacing={2}>
              <TextField
                label="Username"
                fullWidth
                {...register("username", { required: "Username is required" })}
                error={!!errors.username}
                helperText={errors.username?.message}
              />
              <TextField
                label="Email"
                fullWidth
                {...register("email", { required: "Email is required" })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                label="First Name"
                fullWidth
                {...register("first_name", { required: "First name is required" })}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
              />
              <TextField
                label="Last Name"
                fullWidth
                {...register("last_name")}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
              />
              <TextField
                label="Phone"
                fullWidth
                {...register("phone", { required: "Phone is required" })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
              <TextField
                label="Roll Number"
                fullWidth
                {...register("roll_number", { required: "Roll number is required" })}
                error={!!errors.roll_number}
                helperText={errors.roll_number?.message}
              />
              <TextField
                label="Class"
                fullWidth
                {...register("student_class", { required: "Class is required" })}
                error={!!errors.student_class}
                helperText={errors.student_class?.message}
              />
              <TextField
                label="Date of Birth"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register("date_of_birth", { required: "Date of birth is required" })}
                error={!!errors.date_of_birth}
                helperText={errors.date_of_birth?.message}
              />
              <TextField
                label="Admission Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register("admission_date", { required: "Admission date is required" })}
                error={!!errors.admission_date}
                helperText={errors.admission_date?.message}
              />
              <TextField
                label="Status"
                select
                fullWidth
                {...register("status", { required: true })}
                error={!!errors.status}
                helperText={errors.status?.message}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Stack>

            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                Update
              </Button>
            </DialogActions>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentForm;