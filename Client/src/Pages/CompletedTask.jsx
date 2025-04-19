import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Checkbox,
  Grid,
  Typography,
  Divider,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteCompletedTask,
  GetAllCompletedTasks,
} from "../Redux/Slices/TaskSlice";
import { useNavigate } from "react-router-dom";

const CompletedCard = ({ task, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(`/task-detail/${task.id}`);// navigate to detail page
  };
  return (
    <Card
    onClick={handleCardClick}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        p: 2,
        mb: 2,
        borderRadius: 3,
        boxShadow: 4,
        background: "linear-gradient(135deg, #9be15d 0%, #00e3ae 100%)",
        color: "#fff",
        cursor:'pointer'
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          {task.title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {task.description}
        </Typography>
        <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.3)" }} />
        <Typography variant="caption">
          Created: {task.createdAt} | Completed: {task.completedAt}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Checkbox
          checked
          disabled
          sx={{
            color: "#fff",
            "&.Mui-checked": {
              color: "#fff",
            },
            transform: "scale(1.5)",
          }}
        />
        <IconButton sx={{ color: "#fff" }} onClick={() => onEdit(task)}>
          <EditIcon />
        </IconButton>
        <IconButton sx={{ color: "#fff" }} onClick={() => onDelete(task)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
};

const CompletedTask = () => {
  const dispatch = useDispatch();
  const { completedtask, isLoading, error } = useSelector(
    (state) => state.task
  );
  const [tasks, setTasks] = useState(completedtask || []);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editingTask, setEditingTask] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    dispatch(GetAllCompletedTasks());
  }, [dispatch]);

  useEffect(() => {
    if (completedtask && completedtask.length > 0) {
      setTasks(completedtask);
    }
  }, [completedtask]);

  useEffect(() => {
    if (taskToDelete) {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskToDelete.id)
      );
    }
  }, [taskToDelete]);

  const handleEditClick = (task) => {
    setEditingTask({ ...task });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleSaveEdit = () => {
    const updatedTasks = tasks.map((t) =>
      t.id === editingTask.id
        ? {
            ...editingTask,
            updatedAt: new Date().toISOString().split("T")[0],
          }
        : t
    );
    setTasks(updatedTasks);
    setEditDialogOpen(false);
  };

  const handleConfirmDelete = (id) => {
    dispatch(DeleteCompletedTask(id));
    setDeleteDialogOpen(false);
  };

  const filteredTasks = tasks
    .filter((task) => task?.title?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aValue = new Date(a[sortField]);
      const bValue = new Date(b[sortField]);
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

  console.log("Deleted Task Tasks in page", taskToDelete?.id);
  return (
    <Box sx={{ p: 4, background: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        ✅ Completed Tasks
      </Typography>

      {/* Header Row */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: "220px", flexBasis: "70%" }}>
          <TextField
            fullWidth
            placeholder="Search by title"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={{ minWidth: "140px" }}>
          <TextField
            select
            label="Sort by"
            size="small"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <MenuItem value="createdAt">Created At</MenuItem>
            <MenuItem value="completedAt">Completed At</MenuItem>
          </TextField>
        </Box>
        <TextField
          select
          label="Order"
          size="small"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </TextField>
      </Box>

      {isLoading ? (
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            mt: 8,
            p: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg, #f0f4ff, #e0e7ff)",
            boxShadow: 3,
          }}
        >
          <CircularProgress size={60} thickness={5} sx={{ color: "#3f51b5" }} />
          <Typography
            variant="h6"
            mt={3}
            fontWeight="bold"
            color="primary"
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={1}
          >
            ⏳ Loading Tasks...
          </Typography>
          <Typography variant="body2" color="textSecondary" mt={1}>
            Please hang tight while we fetch your tasks 🛠️📋
          </Typography>
        </Box>
      ) : error ? (
        <Box
          width="100%"
          textAlign="center"
          mt={6}
          p={4}
          borderRadius={4}
          sx={{
            backgroundColor: "#ffe5e5",
            color: "#b00020",
            boxShadow: 3,
          }}
        >
          <Typography variant="h1" fontSize="4rem" mb={1}>
            💔
          </Typography>
          <Typography variant="h5" fontWeight="bold" mb={1}>
            Oops! Something went wrong
          </Typography>
          <Typography variant="body1" fontStyle="italic">
            {error}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredTasks.map((task) => (
            <Grid size={{ xs: 12, lg: 6, md: 6, sm: 6 }} key={task.id}>
              <CompletedCard
                task={task}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
      >
        <DialogTitle>Edit Completed Task</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Title"
            value={editingTask?.title || ""}
            onChange={(e) =>
              setEditingTask({ ...editingTask, title: e.target.value })
            }
          />
          <TextField
            label="Description"
            multiline
            rows={3}
            value={editingTask?.description || ""}
            onChange={(e) =>
              setEditingTask({ ...editingTask, description: e.target.value })
            }
          />
          <TextField
            label="Created At"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={editingTask?.createdAt || ""}
            onChange={(e) =>
              setEditingTask({ ...editingTask, createdAt: e.target.value })
            }
          />
          <TextField
            label="Completed At"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={editingTask?.completedAt || ""}
            onChange={(e) =>
              setEditingTask({ ...editingTask, completedAt: e.target.value })
            }
          />
          <Box>
            <Checkbox
              checked={!!editingTask?.completedAt}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  completedAt: e.target.checked
                    ? new Date().toISOString().split("T")[0]
                    : "",
                })
              }
            />
            Mark as Completed
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <Typography>
            Do you really want to delete "{taskToDelete?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleConfirmDelete(taskToDelete?.id)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompletedTask;
