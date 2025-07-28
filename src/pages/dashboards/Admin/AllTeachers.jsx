import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Box,
  Pagination,
  Chip,
  useMediaQuery,
  IconButton,
  Tooltip,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import axios from "../../../api/axios";

const AllTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // ✅ Fetch Teachers with Search & Pagination
  const fetchTeachers = async (pageNum = 1, query = "") => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/api/teachers?page=${pageNum}&search=${query}`);
      setTeachers(res.data.results || []);
      setCount(Math.ceil(res.data.count / 5));
    } catch {
      setError("Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Debounce search to avoid multiple API calls
  useEffect(() => {
    const delay = setTimeout(() => fetchTeachers(page, search), 400);
    return () => clearTimeout(delay);
  }, [page, search]);

  // ✅ Delete Teacher
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`/api/teachers/${id}`);
      fetchTeachers(page, search);
    } catch {
      alert("Failed to delete teacher");
    } finally {
      setDeletingId(null);
    }
  };

  // ✅ Export Teachers CSV
  const handleExportCSV = async () => {
    try {
      const res = await axios.get("/api/teachers/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "teachers.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Failed to export teachers");
    }
  };

  // ✅ Error State
  if (error) {
    return <Alert severity="error" sx={{ mt: 4, mx: "auto", maxWidth: 600 }}>{error}</Alert>;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      {/* 🔹 Header */}
      <Box
        sx={{
          background: "linear-gradient(to right, #1976d2, #42a5f5)",
          color: "#fff",
          borderRadius: 3,
          p: 3,
          mb: 3,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          gap: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" display="flex" alignItems="center" gap={1}>
          <PersonIcon fontSize="large" /> All Teachers
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            startIcon={<DownloadIcon />}
            onClick={handleExportCSV}
            variant="outlined"
            sx={{
              backgroundColor: "#fff",
              color: "#1976d2",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#e3f2fd" },
            }}
          >
            Export CSV
          </Button>

          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            component={Link}
            to="/dashboard/register/teacher"
            sx={{
              backgroundColor: "#fff",
              color: "#1976d2",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#e3f2fd" },
            }}
          >
            Register Teacher
          </Button>
        </Stack>
      </Box>

      {/* 🔍 Search Bar */}
      <TextField
        placeholder="Search by name, email, or phone..."
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* 🔹 Teachers Table */}
      <Paper elevation={4} sx={{ p: 2, borderRadius: 3, overflowX: "auto", minHeight: 250 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={150}>
            <CircularProgress />
          </Box>
        ) : (
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                {!isMobile && <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>}
                <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Subject</TableCell>
                {!isMobile && <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>}
                <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center">No teachers found.</TableCell></TableRow>
              ) : (
                teachers.map((teacher) => (
                  <TableRow key={teacher.id} hover>
                    <TableCell>{teacher.user.first_name} {teacher.user.last_name}</TableCell>
                    {!isMobile && <TableCell>{teacher.user.email}</TableCell>}
                    <TableCell>{teacher.phone}</TableCell>
                    <TableCell>{teacher.subject_specialization}</TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Chip label={teacher.status} size="small" variant="outlined" color={teacher.status === "active" ? "success" : "default"} />
                      </TableCell>
                    )}
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="View Students">
                          <IconButton size="small" color="primary" component={Link} to={`/dashboard/teacher/${teacher.id}/students`}>
                            <GroupIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" color="secondary" component={Link} to={`/dashboard/teachers/${teacher.id}/edit`}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDelete(teacher.id)} disabled={deletingId === teacher.id}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* 🔹 Pagination */}
      {count > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={count}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
            shape="rounded"
            size={isMobile ? "small" : "medium"}
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Container>
  );
};

export default AllTeachers;
