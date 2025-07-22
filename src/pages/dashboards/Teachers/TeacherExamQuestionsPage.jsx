// src/pages/dashboards/ExamQuestionsPage.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
  Button,
  Modal,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import axios from "../../../api/axios";

const TeacherExamQuestionsPage = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ text: "", correct_option: 1 });

  const [modalOpen, setModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correct_option: 1,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [examRes, questionRes] = await Promise.all([
        axios.get(`/api/exams`),
        axios.get(`/api/exams/${examId}/questions`),
      ]);
      const examObj = examRes.data.results.find((e) => e.id === parseInt(examId));
      setExam(examObj);
      setQuestions(questionRes.data || []);
    } catch (err) {
      setError("Failed to load exam/questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [examId]);

  const handleDelete = async (qid) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await axios.delete(`/api/questions/${qid}`);
      setQuestions((prev) => prev.filter((q) => q.id !== qid));
    } catch {
      alert("Delete failed.");
    }
  };

  const handleEdit = (q) => {
    setEditId(q.id);
    setEditForm({
  text: q.text,
  option1: q.option1,
  option2: q.option2,
  option3: q.option3,
  option4: q.option4,
  correct_option: q.correct_option,
});

  };

  const handleUpdate = async (qid) => {
    try {
      await axios.patch(`/api/questions/${qid}`, editForm);
      setEditId(null);
      fetchData();
    } catch {
      alert("Update failed.");
    }
  };

  const handleAddNew = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/questions", { ...newQuestion, exam: examId });
      setModalOpen(false);
      setNewQuestion({
        text: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correct_option: 1,
      });
      fetchData();
    } catch {
      alert("Failed to add question.");
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 6 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Manage Questions – {exam?.title}
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell>Correct Option</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>No questions yet.</TableCell>
              </TableRow>
            ) : (
              questions.map((q) => (
                <TableRow key={q.id}>
  <TableCell colSpan={3}>
    {editId === q.id ? (
      <Box>
        <TextField
          label="Question"
          fullWidth
          value={editForm.text}
          onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
          margin="dense"
        />
        {[1, 2, 3, 4].map((i) => (
          <TextField
            key={i}
            label={`Option ${i}`}
            fullWidth
            value={editForm[`option${i}`]}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                [`option${i}`]: e.target.value,
              })
            }
            margin="dense"
          />
        ))}
        <TextField
          label="Correct Option (1-4)"
          type="number"
          fullWidth
          inputProps={{ min: 1, max: 4 }}
          value={editForm.correct_option}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              correct_option: parseInt(e.target.value),
            })
          }
          margin="dense"
        />
        <Box mt={1}>
          <Button
            size="small"
            variant="contained"
            onClick={() => handleUpdate(q.id)}
          >
            Save
          </Button>
          <Button
            size="small"
            color="secondary"
            onClick={() => setEditId(null)}
            sx={{ ml: 1 }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    ) : (
      <Box>
        <strong>{q.text}</strong>
        <ul style={{ paddingLeft: "1.2rem" }}>
          <li>{q.option1}</li>
          <li>{q.option2}</li>
          <li>{q.option3}</li>
          <li>{q.option4}</li>
        </ul>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Correct Option:</strong> Option {q.correct_option}
        </Typography>
      </Box>
    )}
  </TableCell>
  <TableCell>
    {editId !== q.id && (
      <>
        <IconButton onClick={() => handleEdit(q)}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" onClick={() => handleDelete(q.id)}>
          <DeleteIcon />
        </IconButton>
      </>
    )}
  </TableCell>
</TableRow>

              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <Box mt={2} textAlign="right">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
        >
          Add More
        </Button>
      </Box>

      {/* Add Question Modal */}
<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
  <Box
    sx={{
      maxHeight: "90vh",
      overflowY: "auto",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "90%",
      maxWidth: 500,
      bgcolor: "background.paper",
      borderRadius: 2,
      boxShadow: 24,
      p: 4,
    }}
  >
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6">Add New Question</Typography>
      <IconButton onClick={() => setModalOpen(false)}>
        <CloseIcon />
      </IconButton>
    </Box>

    <form onSubmit={handleAddNew}>
      <TextField
        label="Question"
        fullWidth
        required
        value={newQuestion.text}
        onChange={(e) =>
          setNewQuestion({ ...newQuestion, text: e.target.value })
        }
        margin="normal"
      />
      {[1, 2, 3, 4].map((i) => (
        <TextField
          key={i}
          label={`Option ${i}`}
          fullWidth
          required
          value={newQuestion[`option${i}`]}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, [`option${i}`]: e.target.value })
          }
          margin="normal"
        />
      ))}
      <TextField
        label="Correct Option (1-4)"
        type="number"
        inputProps={{ min: 1, max: 4 }}
        fullWidth
        required
        value={newQuestion.correct_option}
        onChange={(e) =>
          setNewQuestion({
            ...newQuestion,
            correct_option: parseInt(e.target.value),
          })
        }
        margin="normal"
      />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Submit
      </Button>
    </form>
  </Box>
</Modal>

    </Container>
  );
};

export default TeacherExamQuestionsPage;
