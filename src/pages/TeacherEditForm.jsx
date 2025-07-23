// src/pages/dashboards/Teachers/EditTeacherForm.jsx
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
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../api/axios";

const EditTeacherForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [initialData, setInitialData] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setError: setFieldError,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    axios
      .get(`/api/teachers/${id}`)
      .then((res) => {
        const t = res.data;
        const data = {
          username: t.user.username,
          email: t.user.email,
          first_name: t.user.first_name,
          last_name: t.user.last_name,
          phone: t.phone,
          subject_specialization: t.subject_specialization,
          status: t.status,
        };
        reset(data);
        setInitialData(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load teacher data.");
        setLoading(false);
      });
  }, [id, reset]);

  const onClose = () => {
    setOpen(false);
    navigate("/dashboard/teachers");
  };

  const onSubmit = async (data) => {
    setError("");
    const payload = {};

    if (!initialData) return;

    // Compare user fields
    const userPayload = {};
    ["username", "email", "first_name", "last_name"].forEach((field) => {
      if (data[field] !== initialData[field]) {
        userPayload[field] = data[field];
      }
    });

    if (Object.keys(userPayload).length > 0) {
      payload.user = userPayload;
    }

    // Compare teacher fields
    ["phone", "subject_specialization", "status"].forEach((field) => {
      if (data[field] !== initialData[field]) {
        payload[field] = data[field];
      }
    });

    if (Object.keys(payload).length === 0) {
      setError("No changes detected.");
      return;
    }

    try {
      await axios.patch(`/api/teachers/${id}`, payload);
      onClose();
    } catch (err) {
      console.log("Backend error:", err.response?.data);
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Teacher</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box textAlign="center" my={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField
              fullWidth
              label="Username"
              margin="normal"
              {...register("username", { required: "Username is required" })}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              fullWidth
              label="First Name"
              margin="normal"
              {...register("first_name", { required: "First name is required" })}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
            />
            <TextField
              fullWidth
              label="Last Name"
              margin="normal"
              {...register("last_name")}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
            />
            <TextField
              fullWidth
              label="Phone"
              margin="normal"
              {...register("phone", { required: "Phone is required" })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
            <TextField
              fullWidth
              label="Subject Specialization"
              margin="normal"
              {...register("subject_specialization", { required: "Subject is required" })}
              error={!!errors.subject_specialization}
              helperText={errors.subject_specialization?.message}
            />
            <TextField
              fullWidth
              label="Status"
              margin="normal"
              {...register("status", { required: true })}
              error={!!errors.status}
              helperText={errors.status?.message}
            />
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained">Update</Button>
            </DialogActions>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditTeacherForm;
