import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { TosService } from '@shared/services/tos-service/tos.service';
import { GetTermsOfServiceResponse } from '@shared/services/tos-service/tos.service.types';

import { TosState } from './tos.types';

const initialState: TosState = {
	updatedAt: undefined,
};

export const getTosAction = createAsyncThunk<
	GetTermsOfServiceResponse,
	undefined,
	{ rejectValue: string }
>('tos', async (_, thunkApi) => {
	try {
		const response = await TosService.getTos();
		return response as GetTermsOfServiceResponse;
	} catch (error) {
		return thunkApi.rejectWithValue(error as string);
	}
});

export const tosSlice = createSlice({
	name: 'tos',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// Check login
		builder
			.addCase(getTosAction.pending, (state) => {
				state.updatedAt = undefined;
			})
			.addCase(getTosAction.fulfilled, (state, action) => {
				state.updatedAt = action.payload?.updatedAt.updated_at;
			})
			.addCase(getTosAction.rejected, (state) => {
				state.updatedAt = undefined;
			});
	},
});
