import { ApiService } from '@shared/services/api-service';
import type { IPagination } from '@studiohyperdrive/pagination';
import { stringifyUrl } from 'query-string';

import { THEMES_SERVICE_BASE_URL } from './themes.consts';
import type {
	AddIeObjectsResultItem,
	GetThemeIeObjectsProps,
	GetThemesProps,
	Theme,
	ThemeFormValues,
	ThemeWithIeObjects,
} from './themes.types';

export abstract class ThemesService {
	public static async getAll({
		search,
		page,
		size,
		orderProp,
		orderDirection,
	}: GetThemesProps): Promise<IPagination<Theme>> {
		const result = await ApiService.getApi()
			.get(
				stringifyUrl({
					url: THEMES_SERVICE_BASE_URL,
					query: {
						// Matches slug, nameNl and nameEn on the proxy side
						...(search?.trim() ? { searchTerm: search.trim() } : {}),
						...(page && { page }),
						...(size && { size }),
						...(orderProp && { orderProp }),
						...(orderDirection && { orderDirection }),
					},
				})
			)
			.json();

		return result as IPagination<Theme>;
	}

	public static async delete(id: string): Promise<void> {
		await ApiService.getApi().delete(`${THEMES_SERVICE_BASE_URL}/${id}`);
	}

	/**
	 * Load a single theme together with a page of its linked ie-objects.
	 *
	 * There is deliberately no GET /themes/:id on the proxy: this endpoint returns every theme
	 * field plus its objects and their total, so one request feeds the whole edit page.
	 */
	public static async getWithIeObjects({
		themeId,
		page,
		size,
	}: GetThemeIeObjectsProps): Promise<ThemeWithIeObjects> {
		const result = await ApiService.getApi()
			.get(
				stringifyUrl({
					url: `${THEMES_SERVICE_BASE_URL}/${themeId}/ie-objects`,
					query: {
						...(page && { page }),
						...(size && { size }),
					},
				})
			)
			.json();

		return result as ThemeWithIeObjects;
	}

	/**
	 * Both create and update are sent as multipart, so a newly picked thumbnail can travel with the
	 * text fields in one request. Fields are appended when defined -- including empty strings -- so
	 * that clearing a description or a path actually persists.
	 */
	private static toFormData(values: Partial<ThemeFormValues>): FormData {
		const formData = new FormData();

		const appendIfDefined = (key: string, value: string | null | undefined): void => {
			if (value !== undefined && value !== null) {
				formData.append(key, value);
			}
		};

		appendIfDefined('slug', values.slug);
		appendIfDefined('nameNl', values.nameNl);
		appendIfDefined('nameEn', values.nameEn);
		appendIfDefined('descriptionNl', values.descriptionNl);
		appendIfDefined('descriptionEn', values.descriptionEn);
		appendIfDefined('contentPagePathNl', values.contentPagePathNl);
		appendIfDefined('contentPagePathEn', values.contentPagePathEn);

		if (values.file) {
			// The proxy uploads this and sets imageUrl itself, so imageUrl is not sent alongside it
			formData.append('file', values.file);
		}

		return formData;
	}

	public static async create(values: Partial<ThemeFormValues>): Promise<Theme> {
		return ApiService.getApi()
			.post(THEMES_SERVICE_BASE_URL, {
				body: ThemesService.toFormData(values),
				// Overwrite ky's application/json so the browser sets the multipart boundary
				headers: { 'Content-Type': undefined },
			})
			.json();
	}

	public static async update(id: string, values: Partial<ThemeFormValues>): Promise<Theme> {
		return ApiService.getApi()
			.patch(`${THEMES_SERVICE_BASE_URL}/${id}`, {
				body: ThemesService.toFormData(values),
				headers: { 'Content-Type': undefined },
			})
			.json();
	}

	/**
	 * Link one or more ie-objects to a theme by schema identifier. The proxy resolves each
	 * identifier to its entity uri and reports one result per submitted identifier, in order.
	 */
	public static async addIeObjects(
		themeId: string,
		schemaIdentifiers: string[]
	): Promise<AddIeObjectsResultItem[]> {
		return ApiService.getApi()
			.post(`${THEMES_SERVICE_BASE_URL}/${themeId}/ie-objects`, {
				json: { ieObjectSchemaIdentifiers: schemaIdentifiers },
			})
			.json();
	}

	public static async deleteIeObject(themeId: string, schemaIdentifier: string): Promise<void> {
		await ApiService.getApi().delete(
			`${THEMES_SERVICE_BASE_URL}/${themeId}/ie-objects/${schemaIdentifier}`
		);
	}
}
