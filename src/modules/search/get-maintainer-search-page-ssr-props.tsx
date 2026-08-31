import { MIN_LENGTH_SCHEMA_IDENTIFIER_V2 } from '@ie-objects/ie-objects.consts';
import type { IeObject } from '@ie-objects/ie-objects.types';
import { IeObjectsService } from '@ie-objects/services';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import {
	getIeObjectDetailRedirectDestination,
	getLocalePathPrefix,
} from '@shared/helpers/ie-object-urls';
import { OrganisationService } from '@shared/services/organisation-service/organisation.service';
import type { Organisation } from '@shared/services/organisation-service/organisation.types';
import type { DefaultSeoInfo } from '@shared/types/seo';
import type { Locale } from '@shared/utils/i18n';
import { FILTER_LABEL_VALUE_DELIMITER, SearchFilterId } from '@visitor-space/types';
import type { GetServerSidePropsResult } from 'next';
import type { GetServerSidePropsContext } from 'next/types';
import { stringifyUrl } from 'query-string';

export async function getMaintainerSearchPageServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	const orgSlugOrObjectSchemaIdentifier: string = context.query.slug as string;
	const locale = context.locale as Locale;

	let organisation: Organisation | null = null;
	let showHard404IfNotFound = true;

	try {
		organisation = await OrganisationService.getBySlug(orgSlugOrObjectSchemaIdentifier, false);
		// biome-ignore lint/suspicious/noExplicitAny: we just do not know
	} catch (err: any) {
		if (err?.response?.status === 403) {
			// Do not throw a hard 404 when the object is not publicly accessible, since users still want to visit that page
			showHard404IfNotFound = false;
		}
	}

	if (organisation) {
		return {
			redirect: {
				destination: stringifyUrl({
					// Next.js uses the destination verbatim, so the locale prefix has to be included
					url: `${getLocalePathPrefix(locale)}/${ROUTE_PARTS_BY_LOCALE[locale].search}`,
					query: {
						[SearchFilterId.Maintainers]: `${organisation.schemaIdentifier}${FILTER_LABEL_VALUE_DELIMITER}${organisation.schemaName}`,
					},
				}),
				permanent: false,
			},
		};
	}

	let ieObject: IeObject | null = null;
	try {
		let newSchemaIdentifier: string;

		if (orgSlugOrObjectSchemaIdentifier.length > MIN_LENGTH_SCHEMA_IDENTIFIER_V2) {
			// This is an old schema identifier (v2), we need to convert it to a new one (v3)
			const v3IdentifierResponse = await IeObjectsService.lookupV2Id(
				orgSlugOrObjectSchemaIdentifier
			);
			newSchemaIdentifier = v3IdentifierResponse.schemaIdentifierV3;
		} else {
			newSchemaIdentifier = orgSlugOrObjectSchemaIdentifier;
		}

		ieObject = (await IeObjectsService.getBySchemaIdentifiers([newSchemaIdentifier], true))?.[0];
		// biome-ignore lint/suspicious/noExplicitAny: we just do not know
	} catch (err: any) {
		if (err?.response?.status === 403) {
			// Do not throw a hard 404 when the object is not publicly accessible, since users still want to visit that page
			showHard404IfNotFound = false;
		}
	}

	if (ieObject) {
		return {
			redirect: {
				destination: stringifyUrl({
					url: getIeObjectDetailRedirectDestination(
						locale,
						ieObject.maintainerSlug,
						ieObject.schemaIdentifier,
						ieObject.name
					),
				}),
				permanent: true,
			},
		};
	}

	if (showHard404IfNotFound) {
		return { notFound: true };
	}

	return getDefaultStaticProps(context, context.resolvedUrl);
}
