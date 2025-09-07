import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TasksState, Task } from '@/types';

interface CreateTaskData {
  title: string;
  description?: string;
  dueDate?: string;
}

interface UpdateTaskData {
  id: string;
  title?: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'done';
  dueDate?: string;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
  selectedTask: null,
};

// Async thunks
export const fetchTasks = createAsyncThunk<
  Task[],
  void,
  { rejectValue: string }
>('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/tasks', {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || 'Failed to fetch tasks');
    }

    return data.tasks;
    } catch {
      return rejectWithValue('Network error occurred');
    }
});

export const createTask = createAsyncThunk<
  Task,
  CreateTaskData,
  { rejectValue: string }
>('tasks/createTask', async (taskData, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || 'Failed to create task');
    }

    return data.task;
    } catch {
      return rejectWithValue('Network error occurred');
    }
});

export const updateTask = createAsyncThunk<
  Task,
  UpdateTaskData,
  { rejectValue: string }
>('tasks/updateTask', async ({ id, ...updateData }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || 'Failed to update task');
    }

    return data.task;
    } catch {
      return rejectWithValue('Network error occurred');
    }
});

export const deleteTask = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('tasks/deleteTask', async (taskId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || 'Failed to delete task');
    }

    return taskId;
    } catch {
      return rejectWithValue('Network error occurred');
    }
});

export const fetchTaskById = createAsyncThunk<
  Task,
  string,
  { rejectValue: string }
>('tasks/fetchTaskById', async (taskId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || 'Failed to fetch task');
    }

    return data.task;
    } catch {
      return rejectWithValue('Network error occurred');
    }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTasks: (state) => {
      state.tasks = [];
      state.selectedTask = null;
      state.error = null;
    },
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
    updateTaskFromSocket: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    addTaskFromSocket: (state, action: PayloadAction<Task>) => {
      state.tasks.unshift(action.payload);
    },
    removeTaskFromSocket: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch tasks';
      })
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create task';
      })
      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.selectedTask?._id === action.payload._id) {
          state.selectedTask = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update task';
      })
      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
        if (state.selectedTask?._id === action.payload) {
          state.selectedTask = null;
        }
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete task';
      })
      // Fetch Task by ID
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.selectedTask = action.payload;
        state.error = null;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch task';
      });
  },
});

export const {
  clearError,
  clearTasks,
  setSelectedTask,
  updateTaskFromSocket,
  addTaskFromSocket,
  removeTaskFromSocket,
} = tasksSlice.actions;
export default tasksSlice.reducer;
