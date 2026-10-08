import { fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { FileMentionEntityType } from '@ie-objects/ie-objects.types';
import type { AiEntity } from '@ie-objects/utils/map-ai-entities';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let mockWindowWidth = 1400;

vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string) => key.split('___')[1] ?? key,
}));
vi.mock('@shared/hooks/use-window-size-context', () => ({
	useWindowSizeContext: () => ({ width: mockWindowWidth, height: 800 }),
}));
// Opens on hover, and on click unless enableTooltipOnClick is false, like the real one. Content
// only renders while it is open
vi.mock('@meemoo/react-components', async (importOriginal) => {
	const { createContext, useContext, useState } = await import('react');
	const OpenContext = createContext(false);
	return {
		...(await importOriginal<typeof import('@meemoo/react-components')>()),
		Tooltip: ({
			children,
			enableTooltipOnClick = true,
		}: {
			children: React.ReactNode;
			enableTooltipOnClick?: boolean;
		}) => {
			const [open, setOpen] = useState(false);
			return (
				<OpenContext.Provider value={open}>
					{/* biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: stands in for the library tooltip */}
					<div
						data-testid="tooltip"
						onMouseEnter={() => setOpen(true)}
						onClick={() => enableTooltipOnClick && setOpen(true)}
					>
						{children}
					</div>
				</OpenContext.Provider>
			);
		},
		TooltipTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
		TooltipContent: ({ children }: { children: React.ReactNode }) =>
			useContext(OpenContext) ? <span data-testid="tooltip-content">{children}</span> : null,
	};
});

import { AiEntityAvatarRow } from './AiEntityAvatarRow';

const ROW_WIDTH_PX = 100;

const person = (id: string, name: string): AiEntity => ({
	id,
	type: FileMentionEntityType.PERSON,
	name,
	wikidataId: null,
	wikidataUrl: null,
	still: null,
	intervals: [{ start: 0, end: 5 }],
});

// 5 avatars of 40px do not fit in a 100px row: 1 avatar and the "+4" toggle remain
const renderRow = () => {
	const onSelect = vi.fn();
	const result = render(
		<AiEntityAvatarRow
			entities={[
				person('a', 'Jane Doe'),
				person('b', 'John Doe'),
				person('c', 'Jan Peeters'),
				person('d', 'An Peeters'),
				person('e', 'Els Janssens'),
			]}
			selectedId={null}
			controlsId="card"
			onSelect={onSelect}
		/>
	);
	return { onSelect, ...result };
};

describe('Component: <AiEntityAvatarRow />', () => {
	let originalRect: typeof Element.prototype.getBoundingClientRect;

	beforeEach(() => {
		mockWindowWidth = 1400;
		vi.stubGlobal(
			'ResizeObserver',
			class {
				observe() {}
				unobserve() {}
				disconnect() {}
			}
		);
		originalRect = Element.prototype.getBoundingClientRect;
		Element.prototype.getBoundingClientRect = () =>
			({ width: ROW_WIDTH_PX, height: 40, top: 0, left: 0, right: 0, bottom: 0 }) as DOMRect;
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		Element.prototype.getBoundingClientRect = originalRect;
	});

	it('shows a name tooltip on the avatars and on the toggle on desktop', async () => {
		renderRow();

		expect(await screen.findByRole('button', { name: 'Jane Doe' })).toBeInTheDocument();
		for (const tooltip of screen.getAllByTestId('tooltip')) {
			fireEvent.mouseEnter(tooltip);
		}

		const tooltips = screen.getAllByTestId('tooltip-content');
		expect(tooltips.map((tooltip) => tooltip.textContent)).toEqual(['Jane Doe', 'toon-meer']);
	});

	it('does not open the tooltip when an avatar is clicked, but selects the avatar', async () => {
		const { onSelect } = renderRow();

		fireEvent.click(await screen.findByRole('button', { name: 'Jane Doe' }));

		expect(onSelect).toHaveBeenCalledWith('a');
		expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument();
	});

	it('does not open the tooltip when the toggle is clicked', async () => {
		renderRow();

		fireEvent.click(await screen.findByRole('button', { name: 'toon-meer' }));

		expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument();
	});

	it('shows no tooltips on mobile, but keeps the avatars and the toggle', async () => {
		mockWindowWidth = 375;
		renderRow();

		expect(await screen.findByRole('button', { name: 'Jane Doe' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'toon-meer' })).toHaveTextContent('+4');
		expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument();
	});

	it('shows no tooltips on tablet portrait either, where the mobile layout applies', async () => {
		mockWindowWidth = 800;
		renderRow();

		expect(await screen.findByRole('button', { name: 'Jane Doe' })).toBeInTheDocument();
		expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument();
	});
});
