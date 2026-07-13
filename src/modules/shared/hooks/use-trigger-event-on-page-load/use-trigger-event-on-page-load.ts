import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { EventsService, type LogEventType } from '@shared/services/events-service';
import { noop } from 'es-toolkit/compat';
import { parse } from 'query-string';
import { useEffect, useState } from 'react';

interface UseTriggerEventOnPageLoadParams {
	eventType: LogEventType;
	// biome-ignore lint/suspicious/noExplicitAny: not standardized yet
	eventData?: Record<string, any>;
	shouldTrigger?: boolean;
}

export function useTriggerEventOnPageLoad({
	eventType,
	eventData,
	shouldTrigger = true,
}: UseTriggerEventOnPageLoadParams) {
	const [hasTriggeredForUrl, setHasTriggeredForUrl] = useState<Record<string, boolean>>({});

	useEffect(() => {
		if (
			!shouldTrigger ||
			hasTriggeredForUrl[window.location.href] ||
			parse(window.location.search)[QUERY_PARAM_KEY.CONTENT_PAGE_PREVIEW]
		) {
			return;
		}
		EventsService.triggerEvent(eventType, window.location.href, eventData).then(noop);
		setHasTriggeredForUrl((prev) => ({ ...prev, [window.location.href]: true }));
	}, [hasTriggeredForUrl, shouldTrigger, eventType, eventData]);
}
