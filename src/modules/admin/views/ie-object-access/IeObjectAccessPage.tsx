import { GroupName } from '@account/const';
import { useGetIeObjectAccessDebugReport } from '@admin/hooks/get-ie-object-access-debug-report';
import { AdminLayout } from '@admin/layouts';
import { Box, Button, FormControl, RadioButton, TextInput } from '@meemoo/react-components';
import { ErrorNoAccess } from '@shared/components/ErrorNoAccess';
import { Loading } from '@shared/components/Loading';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import type { DefaultSeoInfo } from '@shared/types/seo';
import type { HTTPError } from 'ky';
import React, { type FC, type FormEvent, useEffect, useMemo, useState } from 'react';
import { StringParam, useQueryParams, withDefault } from 'use-query-params';

import styles from './IeObjectAccessPage.module.scss';
import {
	IeObjectAccessDebugErrorCode,
	type IeObjectAccessDebugRequest,
} from './IeObjectAccessPage.types';
import { IeObjectAccessReport } from './IeObjectAccessReport';

/**
 * Undocumented debug page for meemoo admins (/admin/objecten), not linked in the admin navigation.
 * Explains why the platform does or does not show an ie-object to a certain user, and which of its
 * fields that user gets to see. The pid and user are kept in the url, so a report can be shared.
 */

enum CheckAccessFor {
	ME = 'me',
	USER = 'user',
	ANONYMOUS = 'anonymous',
}

const PAGE_TITLE = 'Object access debugger';

const QUERY_PARAM_CONFIG = {
	pid: withDefault(StringParam, ''),
	for: withDefault(StringParam, CheckAccessFor.ME),
	email: withDefault(StringParam, ''),
};

const getErrorMessage = (error: unknown): string => {
	const status = (error as HTTPError)?.response?.status;
	if (status === 403) {
		return 'Only meemoo admins can use this page.';
	}
	if (status === 400) {
		return 'Please enter a single PID (letters and numbers only, eg: qsj38kdw2z).';
	}
	return 'Something went wrong while loading the access report. Please try again later.';
};

const IeObjectAccessPageContent: FC = () => {
	const [queryParams, setQueryParams] = useQueryParams(QUERY_PARAM_CONFIG);
	const [pid, setPid] = useState<string>(queryParams.pid);
	const [checkAccessFor, setCheckAccessFor] = useState<CheckAccessFor>(
		queryParams.for as CheckAccessFor
	);
	const [email, setEmail] = useState<string>(queryParams.email);

	// Keep the form in sync when the url changes, eg: browser back
	useEffect(() => {
		setPid(queryParams.pid);
		setCheckAccessFor(queryParams.for as CheckAccessFor);
		setEmail(queryParams.email);
	}, [queryParams.pid, queryParams.for, queryParams.email]);

	const request: IeObjectAccessDebugRequest | null = useMemo(() => {
		if (!queryParams.pid) {
			return null;
		}
		return {
			schemaIdentifier: queryParams.pid,
			...(queryParams.for === CheckAccessFor.USER && queryParams.email
				? { email: queryParams.email }
				: {}),
			...(queryParams.for === CheckAccessFor.ANONYMOUS ? { anonymous: true } : {}),
		};
	}, [queryParams.pid, queryParams.for, queryParams.email]);

	const { data, isFetching, error } = useGetIeObjectAccessDebugReport(request);

	const onSubmit = (event: FormEvent) => {
		event.preventDefault();
		setQueryParams({
			pid: pid.trim(),
			for: checkAccessFor,
			email: checkAccessFor === CheckAccessFor.USER ? email.trim() : '',
		});
	};

	const isSubmitDisabled = !pid.trim() || (checkAccessFor === CheckAccessFor.USER && !email.trim());

	const renderForm = () => (
		<Box className={styles['p-admin-ie-object-access__form']}>
			<p className={styles['p-admin-ie-object-access__muted']}>
				Explains why hetarchief shows or hides an object for a certain user, and which information
				about the object that user gets to see.
			</p>
			<form onSubmit={onSubmit}>
				<FormControl id="ie-object-access-pid" label="PID of the object" suffix="eg: qsj38kdw2z">
					<TextInput
						id="ie-object-access-pid"
						ariaLabel="PID of the object"
						value={pid}
						onChange={(event) => setPid(event.currentTarget.value)}
					/>
				</FormControl>

				<FormControl id="ie-object-access-for" label="Check what this user can see">
					<div className={styles['p-admin-ie-object-access__radio-buttons']}>
						<RadioButton
							label="Me"
							checked={checkAccessFor === CheckAccessFor.ME}
							onClick={() => setCheckAccessFor(CheckAccessFor.ME)}
						/>
						<RadioButton
							label="Another user (by email address)"
							checked={checkAccessFor === CheckAccessFor.USER}
							onClick={() => setCheckAccessFor(CheckAccessFor.USER)}
						/>
						<RadioButton
							label="An anonymous visitor (not logged in)"
							checked={checkAccessFor === CheckAccessFor.ANONYMOUS}
							onClick={() => setCheckAccessFor(CheckAccessFor.ANONYMOUS)}
						/>
					</div>
				</FormControl>

				{checkAccessFor === CheckAccessFor.USER && (
					<FormControl id="ie-object-access-email" label="Email address of the user">
						<TextInput
							id="ie-object-access-email"
							type="email"
							ariaLabel="Email address of the user"
							value={email}
							onChange={(event) => setEmail(event.currentTarget.value)}
						/>
					</FormControl>
				)}

				<Button type="submit" label="Show access report" disabled={isSubmitDisabled} />
			</form>
		</Box>
	);

	const renderResult = () => {
		if (!request) {
			return null;
		}
		if (isFetching) {
			return <Loading locationId="ie-object-access-debug-report" />;
		}
		if (error) {
			return <p className={styles['p-admin-ie-object-access__error']}>{getErrorMessage(error)}</p>;
		}
		if (data?.errorCode === IeObjectAccessDebugErrorCode.USER_NOT_FOUND) {
			return (
				<p className={styles['p-admin-ie-object-access__error']}>
					No user found with email address "{request.email}".
				</p>
			);
		}
		if (data?.errorCode === IeObjectAccessDebugErrorCode.OBJECT_NOT_FOUND) {
			return (
				<p className={styles['p-admin-ie-object-access__error']}>
					No object found with PID "{request.schemaIdentifier}".
				</p>
			);
		}
		if (!data?.viewer || !data?.report) {
			return null;
		}
		return <IeObjectAccessReport viewer={data.viewer} report={data.report} />;
	};

	return (
		<AdminLayout pageTitle={PAGE_TITLE}>
			<AdminLayout.Content>
				<div className={`${styles['p-admin-ie-object-access']} l-container`}>
					{renderForm()}
					{renderResult()}
				</div>
			</AdminLayout.Content>
		</AdminLayout>
	);
};

export const IeObjectAccessPage: FC<DefaultSeoInfo> = ({ url, canonicalUrl }) => {
	const isMeemooAdmin = useHasAnyGroup(GroupName.MEEMOO_ADMIN);

	return (
		<>
			<SeoTags
				title={PAGE_TITLE}
				description="Explains why an object is or is not visible for a user"
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={canonicalUrl}
			/>

			{/* No permission for this page: PermissionsCheck only waits for the login check here */}
			<PermissionsCheck>
				{isMeemooAdmin ? (
					<IeObjectAccessPageContent />
				) : (
					<ErrorNoAccess
						visitorSpaceSlug={null}
						description="Only meemoo admins can use this page."
					/>
				)}
			</PermissionsCheck>
		</>
	);
};
