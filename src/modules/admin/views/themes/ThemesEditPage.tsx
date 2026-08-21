import { Permission } from '@account/const';
import ThemeThumbnailInput from '@admin/components/ThemeThumbnailInput/ThemeThumbnailInput';
import {
	parseSchemaIdentifiers,
	THEME_DESCRIPTION_MAX_LENGTH,
	THEME_VALIDATION_SCHEMA,
	ThemeIeObjectsTableColumns,
	ThemeIeObjectsTablePageSize,
} from '@admin/const/Themes.const';
import { AdminLayout } from '@admin/layouts';
import { ContentPicker, type PickerItem } from '@meemoo/admin-core-ui/admin';
import {
	Box,
	Button,
	FormControl,
	PaginationBar,
	Table,
	TextArea,
	TextInput,
} from '@meemoo/react-components';
import { ConfirmationModal } from '@shared/components/ConfirmationModal';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Loading } from '@shared/components/Loading';
import { getDefaultPaginationBarProps } from '@shared/components/PaginationBar/PaginationBar.consts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { sortingIcons } from '@shared/components/Table';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { goBrowserBackWithFallback } from '@shared/helpers/go-browser-back-with-fallback';
import { tHtml, tText } from '@shared/helpers/translate';
import { validateFile } from '@shared/helpers/validate-file';
import { validateForm } from '@shared/helpers/validate-form';
import { useGetThemeIeObjects } from '@shared/hooks/use-get-theme-ie-objects/use-get-theme-ie-objects';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import {
	AddIeObjectResult,
	type AddIeObjectsResultItem,
	type ThemeFormValues,
	type ThemeIeObject,
	ThemesService,
} from '@shared/services/themes-service';
import { toastService } from '@shared/services/toast-service';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import { kebabCase } from 'es-toolkit/compat';
import { useRouter } from 'next/router';
import React, { type FC, useEffect, useRef, useState } from 'react';

import styles from './ThemesEditPage.module.scss';

const EMPTY_FORM_VALUES: ThemeFormValues = {
	slug: '',
	nameNl: '',
	nameEn: '',
	descriptionNl: '',
	descriptionEn: '',
	contentPagePathNl: '',
	contentPagePathEn: '',
	imageUrl: null,
	file: null,
};

const labelKeys = {
	slug: 'ThemesEditPage__slug',
	nameNl: 'ThemesEditPage__nameNl',
	nameEn: 'ThemesEditPage__nameEn',
	descriptionNl: 'ThemesEditPage__descriptionNl',
	descriptionEn: 'ThemesEditPage__descriptionEn',
	contentPagePathNl: 'ThemesEditPage__contentPagePathNl',
	contentPagePathEn: 'ThemesEditPage__contentPagePathEn',
	file: 'ThemesEditPage__file',
	addIeObjects: 'ThemesEditPage__addIeObjects',
};

type ThemeFormErrors = Partial<Record<keyof ThemeFormValues, string | undefined>>;

/**
 * A theme detail page is stored as the bare content page path, which is all the ContentPicker needs
 * to preselect it. The path doubles as the label: the stored theme carries no page title, so until
 * the admin opens the dropdown the path itself is the only thing we can show.
 */
const asPickerItem = (path: string | null): PickerItem | null =>
	path ? { type: AvoCoreContentPickerType.CONTENT_PAGE, value: path, label: path } : null;

interface ThemesEditPageProps {
	/** Undefined when creating a new theme */
	id?: string;
}

export const ThemesEditPage: FC<DefaultSeoInfo & ThemesEditPageProps> = ({
	url,
	canonicalUrl,
	id,
}) => {
	const locale = useLocale();
	const router = useRouter();
	const isCreate = !id;

	const [formValues, setFormValues] = useState<ThemeFormValues>(EMPTY_FORM_VALUES);
	const [formErrors, setFormErrors] = useState<ThemeFormErrors>({});
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const [ieObjectsPage, setIeObjectsPage] = useState<number>(1);
	const [identifiersInput, setIdentifiersInput] = useState<string>('');
	const [ieObjectToRemove, setIeObjectToRemove] = useState<ThemeIeObject | null>(null);

	// There is no GET /themes/:id; this endpoint returns the theme plus a page of its objects
	const {
		data: theme,
		isLoading,
		refetch: refetchTheme,
	} = useGetThemeIeObjects(
		{
			themeId: id as string,
			page: Math.max(0, ieObjectsPage - 1),
			size: ThemeIeObjectsTablePageSize,
		},
		!isCreate
	);

	/**
	 * Hydrate the form exactly once per theme, guarded by the id.
	 *
	 * The query behind `theme` refetches on every page change of the linked objects table, after
	 * linking or unlinking an object and on window focus. Without this guard each of those would
	 * copy the stored values back over whatever the admin had typed but not saved yet.
	 */
	const hydratedThemeIdRef = useRef<string | null>(null);

	/**
	 * A slug that is already stored, or that the admin typed in themselves, is never overwritten by
	 * the name. Emptying the slug field hands control back to the name.
	 */
	const hasOwnSlugRef = useRef<boolean>(false);

	useEffect(() => {
		if (!theme || hydratedThemeIdRef.current === theme.id) {
			return;
		}
		hydratedThemeIdRef.current = theme.id;
		hasOwnSlugRef.current = Boolean(theme.slug);
		setFormValues((previous) => ({
			...previous,
			slug: theme.slug ?? '',
			nameNl: theme.nameNl ?? '',
			nameEn: theme.nameEn ?? '',
			descriptionNl: theme.descriptionNl ?? '',
			descriptionEn: theme.descriptionEn ?? '',
			contentPagePathNl: theme.contentPagePathNl ?? '',
			contentPagePathEn: theme.contentPagePathEn ?? '',
			imageUrl: previous.file ? previous.imageUrl : theme.imageUrl,
		}));
	}, [theme]);

	const updateValue = <K extends keyof ThemeFormValues>(
		key: K,
		value: ThemeFormValues[K]
	): void => {
		if (key === 'slug') {
			hasOwnSlugRef.current = Boolean(value);
		}
		setFormValues((previous) => ({
			...previous,
			slug: key === 'nameNl' && !hasOwnSlugRef.current ? kebabCase(value as string) : previous.slug,
			[key]: value,
		}));
		setFormErrors((previous) => ({ ...previous, [key]: undefined }));
	};

	const onFileSelected = (file: File): void => {
		const fileError = validateFile(file);
		if (fileError) {
			setFormErrors((previous) => ({ ...previous, file: fileError.file }));
			return;
		}
		setFormErrors((previous) => ({ ...previous, file: undefined, imageUrl: undefined }));
		setFormValues((previous) => ({
			...previous,
			file,
			// Local preview until the theme is saved and the proxy returns a hosted url
			imageUrl: URL.createObjectURL(file),
		}));
	};

	const onCancel = (): void => {
		goBrowserBackWithFallback(ROUTES_BY_LOCALE[locale].adminThemes, router);
	};

	const onSave = async (): Promise<void> => {
		const errors = await validateForm(formValues, THEME_VALIDATION_SCHEMA());
		if (errors) {
			setFormErrors(errors as ThemeFormErrors);
			return;
		}

		setIsSaving(true);
		try {
			if (isCreate) {
				const created = await ThemesService.create(formValues);
				toastService.notify({
					title: tHtml('modules/admin/views/themes/themes-edit-page___het-thema-is-aangemaakt'),
					description: tHtml(
						'modules/admin/views/themes/themes-edit-page___je-kan-nu-objecten-koppelen-aan-dit-thema'
					),
				});
				// Continue on the edit page of the new theme, so objects can be linked right away
				await router.push(ROUTES_BY_LOCALE[locale].adminThemeEdit.replace(':id', created.id));
				return;
			}

			await ThemesService.update(id as string, formValues);
			// The form no longer re-hydrates on a refetch, so swap the local preview for the hosted
			// url the proxy just returned
			const { data: saved } = await refetchTheme();
			setFormValues((previous) => ({
				...previous,
				file: null,
				imageUrl: saved?.imageUrl ?? previous.imageUrl,
			}));
			toastService.notify({
				title: tHtml(
					'modules/admin/views/themes/themes-edit-page___de-aanpassingen-zijn-opgeslagen'
				),
				description: tHtml(
					'modules/admin/views/themes/themes-edit-page___de-aanpassingen-aan-het-thema-zijn-opgeslagen'
				),
			});
		} catch (err) {
			console.error(err);
			toastService.notify({
				title: tHtml('modules/admin/views/themes/themes-edit-page___error'),
				description: tHtml(
					'modules/admin/views/themes/themes-edit-page___het-opslaan-van-het-thema-is-mislukt'
				),
			});
		} finally {
			setIsSaving(false);
		}
	};

	const getResultMessage = ({ schemaIdentifier, result }: AddIeObjectsResultItem) => {
		const messages = {
			[AddIeObjectResult.added]: tText('modules/admin/views/themes/themes-edit-page___toegevoegd', {
				objectId: schemaIdentifier,
			}),
			[AddIeObjectResult.alreadyLinked]: tText(
				'modules/admin/views/themes/themes-edit-page___was-al-gekoppeld',
				{
					objectId: schemaIdentifier,
				}
			),
			[AddIeObjectResult.notFound]: tText(
				'modules/admin/views/themes/themes-edit-page___niet-gevonden',
				{
					objectId: schemaIdentifier,
				}
			),
		};

		return <li key={`add-result--${schemaIdentifier}--${result}`}>{messages[result]}</li>;
	};

	const onAddIeObjects = async (): Promise<void> => {
		const schemaIdentifiers = parseSchemaIdentifiers(identifiersInput);
		if (!schemaIdentifiers.length) {
			return;
		}

		try {
			const results = await ThemesService.addIeObjects(id as string, schemaIdentifiers);
			setIdentifiersInput('');

			toastService.notify(
				{
					title: tHtml('modules/admin/views/themes/themes-edit-page___success'),
					description: <ul>{results.map(getResultMessage)}</ul>,
					maxLines: -1,
					className: styles['p-admin-themes-edit__add-results'],
				},
				{
					style: {
						width: '65rem',
					},
				}
			);
			await refetchTheme();
		} catch (err) {
			console.error(err);
			toastService.notify({
				title: tHtml('modules/admin/views/themes/themes-edit-page___error'),
				description: tHtml(
					'modules/admin/views/themes/themes-edit-page___het-koppelen-van-de-objecten-is-mislukt'
				),
			});
		}
	};

	const onRemoveIeObjectConfirmed = async (): Promise<void> => {
		if (!ieObjectToRemove?.schemaIdentifier) {
			setIeObjectToRemove(null);
			return;
		}

		try {
			await ThemesService.deleteIeObject(id as string, ieObjectToRemove.schemaIdentifier);
			setIeObjectToRemove(null);
			toastService.notify({
				title: tHtml('modules/admin/views/themes/themes-edit-page___success'),
				description: tHtml(
					'modules/admin/views/themes/themes-edit-page___het-loskoppelen-van-het-object-is-geslaagd'
				),
			});
			await refetchTheme();
		} catch (err) {
			console.error(err);
			setIeObjectToRemove(null);
			toastService.notify({
				title: tHtml('modules/admin/views/themes/themes-edit-page___error'),
				description: tHtml(
					'modules/admin/views/themes/themes-edit-page___het-loskoppelen-van-het-object-is-mislukt'
				),
			});
		}
	};

	const renderTextField = (key: 'slug' | 'nameNl' | 'nameEn', label: string, suffix?: string) => (
		<FormControl
			className={styles['p-admin-themes-edit__form-control']}
			errors={[<RedFormWarning error={formErrors[key]} key={`form-error--${key}`} />]}
			id={labelKeys[key]}
			label={label}
			suffix={suffix}
		>
			<TextInput
				id={labelKeys[key]}
				ariaLabel={label}
				value={formValues[key] ?? ''}
				onChange={(event) => updateValue(key, event.currentTarget.value)}
			/>
		</FormControl>
	);

	const renderDescriptionField = (key: 'descriptionNl' | 'descriptionEn', label: string) => (
		<FormControl
			className={styles['p-admin-themes-edit__form-control']}
			errors={[<RedFormWarning error={formErrors[key]} key={`form-error--${key}`} />]}
			id={labelKeys[key]}
			label={`${label} (${(formValues[key] ?? '').length} / ${THEME_DESCRIPTION_MAX_LENGTH})`}
		>
			<TextArea
				id={labelKeys[key]}
				ariaLabel={label}
				value={formValues[key] ?? ''}
				maxLength={THEME_DESCRIPTION_MAX_LENGTH}
				onChange={(event) => updateValue(key, event.currentTarget.value)}
			/>
		</FormControl>
	);

	const renderContentPagePathField = (
		key: 'contentPagePathNl' | 'contentPagePathEn',
		label: string,
		placeholder: string
	) => (
		<FormControl
			className={styles['p-admin-themes-edit__form-control']}
			errors={[<RedFormWarning error={formErrors[key]} key={`form-error--${key}`} />]}
			id={labelKeys[key]}
			label={label}
		>
			<ContentPicker
				// A theme detail page is always a content page, so the type dropdown would only ever
				// hold one option. The target switch is equally moot: the link is internal and opens
				// in the same tab.
				allowedTypes={[AvoCoreContentPickerType.CONTENT_PAGE]}
				hideTypeDropdown
				hideTargetSwitch
				value={asPickerItem(formValues[key])}
				// ContentPicker takes no id or aria-label and reuses its placeholder as the select's
				// accessible name, so this doubles as both. The NL and EN placeholders differ on
				// purpose: two comboboxes sharing one name is ambiguous for screen readers.
				placeholder={placeholder}
				// Only the path is stored; clearing the picker empties the field
				onChange={(item) => updateValue(key, item?.value ?? '')}
			/>
		</FormControl>
	);

	const renderLinkedObjects = () => {
		const ieObjects = theme?.ieObjects || [];
		const total = theme?.total || 0;

		return (
			<Box className={styles['p-admin-themes-edit__box']}>
				<h3>{tHtml('modules/admin/views/themes/themes-edit-page___gekoppelde-objecten')}</h3>
				<p className={styles['p-admin-themes-edit__subtitle']}>
					{tHtml('modules/admin/views/themes/themes-edit-page___aantal-objecten-gekoppeld', {
						count: total,
					})}
				</p>

				<FormControl
					className={styles['p-admin-themes-edit__form-control']}
					id={labelKeys.addIeObjects}
					label={tHtml('modules/admin/views/themes/themes-edit-page___objecten-toevoegen')}
					suffix={tText(
						'modules/admin/views/themes/themes-edit-page___identifier-van-het-object-meerdere-komma-gescheiden'
					)}
				>
					<div className={styles['p-admin-themes-edit__add-objects']}>
						<TextInput
							id={labelKeys.addIeObjects}
							ariaLabel={tText(
								'modules/admin/views/themes/themes-edit-page___identifiers-van-objecten-om-te-koppelen'
							)}
							value={identifiersInput}
							onChange={(event) => setIdentifiersInput(event.currentTarget.value)}
						/>
						<Button
							label={tText('modules/admin/views/themes/themes-edit-page___toevoegen')}
							disabled={!parseSchemaIdentifiers(identifiersInput).length}
							onClick={onAddIeObjects}
						/>
					</div>
				</FormControl>

				<Table<ThemeIeObject>
					className="u-mt-24"
					options={{
						columns: ThemeIeObjectsTableColumns(setIeObjectToRemove),
						data: ieObjects,
						initialState: {
							pagination: { pageIndex: 0, pageSize: ThemeIeObjectsTablePageSize },
						},
					}}
					sortingIcons={sortingIcons}
					showTable={!!ieObjects.length}
					pagination={(table) => (
						<PaginationBar
							{...getDefaultPaginationBarProps()}
							itemsPerPage={ThemeIeObjectsTablePageSize}
							startItem={Math.max(0, ieObjectsPage - 1) * ThemeIeObjectsTablePageSize}
							totalItems={total}
							onPageChange={(pageZeroBased) => {
								table.setPageIndex(pageZeroBased);
								setIeObjectsPage(pageZeroBased + 1);
							}}
						/>
					)}
				/>

				{!ieObjects.length && (
					<p className="u-color-neutral u-py-24">
						{tHtml(
							'modules/admin/views/themes/themes-edit-page___er-zijn-nog-geen-objecten-gekoppeld'
						)}
					</p>
				)}
			</Box>
		);
	};

	const renderPageContent = () => {
		if (!isCreate && isLoading) {
			return <Loading fullscreen locationId="ThemesEditPage" />;
		}

		return (
			<AdminLayout
				pageTitle={
					isCreate
						? tText('modules/admin/views/themes/themes-edit-page___thema-aanmaken')
						: tText('modules/admin/views/themes/themes-edit-page___thema-aanpassen')
				}
			>
				<AdminLayout.Actions>
					<Button
						label={tText('modules/admin/views/themes/themes-edit-page___annuleer')}
						variants="text"
						onClick={onCancel}
					/>
					{/* No colour variant: the base button is teal, matching the other admin CRUD pages */}
					<Button
						label={tText('modules/admin/views/themes/themes-edit-page___opslaan')}
						disabled={isSaving}
						onClick={onSave}
					/>
				</AdminLayout.Actions>
				<AdminLayout.Content>
					<div className={`l-container ${styles['p-admin-themes-edit']}`}>
						<Button
							className={styles['p-admin-themes-edit__back']}
							label={tText('modules/admin/views/themes/themes-edit-page___terug')}
							iconStart={<Icon name={IconNamesLight.ArrowLeft} aria-hidden />}
							variants="text"
							onClick={onCancel}
						/>

						<Box className={styles['p-admin-themes-edit__box']}>
							<FormControl
								className={styles['p-admin-themes-edit__form-control']}
								// A rejected file reports on `file`, a missing thumbnail on `imageUrl`
								errors={[
									<RedFormWarning
										error={formErrors.file || formErrors.imageUrl}
										key="form-error--file"
									/>,
								]}
								id={labelKeys.file}
								label={tHtml('modules/admin/views/themes/themes-edit-page___standaard-thumbnail')}
								suffix={tText(
									'modules/admin/views/themes/themes-edit-page___16-9-aanbevolen-640-x-360-px-max-500-kb'
								)}
							>
								<ThemeThumbnailInput
									imageUrl={formValues.imageUrl}
									onFileSelected={onFileSelected}
								/>
							</FormControl>

							<hr className={styles['p-admin-themes-edit__divider']} />

							{renderTextField(
								'nameNl',
								tText('modules/admin/views/themes/themes-edit-page___nl-benaming')
							)}
							{renderTextField(
								'nameEn',
								tText('modules/admin/views/themes/themes-edit-page___en-benaming')
							)}
							{renderTextField(
								'slug',
								tText('modules/admin/views/themes/themes-edit-page___slug'),
								tText(
									'modules/admin/views/themes/themes-edit-page___uniek-kleine-letters-koppeltekens-gebruikt-in-urls'
								)
							)}
							{renderDescriptionField(
								'descriptionNl',
								tText('modules/admin/views/themes/themes-edit-page___nl-beschrijving')
							)}
							{renderDescriptionField(
								'descriptionEn',
								tText('modules/admin/views/themes/themes-edit-page___en-beschrijving')
							)}
							{renderContentPagePathField(
								'contentPagePathNl',
								tText('modules/admin/views/themes/themes-edit-page___url-themadetailpagina-nl'),
								tText(
									'modules/admin/views/themes/themes-edit-page___selecteer-een-nl-content-pagina'
								)
							)}
							{renderContentPagePathField(
								'contentPagePathEn',
								tText('modules/admin/views/themes/themes-edit-page___url-themadetailpagina-en'),
								tText(
									'modules/admin/views/themes/themes-edit-page___selecteer-een-en-content-pagina'
								)
							)}
						</Box>

						{/* Linking needs a theme id, so it only appears once the theme exists */}
						{!isCreate && renderLinkedObjects()}

						<ConfirmationModal
							isOpen={!!ieObjectToRemove}
							onClose={() => setIeObjectToRemove(null)}
							onConfirm={onRemoveIeObjectConfirmed}
							onCancel={() => setIeObjectToRemove(null)}
						/>
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			<SeoTags
				title={
					isCreate
						? tText('modules/admin/views/themes/themes-edit-page___thema-aanmaken')
						: tText('modules/admin/views/themes/themes-edit-page___thema-aanpassen')
				}
				description={tText(
					'modules/admin/views/themes/themes-edit-page___beheer-de-gegevens-en-gekoppelde-objecten-van-een-thema'
				)}
				imgUrl={theme?.imageUrl ?? undefined}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={canonicalUrl}
			/>

			<PermissionsCheck anyPermissions={[Permission.MANAGE_IE_OBJECT_THEMES]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
