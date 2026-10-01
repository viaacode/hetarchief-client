import { tText } from '@shared/helpers/translate';
import { object, type Schema, string } from 'yup';

import type { ReportLegalReasonOption, ReportRootOption } from './ReportBlade.types';
import { ReportLegalReason, ReportReason } from './ReportBlade.types';

export const REPORT_REMARK_MAX_LENGTH = 1000;

export const REPORT_FORM_SCHEMA = (): Schema<{ reportMessage: string; email: string }> => {
	return object({
		reportMessage: string()
			.required(
				tText('modules/visitor-space/components/report-blade/report-blade___probleem-is-verplicht')
			)
			.max(
				REPORT_REMARK_MAX_LENGTH,
				tText(
					'modules/visitor-space/components/report-blade/report-blade___probleem-mag-maximaal-1000-karakters-bevatten'
				)
			),
		email: string()
			.email(
				tText(
					'modules/visitor-space/components/report-blade/report-blade___e-mail-moet-geldig-zijn'
				)
			)
			.required(
				tText('modules/visitor-space/components/report-blade/report-blade___e-mail-is-verplicht')
			),
	});
};

export const LEGAL_REMARK_SCHEMA = (): Schema<{
	legalReason: string;
	legalRemarkText: string;
	email: string;
}> => {
	return object({
		legalReason: string()
			.required(
				tText(
					'modules/visitor-space/components/report-blade/report-blade___kies-een-van-de-bovenstaande-opties'
				)
			)
			.oneOf(Object.values(ReportLegalReason)),
		legalRemarkText: string()
			.required(
				tText('modules/visitor-space/components/report-blade/report-blade___opmerking-is-verplicht')
			)
			.max(
				REPORT_REMARK_MAX_LENGTH,
				tText(
					'modules/visitor-space/components/report-blade/report-blade___opmerking-mag-maximaal-1000-karakters-bevatten'
				)
			),
		email: string()
			.email(
				tText(
					'modules/visitor-space/components/report-blade/report-blade___e-mail-moet-geldig-zijn'
				)
			)
			.required(
				tText('modules/visitor-space/components/report-blade/report-blade___e-mail-is-verplicht')
			),
	});
};

export const GET_REPORT_OPTIONS = (
	isKeyUser: boolean,
	isOwnOrganisation: boolean
): ReportRootOption[] => {
	const legalOption = () => ({
		value: ReportReason.LEGAL_REMARK,
		label: tText(
			'modules/visitor-space/components/report-blade/report-blade___ik-wil-een-juridische-opmerking-geven-ivm-auteursrecht-of-gdpr-privacy'
		),
	});

	if (!isKeyUser) {
		return [
			legalOption(),
			{
				value: ReportReason.GENERAL_QUESTION,
				label: tText(
					'modules/visitor-space/components/report-blade/report-blade___ik-heb-een-ander-probleem-met-dit-object'
				),
			},
		];
	}

	if (isOwnOrganisation) {
		return [
			{
				value: ReportReason.METADATA_ISSUE,
				label: tText(
					'modules/visitor-space/components/report-blade/report-blade___ik-vond-een-probleem-dat-ik-binnen-mijn-organisatie-wil-oplossen-geef-mij-de-juiste-links-om-te-editeren'
				),
			},
			{
				value: ReportReason.GENERAL_QUESTION,
				label: tText(
					'modules/visitor-space/components/report-blade/report-blade___ik-wil-een-probleem-met-dit-item-aan-meemoo-melden'
				),
			},
			legalOption(),
		];
	}

	return [
		{
			value: ReportReason.METADATA_ISSUE,
			label: tText(
				'modules/visitor-space/components/report-blade/report-blade___ik-heb-een-probleem-met-de-metadata-van-dit-object'
			),
		},
		{
			value: ReportReason.GENERAL_QUESTION,
			label: tText(
				'modules/visitor-space/components/report-blade/report-blade___ik-heb-een-ander-probleem-met-dit-object'
			),
		},
		legalOption(),
	];
};

export const GET_LEGAL_REASON_OPTIONS = (): ReportLegalReasonOption[] => [
	{
		value: ReportLegalReason.OPT_OUT_OR_REMOVAL,
		label: tText(
			'modules/visitor-space/components/report-blade/report-blade___ik-ben-rechthebbende-en-wil-een-opt-out-op-de-out-of-commerce-regeling-aanvragen-voor-dit-materiaal-of-een-verwijdering'
		),
	},
	{
		value: ReportLegalReason.IP_COMPLAINT,
		label: tText(
			'modules/visitor-space/components/report-blade/report-blade___ik-ben-rechthebbende-en-wil-een-klacht-indienen-wegens-mogelijke-inbreuk-op-intellectuele-rechten'
		),
	},
	{
		value: ReportLegalReason.GDPR_PRIVACY,
		label: tText(
			'modules/visitor-space/components/report-blade/report-blade___ik-wil-mijn-rechten-uitoefenen-volgens-de-gdpr-of-privacy-wetgeving-met-betrekking-tot-dit-materiaal-vb-portretrecht'
		),
	},
];
