import { createSlice } from "@reduxjs/toolkit";
import axiosInstances from "../../Axios/AxiosInstance";

const initialState = {
  isLoading: false,
  error: false,
  snackbar: {
    open: false,
    severity: null,
    message: null,
  },
  statsData: {},
  tasks: [],
  completedtask: [],
  singleTask: {},
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    openSnackBar(state, action) {
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },
    CloseSnackBar(state) {
      state.snackbar.open = false;
      state.snackbar.message = null;
      state.snackbar.severity = null;
    },
    updateIsLoading(state, action) {
      state.error = action.payload.error;
      state.isLoading = action.payload.isLoading;
    },
    updateStatsData(state, action) {
      state.statsData = action.payload.statsData;
    },
    updateTaskAfterSuccess: (state, action) => {
      const updatedTask = action.payload.updatedTask;
      const taskId = updatedTask._id || updatedTask.id;
    
      const index = state.tasks.findIndex(
        (task) => task._id === taskId || task.id === taskId
      );
    
      if (index !== -1) {
        state.tasks[index] = { ...updatedTask, _id: taskId };
      }
    },
    GetAllTaskSlice(state, action) {
      state.tasks = action.payload.tasks;
    },
    removeTaskFromState(state, action) {
      const taskId = action.payload;
      state.tasks = state.tasks.filter((task) => task.id !== taskId);
    },
    moveToTaskCompleted(state, action) {
      const updatedTask = action.payload;
      const taskId = updatedTask.id;
      if (!Array.isArray(state.completedtask)) {
        state.completedtask = [];
      }
      console.log("Completed Task Received:", updatedTask);
      state.completedtask.push(updatedTask);
      state.tasks = state.tasks.filter((task) => task.id !== taskId);
    },
    updateSingleTask(state, action) {
      state.singleTask = action.payload.singleTask;
    },
    addNewTask(state,action){
      const newTask = action.payload;
      state.tasks.unshift(newTask);
    },
    setAllCompletedTasks(state, action) {
      state.completedtask = action.payload;
    },
    removeCompletedTask(state, action) {
      const taskId = action.payload;
      state.tasks = state.tasks.filter((task) => task.id !== taskId);
    },
  },
});

export default taskSlice.reducer;
export const {
  openSnackBar,
  CloseSnackBar,
  updateIsLoading,
  updateStatsData,
  updateTaskAfterSuccess,
  GetAllTaskSlice,
  removeTaskFromState,
  moveToTaskCompleted,
  updateSingleTask,
  addNewTask,
  setAllCompletedTasks,
  removeCompletedTask
} = taskSlice.actions;

export const showSnackbar =
  ({ severity, message }) =>
  (dispatch) => {
    dispatch(openSnackBar({ message, severity }));

    setTimeout(() => {
      dispatch(CloseSnackBar());
    }, 4000);
  };

export function GetDashboardStats() {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.get("all-stats");
      dispatch(updateStatsData({ statsData: response.data?.data || {} }));
      const message = response.data?.message || "All Data Found";
      const severity = response.data?.status || "success";
      dispatch(showSnackbar({ message, severity }));
      dispatch(updateIsLoading({ isLoading: false, error: false }));
    } catch (error) {
      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.message || "Nothing Found Something Problem";
      dispatch(updateIsLoading({ isLoading: false, error: true }));
      // Dispatch correct error message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return Promise.reject({ severity, message });
    }
  };
}

export function CreateTaskSlice(formValues) {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.post("/create-task", formValues);
      const newlyTask = response.data?.data;
      const message = response.data?.message || "Task Created Successfully";
      const severity = response.data?.status || "success";
      dispatch(showSnackbar({ message, severity }));
      dispatch(updateIsLoading({ isLoading: false, error: false }));
      if(newlyTask){
        dispatch(addNewTask(newlyTask));
      }
      // return Promise.resolve({ severity, message });
    } catch (error) {
      const severity = error.status || "error";
      const message = error.message || "Something Problem";
      dispatch(updateIsLoading({ isLoading: false, error: true }));
      dispatch(showSnackbar({ severity, message }));
    }
  };
}

export function GetAllTaskFunction() {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.get("/get-all-task");
      dispatch(GetAllTaskSlice({ tasks: response.data.data }));
      const message = response.data?.message || "NO any Data Data Found";
      const severity = response.data?.status || "success";
      dispatch(showSnackbar({ message, severity }));
      dispatch(updateIsLoading({ isLoading: false, error: false }));
    } catch (error) {
      const severity = error.status || "error";
      const message = error.message || "Something Problem";
      dispatch(updateIsLoading({ isLoading: false, error: true }));
      dispatch(showSnackbar({ severity, message }));
      return Promise.reject({ severity, message });
    }
  };
}

export function EditExistingTask(editingTask, id) {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));
    try {
      console.log("editing task data in slice funciton",editingTask,id);
      const response = await axiosInstances.put(
        `/update-task/${id}`,
        editingTask
      );
      
      const message = response.data?.message || "Task Updated Successfully";
      const severity = response.data?.status || "success";
      dispatch(showSnackbar({ message, severity }));
      const updatedTask = response.data?.data;
      dispatch(updateTaskAfterSuccess({ updatedTask }));
      dispatch(updateIsLoading({ isLoading: false, error: false }));
      console.log('edit task in slice fucntion',response.data);
    } catch (error) {
      const severity = error.status || "error";
      const message = error.message || "Something Problem";
      dispatch(updateIsLoading({ isLoading: false, error: true }));
      dispatch(showSnackbar({ severity, message }));
    }
  };
}

export function DeleteTask(id) {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.delete(`/delete-task/${id}`);
      const message = response.data?.message || "Task Deleted Successfully";
      const severity = response.data?.status || "success";
      dispatch(removeTaskFromState(id));
      dispatch(showSnackbar({ message, severity }));
      dispatch(updateIsLoading({ isLoading: false, error: false }));
    } catch (error) {
      const severity = error.status || "error";
      const message = error.message || "Something Problem";
      dispatch(updateIsLoading({ isLoading: false, error: true }));
      dispatch(showSnackbar({ severity, message }));
    }
  };
}

function getLocalFormattedDateTime() {
  const now = new Date();

  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12

  const formattedTime = `${month}-${day}-${year} ${hours}:${minutes} ${ampm}`;
  return formattedTime;
}
export function MakeTaskCompleted(id) {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));
    try {
      const completedAt = getLocalFormattedDateTime();
      const response = await axiosInstances.put(`/complete-task/${id}`, {
        completedAt,
      });
      dispatch(moveToTaskCompleted(response.data.data));
      const message = response.data?.message || "Task Completed Successfully";
      const severity = response.data?.status || "success";
      dispatch(showSnackbar({ message, severity }));
      dispatch(updateIsLoading({ isLoading: false, error: false }));
    } catch (error) {
      const severity = error.status || "error";
      const message = error.message || "Something Problem";
      dispatch(showSnackbar({ severity, message }));
      dispatch(updateIsLoading({ isLoading: false, error: true }));
    }
  };
}

export function GetSingleTaskDetails(id) {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.get(`/get-single-task/${id}`);
      dispatch(updateSingleTask({ singleTask: response.data.data }));
      dispatch(updateIsLoading({ isLoading: false, error: false }));
      const severity = response.data?.status || "success";
      const message = response.data?.message || "Something Problem";
      dispatch(showSnackbar({ severity, message }));
    } catch (error) {
      const severity = error.status || "error";
      const message = error.message || "Something Problem";
      dispatch(showSnackbar({ severity, message }));
      dispatch(updateIsLoading({ isLoading: false, error: true }));
    }
  };
}

export function GetAllCompletedTasks() {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.get("/get-completed-task");
      dispatch(setAllCompletedTasks(response.data?.data ?? []));
      dispatch(updateIsLoading({ isLoading: false, error: false }));
      const severity = response.data?.status || "success";
      const message = response.data?.message || "Something Problem";
      dispatch(showSnackbar({ severity, message }));
    } catch (error) {
      const severity = error.status || "error";
      const message = error.message || "Something Problem";
      dispatch(showSnackbar({ severity, message }));
      dispatch(updateIsLoading({ isLoading: false, error: true }));
    }
  };
}

export function DeleteCompletedTask(id) {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.delete(`/delete-task/${id}`);
      const message = response.data?.message || "Task Deleted Successfully";
      const severity = response.data?.status || "success";
      dispatch(removeCompletedTask(id));
      dispatch(showSnackbar({ message, severity }));
      dispatch(updateIsLoading({ isLoading: false, error: false }));
    } catch (error) {
      const severity = error.status || "error";
      const message = error.message || "Something Problem";
      dispatch(updateIsLoading({ isLoading: false, error: true }));
      dispatch(showSnackbar({ severity, message }));
    }
  };
}
 