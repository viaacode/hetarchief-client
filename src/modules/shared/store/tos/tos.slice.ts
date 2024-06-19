import * as toolkitRaw from '@reduxjs/toolkit';

import { TosService } from '@shared/services/tos-service/tos.service';
import { type GetTermsOfServiceResponse } from '@shared/services/tos-service/tos.service.types';

import { type TosState } from './tos.types';

const initialState: TosState = {
	updatedAt: undefined,
};

export const getTosAction = toolkitRaw.createAsyncThunk<
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

export const tosSlice = toolkitRaw.createSlice({
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
				state.updatedAt = action.payload?.updatedAt;
			})
			.addCase(getTosAction.rejected, (state) => {
				state.updatedAt = undefined;
			});
	},
});
