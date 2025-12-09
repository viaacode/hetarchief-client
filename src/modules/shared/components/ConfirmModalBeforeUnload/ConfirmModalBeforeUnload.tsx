import { ConfirmationModal } from '@shared/components/ConfirmationModal';
import { tText } from '@shared/helpers/translate';
import { useRouter } from 'next/router';
import { type FC, useCallback, useEffect, useMemo, useState } from 'react';

interface ConfirmModalBeforeUnloadProps {
	when: boolean;
	message?: string;
}

export const ConfirmModalBeforeUnload: FC<ConfirmModalBeforeUnloadProps> = ({ when, message }) => {
	const router = useRouter();
	const [hasConfirmed, setHasConfirmed] = useState(false);
	const [navigationThroughBackButton, setNavigationThroughBackButton] = useState(false);
	const [nextRoute, setNextRoute] = useState<string | null>(null);

	const isModalOpen = useMemo(() => !!nextRoute, [nextRoute]);

	const messageOrDefault =
		message ||
		tText('Er zijn nog niet opgeslagen wijzigingen. Weet je zeker dat je de pagina wil verlaten?');

	const resetRouteAndHasConfirmed = useCallback(() => {
		setNextRoute(null);
		setHasConfirmed(false);
		setNavigationThroughBackButton(false);
	}, []);

	const confirmNavigation = useCallback(() => {
		setHasConfirmed(true);
	}, []);

	const cancelNavigation = useCallback(() => {
		const windowPath = window.location.pathname + window.location.search;

		// With the custom modal the router and window location get out of sync
		// When that happens we want to make sure they get in sync again in case we cancel the navigation
		// It will reset the other values on route completion
		if (windowPath !== router.asPath) {
			setNextRoute(router.asPath);

			// If the navigation happened via the back button, we go forward again to the route we were on
			if (navigationThroughBackButton) {
				window.history.forward();
			} else {
				// Navigation happened via adding a new route, so we are updating it back to the old
				router.replace(router, router.asPath);
			}
		} else {
			// Only reset this when the router and the window is in sync.
			resetRouteAndHasConfirmed();
		}
	}, [resetRouteAndHasConfirmed, router, navigationThroughBackButton]);

	// Storing if navigation happens via the back button
	useEffect(() => {
		router.beforePopState(() => {
			setNavigationThroughBackButton(true);
			return true;
		});
	}, [router]);

	// Use beforeunload to prevent closing the tab, refreshing the page or moving outside the Next app
	useEffect(() => {
		const handleWindowClose = (event: Event) => {
			if (!when) {
				return;
			}
			event.preventDefault();
			return messageOrDefault;
		};

		window.addEventListener('beforeunload', handleWindowClose);
		return () => {
			window.removeEventListener('beforeunload', handleWindowClose);
		};
	}, [when, messageOrDefault]);

	// Use beforeHistoryChange to prevent navigation inside the Next app
	useEffect(() => {
		const onRouteChangeStart = (route: string) => {
			// Allow routing when we:
			// Have no need for confirmation
			// The user has already confirmed
			// We update the route with the same route (probably to  make sure the window url and router are in sync)
			if (!when || hasConfirmed || nextRoute === route) {
				return;
			}

			// We need confirmation, so store the route we want to navigate to and throw an error on the router to stop navigation
			setNextRoute(route);
			router.events.emit('routeChangeError');
			throw 'navigation aborted';
		};

		const onRouteComplete = () => {
			resetRouteAndHasConfirmed();
		};

		router.events.on('beforeHistoryChange', onRouteChangeStart);
		router.events.on('routeChangeComplete', onRouteComplete);

		return () => {
			router.events.off('beforeHistoryChange', onRouteChangeStart);
			router.events.off('routeChangeComplete', onRouteComplete);
		};
	}, [nextRoute, hasConfirmed, router, when, resetRouteAndHasConfirmed]);

	useEffect(() => {
		if (hasConfirmed) {
			if (!nextRoute) {
				return;
			}
			void router.push(nextRoute);
		}
	}, [nextRoute, hasConfirmed, router]);

	return (
		<ConfirmationModal
			text={{
				description: messageOrDefault,
				yes: tText('Verder werken'),
				no: tText('Ja, ik ben zeker'),
			}}
			fullWidthButtonWrapper
			isOpen={isModalOpen}
			onClose={cancelNavigation}
			onCancel={confirmNavigation}
			onConfirm={cancelNavigation}
		/>
	);
};
