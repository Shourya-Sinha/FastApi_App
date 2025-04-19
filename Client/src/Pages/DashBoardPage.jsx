import React, { useEffect } from "react";
import { Box, Card, Typography, Container, Grid, CircularProgress } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import TodayIcon from "@mui/icons-material/Today";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PlaylistAddCheckCircleIcon from "@mui/icons-material/PlaylistAddCheckCircle";
import { useDispatch, useSelector } from "react-redux";
import { GetDashboardStats } from "../Redux/Slices/TaskSlice";

const StatCard = ({ title, value, icon, gradient,isLoading  }) => {
  const isValueValid = typeof value === "number" && !isNaN(value);
  return (
    <Card
      sx={{
        background: gradient,
        color: "white",
        borderRadius: 4,
        boxShadow: 6,
        display: "flex",
        alignItems: "center",
        px: 3,
        py: 2,
        width: "100%",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.03)",
        },
      }}
    >
      <Box sx={{ mr: 2, display: "flex", alignItems: "center", fontSize: 32 }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4" fontWeight="bold">
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : isValueValid ? (
            value
          ) : (
            "N/A"
          )}
        </Typography>
      </Box>
    </Card>
  );
};

const DashBoardPage = () => {
  const dispatch = useDispatch();
  const { statsData, isLoading } = useSelector((state) => state.task);
  // console.log("stats data in page", statsData);

  useEffect(() => {
    dispatch(GetDashboardStats());
  }, [dispatch]);

  const statCardsData = [
    {
      title: "Total Tasks",
      value: statsData?.total_tasks || 0,
      icon: <PlaylistAddCheckCircleIcon />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Today's Tasks",
      value: statsData?.total_today_tasks || 0,
      icon: <TodayIcon />,
      gradient: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
    },
    {
      title: "Completed",
      value: statsData?.total_completed_tasks || 0,
      icon: <TaskAltIcon />,
      gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    },
    {
      title: "Expiring Soon",
      value: statsData?.total_coming_to_expire_tasks || 0,
      icon: <AccessTimeIcon />,
      gradient: "linear-gradient(135deg, #f953c6 0%, #b91d73 100%)",
    },
    {
      title: "Active Tasks",
      value: statsData?.total_active_tasks || 0,
      icon: <PendingActionsIcon />, // you can change icon here
      gradient: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ px: 3, py: 4, width: "100%", height: "100%" }}>
        <Typography variant="h4" mb={4} fontWeight="bold">
          Welcome to TaskNest Dashboard 🏠
        </Typography>
        <Grid container spacing={4}>
          {statCardsData.map((card, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 6 }} key={index}>
              <StatCard {...card} isLoading={isLoading} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default DashBoardPage;
