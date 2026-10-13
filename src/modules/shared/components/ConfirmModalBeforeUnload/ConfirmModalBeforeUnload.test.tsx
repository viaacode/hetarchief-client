import { act, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

type Handler = (...args: unknown[]) => void;

const routerMock = vi.hoisted(() => {
	const handlers: Record<string, Set<Handler>> = {};
	return {
		handlers,
		push: vi.fn(),
		replace: vi.fn(),
		beforePopState: vi.fn(),
		asPath: '/zoeken/vrt/abc/title',
		locale: 'nl',
		defaultLocale: 'nl',
		events: {
			on: (event: string, handler: Handler) => {
				handlers[event] = handlers[event] || new Set();
				handlers[event].add(handler);
			},
			off: (event: string, handler: Handler) => handlers[event]?.delete(handler),
			emit: vi.fn(),
		},
	};
});

vi.mock('next/router', () => ({ useRouter: () => routerMock }));
vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string) => key,
	tHtml: (key: string) => key,
}));
// The real modal needs a redux store: only the callbacks and open state matter here
vi.mock('@shared/components/ConfirmationModal', () => ({
	ConfirmationModal: ({
		isOpen,
		onCancel,
		onConfirm,
	}: {
		isOpen: boolean;
		onCancel: () => void;
		onConfirm: () => void;
	}) =>
		isOpen ? (
			<div>
				<button type="button" onClick={onCancel}>
					leave
				</button>
				<button type="button" onClick={onConfirm}>
					keep working
				</button>
			</div>
		) : null,
}));

import { ConfirmModalBeforeUnload } from './ConfirmModalBeforeUnload';

const CURRENT_PATH = '/zoeken/vrt/abc/title';

/** Calls the handlers the component registered on the router events, returns what they threw */
function emitRouterEvent(event: string, ...args: unknown[]): unknown {
	let thrown: unknown;
	act(() => {
		for (const handler of [...(routerMock.handlers[event] || [])]) {
			try {
				handler(...args);
			} catch (err) {
				thrown = err;
			}
		}
	});
	return thrown;
}

/** Simulates next's beforeHistoryChange, which the component uses to block navigation */
const startNavigation = (route: string) => emitRouterEvent('beforeHistoryChange', route);

const clickButton = (label: string) => act(() => screen.getByText(label).click());

describe('ConfirmModalBeforeUnload', () => {
	beforeEach(() => {
		for (const key of Object.keys(routerMock.handlers)) {
			delete routerMock.handlers[key];
		}
		routerMock.push.mockClear();
		routerMock.replace.mockClear();
		routerMock.beforePopState.mockClear();
		routerMock.events.emit.mockClear();
		routerMock.asPath = CURRENT_PATH;
		routerMock.locale = 'nl';
		window.history.replaceState({}, '', `${CURRENT_PATH}?blade=report`);
	});

	it('should not block navigation when there is nothing to confirm', () => {
		render(<ConfirmModalBeforeUnload when={false} />);

		expect(startNavigation(CURRENT_PATH)).toBeUndefined();
		expect(screen.queryByText('leave')).not.toBeInTheDocument();
	});

	it('should block navigation and open the modal when there are unsaved changes', () => {
		render(<ConfirmModalBeforeUnload when />);

		expect(startNavigation(CURRENT_PATH)).toBe('navigation aborted');
		expect(screen.getByText('leave')).toBeInTheDocument();
		expect(routerMock.push).not.toHaveBeenCalled();
	});

	it('should replay a query-only change shallowly, so getServerSideProps does not re-run', () => {
		render(<ConfirmModalBeforeUnload when />);
		startNavigation(CURRENT_PATH);

		act(() => screen.getByText('leave').click());

		expect(routerMock.push).toHaveBeenCalledTimes(1);
		expect(routerMock.push).toHaveBeenCalledWith(CURRENT_PATH, undefined, {
			shallow: true,
			scroll: false,
		});
	});

	it('should replay a query-only change shallowly when the new route has a query string', () => {
		const route = `${CURRENT_PATH}?blade=other`;
		render(<ConfirmModalBeforeUnload when />);
		startNavigation(route);

		act(() => screen.getByText('leave').click());

		expect(routerMock.push).toHaveBeenCalledWith(route, undefined, {
			shallow: true,
			scroll: false,
		});
	});

	it('should navigate normally when the route is another path', () => {
		const route = '/zoeken/vrt/other-object/other-title';
		render(<ConfirmModalBeforeUnload when />);
		startNavigation(route);

		act(() => screen.getByText('leave').click());

		// Shallow here would keep the old object's props on the new page
		expect(routerMock.push).toHaveBeenCalledWith(route, undefined, {
			shallow: false,
			scroll: true,
		});
	});

	it('should not navigate when the user keeps working', () => {
		render(<ConfirmModalBeforeUnload when />);
		startNavigation(CURRENT_PATH);

		act(() => screen.getByText('keep working').click());

		expect(routerMock.push).not.toHaveBeenCalled();
	});

	it('should emit routeChangeError when it blocks a navigation', () => {
		render(<ConfirmModalBeforeUnload when />);
		startNavigation(CURRENT_PATH);

		expect(routerMock.events.emit).toHaveBeenCalledWith('routeChangeError');
	});

	describe('keep working', () => {
		it('should put the router back on the current route when it got out of sync with the window', () => {
			render(<ConfirmModalBeforeUnload when />);
			startNavigation('/zoeken/vrt/other/other');

			clickButton('keep working');

			expect(routerMock.replace).toHaveBeenCalledWith(routerMock, CURRENT_PATH);
			// Still waiting for the router to settle on the route it was put back to
			expect(screen.getByText('leave')).toBeInTheDocument();
		});

		it('should close the modal when the router and window are already in sync', () => {
			window.history.replaceState({}, '', CURRENT_PATH);
			render(<ConfirmModalBeforeUnload when />);
			startNavigation('/zoeken/vrt/other/other');

			clickButton('keep working');

			expect(routerMock.replace).not.toHaveBeenCalled();
			expect(screen.queryByText('leave')).not.toBeInTheDocument();
		});

		it('should prefix the locale when it is not the default one', () => {
			routerMock.locale = 'en';
			routerMock.asPath = '/search/vrt/abc/title';
			render(<ConfirmModalBeforeUnload when />);
			startNavigation('/en/search/vrt/other/other');

			clickButton('keep working');

			expect(routerMock.replace).toHaveBeenCalledWith(routerMock, '/en/search/vrt/abc/title');
		});

		it('should prefix the locale on a homepage that only has a query param', () => {
			routerMock.locale = 'en';
			routerMock.asPath = '/?foo=bar';
			render(<ConfirmModalBeforeUnload when />);
			startNavigation('/en/other');

			clickButton('keep working');

			// '/en/?foo=bar' would not be a valid url
			expect(routerMock.replace).toHaveBeenCalledWith(routerMock, '/en?foo=bar');
		});

		it('should go forward in the history instead of replacing when the user came through the back button', () => {
			const forward = vi.spyOn(window.history, 'forward').mockImplementation(() => undefined);
			render(<ConfirmModalBeforeUnload when />);
			const onPopState = routerMock.beforePopState.mock.calls.at(-1)?.[0] as () => boolean;
			let allowed: boolean | undefined;
			act(() => {
				allowed = onPopState();
			});
			startNavigation('/zoeken/vrt/other/other');

			clickButton('keep working');

			expect(allowed).toBe(true);
			expect(forward).toHaveBeenCalledTimes(1);
			expect(routerMock.replace).not.toHaveBeenCalled();
			forward.mockRestore();
		});

		it('should let the navigation back to the current route through and close the modal', () => {
			render(<ConfirmModalBeforeUnload when />);
			startNavigation('/zoeken/vrt/other/other');
			clickButton('keep working');

			// The router replace above fires this: it must not be blocked a second time
			const thrown = startNavigation(CURRENT_PATH);

			expect(thrown).toBeUndefined();
			expect(screen.queryByText('leave')).not.toBeInTheDocument();
		});
	});

	describe('leave', () => {
		it('should let the confirmed navigation through', () => {
			render(<ConfirmModalBeforeUnload when />);
			startNavigation('/zoeken/vrt/other/other');
			clickButton('leave');

			expect(startNavigation('/zoeken/vrt/other/other')).toBeUndefined();
		});

		it('should navigate to a localized homepage without the locale as url', () => {
			render(<ConfirmModalBeforeUnload when />);
			startNavigation('/nl?foo=bar');

			clickButton('leave');

			// Pushing '/nl?...' as url would reload the entire application
			expect(routerMock.push).toHaveBeenCalledWith({ pathname: '/', query: 'foo=bar' }, undefined, {
				locale: 'nl',
			});
		});
	});

	it('should reset when the route change completes', () => {
		render(<ConfirmModalBeforeUnload when />);
		startNavigation('/zoeken/vrt/other/other');
		expect(screen.getByText('leave')).toBeInTheDocument();

		emitRouterEvent('routeChangeComplete');

		expect(screen.queryByText('leave')).not.toBeInTheDocument();
	});

	describe('beforeunload', () => {
		const fireBeforeUnload = () => {
			const event = new Event('beforeunload', { cancelable: true });
			window.dispatchEvent(event);
			return event;
		};

		it('should prevent closing the tab when there are unsaved changes', () => {
			render(<ConfirmModalBeforeUnload when message="custom" />);

			expect(fireBeforeUnload().defaultPrevented).toBe(true);
		});

		it('should not prevent closing the tab when there is nothing to confirm', () => {
			render(<ConfirmModalBeforeUnload when={false} />);

			expect(fireBeforeUnload().defaultPrevented).toBe(false);
		});

		it('should remove the listener on unmount', () => {
			const { unmount } = render(<ConfirmModalBeforeUnload when />);
			unmount();

			expect(fireBeforeUnload().defaultPrevented).toBe(false);
		});
	});
});
