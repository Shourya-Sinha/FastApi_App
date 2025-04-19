import React from "react";
import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
const DashboardLayout = () => {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <Box
        sx={{
          flex: 1,
          overflow: "hidden", // prevent entire page from scrolling
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflowY: "auto", // scroll only this area if content overflows
              pt: "calc(var(--template-frame-height, 0px) + 8rem)",
            }}
          >
            <Outlet />
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default DashboardLayout;
