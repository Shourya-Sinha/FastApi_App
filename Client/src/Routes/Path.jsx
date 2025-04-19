import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";

import LoadingScreen from "../Components/LoadingScreen";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        { element: <Dashboard replace />, path: "dashboard", index: true },
        { element: <HomePage />, path: "home" },
        { element: <CompletedTaskPage />, path: "completed-task" },
        { element: <TaskDetailPage />, path: "task-detail/:id" },
        { element: <Page404 />, path: "*" },
      ],
    },
    { path: "*", element: <Navigate to={Page404} replace /> },
  ]);
}

const Dashboard = Loadable(lazy(() => import("../Pages/DashBoardPage")));

const HomePage = Loadable(lazy(() => import("../Pages/HomePage")));

const CompletedTaskPage = Loadable(
  lazy(() => import("../Pages/CompletedTask"))
);

const TaskDetailPage = Loadable(lazy(() => import("../Pages/DetailTask")));

const Page404 = Loadable(lazy(() => import("../Components/NotFound")));
