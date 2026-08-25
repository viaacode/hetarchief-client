import { ContextDisclaimer } from '@ie-objects/components/ContextDisclaimer/ContextDisclaimer';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it } from 'vitest';

import '@testing-library/jest-dom';

describe('Components', () => {
	describe('<ContextDisclaimer />', () => {
		it('Should render the archive box icon and the close icon in the active state', () => {
			render(<ContextDisclaimer />);

			expect(screen.getByText('storage-box')).toBeInTheDocument();
			expect(screen.getByText('times')).toBeInTheDocument();
		});

		it('Should collapse to the archive box icon after a click on the close icon', async () => {
			render(<ContextDisclaimer />);

			await userEvent.click(screen.getByRole('button'));

			expect(screen.getByText('storage-box')).toBeInTheDocument();
			expect(screen.queryByText('times')).not.toBeInTheDocument();
		});

		it('Should expand again after a click on the archive box icon', async () => {
			render(<ContextDisclaimer />);

			await userEvent.click(screen.getByRole('button'));
			await userEvent.click(screen.getByRole('button'));

			expect(screen.getByText('times')).toBeInTheDocument();
		});
	});
});
