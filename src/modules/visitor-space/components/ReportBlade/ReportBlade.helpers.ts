import type { User } from '@auth/types';
import { publicRuntimeConfig } from '@shared/config/public-runtime-config';
import { stripHtml } from 'string-strip-html';

const FRAGMENT_ID_PLACEHOLDER = '{mh_fragment_identifier}';

/**
 * Builds a URL from an env-var template containing the `{mh_fragment_identifier}` placeholder.
 * Returns null when the template or the fragmentId is missing, so callers can show a
 * "link unavailable" state instead of a broken link.
 */
function buildFragmentUrl(
	template: string | undefined,
	fragmentId: string | undefined
): string | null {
	if (!template || !fragmentId) {
		return null;
	}
	return template.replace(FRAGMENT_ID_PLACEHOLDER, fragmentId);
}

export function buildMamUrl(fragmentId: string | undefined): string | null {
	return buildFragmentUrl(publicRuntimeConfig.MAM_FRAGMENT_URL, fragmentId);
}

export function buildAiMeemooUrl(fragmentId: string | undefined): string | null {
	return buildFragmentUrl(publicRuntimeConfig.AI_MEEMOO_FRAGMENT_URL, fragmentId);
}

export function isOwnOrganisation(
	user: User | null | undefined,
	maintainerId: string | undefined
): boolean {
	return !!user?.organisationId && !!maintainerId && user.organisationId === maintainerId;
}

/**
 * Strips HTML tags from user-entered free text before it's sent to Zendesk/the maintainer email.
 * Note: Zendesk's own agent-view auto-linkification of URLs in the ticket body is outside our
 * control and should be confirmed separately with whoever configures Zendesk.
 */
export function sanitizeReportText(value: string): string {
	return stripHtml(value).result.trim();
}
