import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { AuthService } from '../../services/auth-service';
import { User } from '../../types';

import { UserState } from './user.types';

const initialState: UserState = {
	user: null,
	loading: false,
	hasCheckedLogin: false,
	error: null,
};

export const checkLoginAction = createAsyncThunk<User, undefined, { rejectValue: string }>(
	'users/login',
	async (_, thunkApi) => {
		try {
			const response = await AuthService.checkLogin();
			return response?.userInfo as User;
		} catch (error) {
			return thunkApi.rejectWithValue(error as string);
		}
	}
);

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// Check login
		builder
			.addCase(checkLoginAction.pending, (state) => {
				state.hasCheckedLogin = false;
				state.loading = true;
			})
			.addCase(checkLoginAction.fulfilled, (state, action) => {
				state.user = action.payload;
				state.hasCheckedLogin = true;
				state.loading = false;
			})
			.addCase(checkLoginAction.rejected, (state, action) => {
				state.user = null;
				state.hasCheckedLogin = true;
				state.loading = false;
				state.error = action.payload;
			});
	},
});
