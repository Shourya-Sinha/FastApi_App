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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { CreateTaskSlice, DeleteTask, EditExistingTask, GetAllTaskFunction, MakeTaskCompleted } from "../Redux/Slices/TaskSlice";
import { useNavigate } from "react-router-dom";
const sortOptions = [
  { label: "Title (A-Z)", value: "title" },
  { label: "Created Date", value: "createdAt" },
  { label: "Title Length", value: "titleLength" },
];

const TaskCard = ({ task, onEdit,onDelete,onComplete }) => {
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
        alignItems: "center",
        p: 2,
        mb: 2,
        borderRadius: 3,
        boxShadow: 4,
        background: task.completed
          ? "linear-gradient(135deg, #9be15d 0%, #00e3ae 100%)"
          : "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
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
        <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.2)" }} />
        <Typography variant="caption">
          Created: {task.createdAt} | Updated: {task.updatedAt}
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
          checked={task.completed}
          sx={{
            color: "#fff",
            "&.Mui-checked": {
              color: "#fff",
            },
            transform: "scale(1.5)",
          }}
          onClick={() => onComplete(task.id)}
        />
        <IconButton sx={{ color: "#fff" }} onClick={() => onEdit(task)}>
          <EditIcon />
        </IconButton>
        <IconButton sx={{ color: "#fff" }} onClick={()=> onDelete(task.id)} >
          <DeleteIcon color="error" />
        </IconButton>
      </Box>
    </Card>
  );
};

const HomePage = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading, error } = useSelector((state) => state.task);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    createdAt: "",
    expireAt: "",
  });

  const [taskList, setTaskList] = useState(tasks);
  const filteredTasks = taskList
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "createdAt")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "titleLength") return a.title.length - b.title.length;
      return 0;
    });

  const handleDialogClose = () => {
    setOpenDialog(false);
    setNewTask({ title: "", description: "", createdAt: "", expireAt: "" });
  };

  const handleCreateTask = () => {
    // console.log("created task data in page",newTask);
    dispatch(CreateTaskSlice(newTask));
    handleDialogClose();
  };

  const handleEditClick = (task) => {
    setEditingTask({ ...task }); // no need to copy _id to id
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    dispatch(EditExistingTask(editingTask, editingTask.id)); // ✅ Pass correct _id here
    setEditDialogOpen(false);
  };
  
  useEffect(() => {
    dispatch(GetAllTaskFunction());
  }, [dispatch]);

  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

const handleDeleteTask=(id)=>{
  dispatch(DeleteTask(id));
}

const handleCompleteTask = (id)=>{
  dispatch(MakeTaskCompleted(id))
}

  return (
    <Box sx={{ p: 4, background: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        📝 All Tasks
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Search Bar */}
        <Box sx={{ flexGrow: 1, minWidth: "220px", flexBasis: "70%" }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Search by Title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Sort Dropdown */}
        <Box sx={{ minWidth: "140px" }}>
          <TextField
            label="Sort by"
            select
            size="small"
            fullWidth
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* New Task Button */}
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ whiteSpace: "nowrap" }}
          >
            New Task
          </Button>
        </Box>
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
              <TaskCard task={task} onEdit={handleEditClick} onDelete={handleDeleteTask} onComplete={handleCompleteTask} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog Form */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <TextField
            label="Description"
            multiline
            rows={3}
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
          <TextField
            label="Created At"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={newTask.createdAt}
            onChange={(e) =>
              setNewTask({ ...newTask, createdAt: e.target.value })
            }
          />
          <TextField
            label="Expire At"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={newTask.expireAt}
            onChange={(e) =>
              setNewTask({ ...newTask, expireAt: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleCreateTask} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog  */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
      >
        <DialogTitle>Edit Task</DialogTitle>
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
            label="Expire At"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={editingTask?.expireAt || ""}
            onChange={(e) =>
              setEditingTask({ ...editingTask, expireAt: e.target.value })
            }
          />
          <TextField
            label="updated At"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={editingTask?.updatedAt || ""}
            onChange={(e) =>
              setEditingTask({ ...editingTask, updatedAt: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomePage;
