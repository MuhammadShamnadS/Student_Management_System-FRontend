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
  Stack,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ClassIcon from "@mui/icons-material/Class";
import EventIcon from "@mui/icons-material/Event";
import SchoolIcon from "@mui/icons-material/School";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../../../api/axios";

const StudentRegisterForm = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // CSV Upload States
  const [csvOpen, setCsvOpen] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvMessage, setCsvMessage] = useState({ type: "", text: "" });

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
        if (Array.isArray(res.data.results)) setTeachers(res.data.results);
      })
      .catch(() => setTeachers([]));
  }, []);

  const flattenErrors = (errs, parent = "") => {
    let flat = {};
    for (const [k, v] of Object.entries(errs)) {
      const key = parent ? `${parent}.${k}` : k;
      if (Array.isArray(v)) flat[key] = v.join(" ");
      else if (typeof v === "object" && v !== null) flat = { ...flat, ...flattenErrors(v, key) };
    }
    return flat;
  };

  // ✅ Manual Registration
  const onSubmit = async (data) => {
    setError(""); setSuccess("");
    const payload = {
      user: { username: data.username, email: data.email, first_name: data.first_name, last_name: data.last_name, password: data.password },
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
      const errorData = err.response?.data;
      if (typeof errorData === "object") {
        const flatErrors = flattenErrors(errorData);
        for (const [f, msg] of Object.entries(flatErrors)) {
          const field = f.includes("user.") ? f.split(".")[1] : f;
          if (field in data) setFieldError(field, { type: "manual", message: msg });
          else setError((prev) => prev + `${f}: ${msg}\n`);
        }
      } else setError("Registration failed.");
    }
  };

  // ✅ CSV Upload Handler
  const handleCsvUpload = async () => {
    if (!csvFile) {
      setCsvMessage({ type: "error", text: "Please choose a CSV file." });
      return;
    }
    setCsvUploading(true);
    setCsvMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      await axios.post("/api/students/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCsvMessage({ type: "success", text: "Students imported successfully!" });
      setTimeout(() => {
        setCsvOpen(false);
        setCsvFile(null);
        setCsvMessage({ type: "", text: "" });
      }, 1500);
    } catch {
      setCsvMessage({ type: "error", text: "CSV import failed. Please check file format." });
    } finally {
      setCsvUploading(false);
    }
  };

  return (
    <Container maxWidth="md">
  {/* ✅ Sticky Header */}
  <Box
    sx={{
      position: "sticky",
      top: 0,
      zIndex: 10,
      background: "#f8f9fa",
      borderRadius: 2,
      p: 2,
      mb: 3,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    }}
  >
    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/dashboard/students")} variant="outlined">
      Back
    </Button>

    <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
      Register Student
    </Typography>

    <Button variant="contained" startIcon={<UploadFileIcon />} onClick={() => setCsvOpen(true)}>
      Import CSV
    </Button>
  </Box>

  {/* ✅ Form Container */}
  <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
    {error && <Alert severity="error" sx={{ mb: 2, whiteSpace: "pre-line" }}>{error}</Alert>}
    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      
      {/* ✅ Student Details */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          <AssignmentIndIcon color="info" sx={{ mr: 1 }} />
          Student Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Username" {...register("username", { required: "Required" })} error={!!errors.username} helperText={errors.username?.message} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Email" {...register("email", { required: "Required" })} error={!!errors.email} helperText={errors.email?.message} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="First Name" {...register("first_name", { required: "Required" })} error={!!errors.first_name} helperText={errors.first_name?.message} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Last Name" {...register("last_name")} error={!!errors.last_name} helperText={errors.last_name?.message} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth type="password" label="Password" {...register("password", { required: "Required" })} error={!!errors.password} helperText={errors.password?.message} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Phone" {...register("phone", { required: "Required" })} error={!!errors.phone} helperText={errors.phone?.message} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Roll Number" {...register("roll_number", { required: "Required" })} error={!!errors.roll_number} helperText={errors.roll_number?.message} /></Grid>
        </Grid>
      </Paper>

      {/* ✅ Class Info */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          <ClassIcon color="success" sx={{ mr: 1 }} />
          Class Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl maxWidth="300px">
              <InputLabel>Class</InputLabel>
              <Select defaultValue="" {...register("student_class", { required: "Required" })}>
                {Array.from({ length: 12 }, (_, i) => (
                  <MenuItem key={i+1} value={i+1}>Class {i+1}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Division</InputLabel>
              <Select defaultValue="" {...register("division", { required: "Required" })}>
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* ✅ Additional Info */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          <EventIcon color="warning" sx={{ mr: 1 }} />
          Additional Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="date" label="Date of Birth" InputLabelProps={{ shrink: true }} {...register("date_of_birth", { required: "Required" })} error={!!errors.date_of_birth} helperText={errors.date_of_birth?.message} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="date" label="Admission Date" InputLabelProps={{ shrink: true }} {...register("admission_date", { required: "Required" })} error={!!errors.admission_date} helperText={errors.admission_date?.message} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select defaultValue="active" {...register("status")}>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Assign Teacher</InputLabel>
              <Select defaultValue="" {...register("assigned_teacher")}>
                <MenuItem value="">None</MenuItem>
                {teachers.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.user.first_name} {t.user.last_name} ({t.assigned_class})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* ✅ Submit Button */}
      <Button type="submit" variant="contained" size="large" fullWidth startIcon={<SchoolIcon />}>
        Register Student
      </Button>
    </Box>
  </Paper>



      {/* ✅ CSV Upload Dialog */}
      <Dialog open={csvOpen} onClose={() => setCsvOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>Choose a Student CSV File</DialogTitle>
        <DialogContent sx={{ p: 3, textAlign: "center" }}>
          <label htmlFor="csv-file-upload">
            <Box sx={{
              border: "2px dashed #1976d2",
              borderRadius: 2,
              p: 3,
              mb: 2,
              cursor: "pointer",
              "&:hover": { backgroundColor: "#f9f9f9" }
            }}>
              <UploadFileIcon sx={{ fontSize: 50, color: "primary.main" }} />
              <Typography>{csvFile ? csvFile.name : "Click to choose CSV file"}</Typography>
            </Box>
            <input type="file" id="csv-file-upload" accept=".csv" style={{ display: "none" }} onChange={(e) => setCsvFile(e.target.files[0])} />
          </label>

          {csvUploading && <CircularProgress sx={{ mt: 2 }} />}
          {csvMessage.text && (
            <Alert severity={csvMessage.type} sx={{ mt: 2, display: "flex", alignItems: "center" }}>
              {csvMessage.type === "success" ? <CheckCircleIcon /> : <ErrorIcon />}
              <Typography sx={{ ml: 1 }}>{csvMessage.text}</Typography>
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setCsvOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleCsvUpload} variant="contained" disabled={!csvFile || csvUploading}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentRegisterForm;
