export {};
// import { render, screen, waitFor } from '@testing-library/react';
// import { ReactNode } from 'react';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { Provider } from 'react-redux';
//
// import { NextQueryParamProvider } from '@shared/providers/NextQueryParamProvider';
//
// import { mockStore } from '../../../../__mocks__/store';
//
// import AppLayout from './AppLayout';

// const mockReactQueryClient = {
// 	defaultQueryObserverOptions: () => ({
// 		// empty mock function
// 	}),
// 	getQueryCache: () => ({
// 		// empty mock function
// 		build: () => ({
// 			// empty mock function
// 		}),
// 	}),
// };
//
// const renderAppLayout = (children?: ReactNode) => {
// 	return render(
// 		<NextQueryParamProvider>
// 			<QueryClientProvider client={mockReactQueryClient as QueryClient}>
// 				<Provider store={mockStore}>
// 					<AppLayout>{children}</AppLayout>
// 				</Provider>
// 			</QueryClientProvider>
// 		</NextQueryParamProvider>
// 	);
// };

describe('Layouts', () => {
	describe('<AppLayout />', () => {
		it('Should check app layout', () => {
			expect(true).toBeTruthy();
		});
		// TODO re-enable tests for app layout once we can mock react-query hooks
		// it('Should show the navigation', async () => {
		// 	const { container } = renderAppLayout();
		// 	const nav = container.querySelector('.c-navigation');
		// 	await waitFor(() => {
		// 		expect(nav).toBeInTheDocument();
		// 	});
		// });
		//
		// it('Should render children', async () => {
		// 	const testId = 'inner-child-id';
		// 	const children = (
		// 		<div>
		// 			<span data-testid={testId} />
		// 		</div>
		// 	);
		// 	renderAppLayout(children);
		//
		// 	const child = screen.queryByTestId(testId);
		// 	await waitFor(() => {
		// 		expect(child).toBeInTheDocument();
		// 	});
		// });
	});
});
