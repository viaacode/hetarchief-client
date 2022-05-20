import { ApiService } from '@shared/services/api-service';

import { ASSETS_SERVICE_BASE_URL } from './assets.consts';

export class AssetsService {
	public static async uploadFile(file: File): Promise<string> {
		const formData = new FormData();
		formData.append('file', file);

		const headers = {
			'Content-Type': undefined, // Overwrite application/json
		};

		const response: { url: string } = await ApiService.getApi()
			.post(ASSETS_SERVICE_BASE_URL + '/upload', {
				body: formData,
				headers,
			})
			.json();
		return response.url;
	}

	public static async deleteFile(url: string): Promise<void> {
		await ApiService.getApi()
			.delete(ASSETS_SERVICE_BASE_URL + '/delete', {
				body: JSON.stringify({ url }),
			})
			.json();
	}
}
