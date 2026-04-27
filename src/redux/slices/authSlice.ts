/**
 * authSlice – manages user authentication state
 * Uses FakeStore API for login/register simulation.
 * Token + user are persisted in localStorage for session continuity.
 */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginCredentials, RegisterData, User } from '../../types';
import { authService } from '../../services/api';

// ─── Async Thunks ──────────────────────────────────────────────────────────────────

/** Login: POST /auth/login → get token, then fetch user by id=1 (FakeStore simulation) */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (creds: LoginCredentials, { rejectWithValue }) => {
    try {
      const { data } = await authService.login(creds);
      // FakeStore always returns token for any valid format; fetch user id=1 as mock
      const userRes = await authService.getUser(1);
      localStorage.setItem('sw_token', data.token);
      localStorage.setItem('sw_user', JSON.stringify(userRes.data));
      return { token: data.token, user: userRes.data as User };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Invalid credentials');
    }
  }
);

/** Register: POST /users → simulate account creation */
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const res = await authService.register(data);
      // Simulate: after register, auto-login returns a mock token
      const mockToken = `mock-token-${res.data.id}`;
      const mockUser: User = {
        id: res.data.id,
        email: data.email,
        username: data.username,
        name: data.name,
        phone: data.phone,
      };
      localStorage.setItem('sw_token', mockToken);
      localStorage.setItem('sw_user', JSON.stringify(mockUser));
      return { token: mockToken, user: mockUser };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

// ─── Helpers ────────────────────────────────────────────────────────────────────────
const loadFromStorage = (): { token: string | null; user: User | null } => {
  try {
    const token = localStorage.getItem('sw_token');
    const user = localStorage.getItem('sw_user');
    return { token, user: user ? JSON.parse(user) : null };
  } catch {
    return { token: null, user: null };
  }
};

// ─── Initial State ─────────────────────────────────────────────────────────────────
const { token, user } = loadFromStorage();

const initialState: AuthState = {
  user,
  token,
  loading: false,
  error: null,
};

// ─── Slice ─────────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('sw_token');
      localStorage.removeItem('sw_user');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Login ──
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    // ── Register ──
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
