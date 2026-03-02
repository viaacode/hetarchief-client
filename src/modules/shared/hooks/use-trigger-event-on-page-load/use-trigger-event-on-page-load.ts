import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { EventsService, type LogEventType } from '@shared/services/events-service';
import { noop } from 'lodash-es';
import { useEffect, useState } from 'react';
import { BooleanParam, useQueryParam } from 'use-query-params';

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
	const [previewQueryParam] = useQueryParam(QUERY_PARAM_KEY.CONTENT_PAGE_PREVIEW, BooleanParam);

	useEffect(() => {
		if (!shouldTrigger || hasTriggeredForUrl[window.location.href] || previewQueryParam) {
			return;
		}
		EventsService.triggerEvent(eventType, window.location.href, eventData).then(noop);
		setHasTriggeredForUrl((prev) => ({ ...prev, [window.location.href]: true }));
	}, [hasTriggeredForUrl, shouldTrigger, previewQueryParam, eventType, eventData]);
}
