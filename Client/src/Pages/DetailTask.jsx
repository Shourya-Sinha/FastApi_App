import React, { useEffect } from 'react';
import { Box, Card, CardContent, Typography, Divider, Chip, Stack, CircularProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UpdateIcon from '@mui/icons-material/Update';
import InfoIcon from '@mui/icons-material/Info';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GetSingleTaskDetails } from '../Redux/Slices/TaskSlice';

const taskDetail = {
  title: 'Build Dashboard UI',
  description: 'Design and implement a responsive dashboard for user task tracking.',
  createdAt: '01-04-2025',
  updatedAt: '04-04-2025',
  completedAt: '06-04-2025',
  isCompleted: true,
};

const DetailTask = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {singleTask,isLoading,error} = useSelector((state)=> state.task);
  useEffect(() => {
    if (id) {
      dispatch(GetSingleTaskDetails(id));
    }
  }, [id]);
  // console.log('task details data',singleTask)

  const {
    title = "N/A",
    description = "N/A",
    createdAt = null,
    updatedAt = null,
    completedAt = null,
    completed: isCompleted = false,
  } = singleTask || {};

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const dateObj = new Date(dateString);
    return `${dateObj.getDate().toString().padStart(2, "0")}-${(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dateObj.getFullYear()}`;
  };

  const totalTimeToComplete = () => {
    if (!createdAt || !completedAt) return "N/A";
    const start = new Date(createdAt);
    const end = new Date(completedAt);
    const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    return `${diff} day${diff !== 1 ? "s" : ""}`;
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(to right, #a1c4fd, #c2e9fb)",
        }}
      >
        <CircularProgress size={70} thickness={5} color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
          color: "error.main",
          background: "linear-gradient(to right, #ffecd2, #fcb69f)",
          px: 3,
        }}
      >
        <BrokenHeartIcon sx={{ fontSize: 80 }} />
        <Typography variant="h5" mt={2}>
          Oops! Task not found 💔
        </Typography>
        <Typography variant="body1">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #ece9e6, #ffffff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 5,
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 700,
          width: "100%",
          borderRadius: 4,
          boxShadow: 6,
          backgroundColor: "#ffffff",
          p: 3,
        }}
      >
        <CardContent>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {title}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" mb={2}>
            {description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <AccessTimeIcon color="primary" />
              <Typography variant="body1">
                <strong>Created At:</strong> {formatDate(createdAt)}
              </Typography>
            </Box>

            {updatedAt && updatedAt !== createdAt && (
              <Box display="flex" alignItems="center" gap={1}>
                <UpdateIcon color="secondary" />
                <Typography variant="body1">
                  <strong>Updated At:</strong> {formatDate(updatedAt)}
                </Typography>
              </Box>
            )}

            {isCompleted && (
              <>
                <Box display="flex" alignItems="center" gap={1}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="body1">
                    <strong>Completed At:</strong> {formatDate(completedAt)}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <InfoIcon sx={{ color: "#FFA500" }} />
                  <Typography variant="body1">
                    <strong>Total Time Taken:</strong> {totalTimeToComplete()}
                  </Typography>
                </Box>
              </>
            )}

            <Chip
              label={isCompleted ? "Completed" : "In Progress"}
              color={isCompleted ? "success" : "warning"}
              variant="outlined"
              sx={{ width: "fit-content", mt: 2 }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DetailTask;
