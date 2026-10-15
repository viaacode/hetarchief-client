import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { action } from 'storybook/actions';
import { expect, waitFor } from 'storybook/test';
import { dynamicActionMenuMock } from './__mocks__/dynamic-action-menu';
import DynamicActionMenu from './DynamicActionMenu';
import { SECONDARY_ITEM_ATTRIBUTE } from './DynamicActionMenu.const';

export default {
	title: 'Components/DynamicActionMenu',
	component: DynamicActionMenu,
	args: {
		...dynamicActionMenuMock,
		// Same styling as in the object detail page header
		primaryButtonVariants: ['black', 'md'],
		secondaryButtonVariants: ['white'],
		onClickAction: (id) => action(id)(),
	},
} as Meta<typeof DynamicActionMenu>;

const renderInWidth =
	(width: string, description: string): StoryFn<typeof DynamicActionMenu> =>
	(args) => (
		<div style={{ backgroundColor: 'beige', width, padding: '1rem' }}>
			<p>{description}</p>
			<DynamicActionMenu {...args} />
		</div>
	);

export const AllActionsFit = renderInWidth(
	'700px',
	'Genoeg ruimte: alle acties staan op één rij.'
).bind({});

export const SomeActionsInDropdown = renderInWidth(
	'520px',
	'Beperkte ruimte: enkele secundaire acties passen nog, de rest zit in de ...-knop.'
).bind({});

export const OnlyPrimaryAndDropdown = renderInWidth(
	'380px',
	'Weinig ruimte: enkel de primaire actie (volledig leesbaar) en de ...-knop met alle andere acties.'
).bind({});

export const TruncatedPrimaryLabel = renderInWidth(
	'260px',
	'Te weinig ruimte voor het volledige label: de primaire actie wordt afgekort zodat de ...-knop zichtbaar blijft.'
).bind({});

export const OnlyOneSecondaryAction = renderInWidth(
	'420px',
	'Met één secundaire actie is er geen ...-knop: die zou evenveel plaats innemen.'
).bind({});
OnlyOneSecondaryAction.args = {
	actions: dynamicActionMenuMock.actions.slice(0, 2),
};

export const PrimaryActionOnly = renderInWidth('380px', 'Enkel een primaire actie.').bind({});
PrimaryActionOnly.args = {
	actions: dynamicActionMenuMock.actions.slice(0, 1),
};

export const Resizable: StoryFn<typeof DynamicActionMenu> = (args) => (
	<div
		style={{
			backgroundColor: 'beige',
			width: '700px',
			minWidth: '120px',
			maxWidth: '100%',
			padding: '1rem',
			resize: 'horizontal',
			overflow: 'auto',
		}}
	>
		<p>Sleep rechtsonder om de breedte aan te passen.</p>
		<DynamicActionMenu {...args} />
	</div>
);

const getPadding = (element: Element) =>
	Number.parseFloat(getComputedStyle(element).paddingRight) || 0;

// What the real layout allows, from the measured sizes: the most secondary buttons that fit next to
// the primary action, with the dropdown button taking over the rest. Independent of the font.
const expectMostButtonsToFit = (box: HTMLElement) => {
	const list = box.querySelector('ul') as HTMLElement;
	// The label is cut off when there is little room; what it overflows by is what the primary
	// action would take extra at its natural width
	const primary = list.firstElementChild as HTMLElement;
	const label = primary.querySelector('.u-text-ellipsis') as HTMLElement;
	const naturalPrimaryWidth =
		primary.getBoundingClientRect().width + Math.max(0, label.scrollWidth - label.clientWidth);
	const secondary = list.lastElementChild as HTMLElement;
	const items = Array.from(
		secondary.querySelectorAll<HTMLElement>(`[${SECONDARY_ITEM_ATTRIBUTE}]`)
	);
	const dropdown = Array.from(secondary.children).find(
		(child) => !child.hasAttribute(SECONDARY_ITEM_ATTRIBUTE)
	);

	const gap = getPadding(items[0]);
	const widths = items.map((item) => item.getBoundingClientRect().width - getPadding(item));
	const dropdownWidth = dropdown ? dropdown.getBoundingClientRect().width : Math.max(...widths);
	const available = list.getBoundingClientRect().width - naturalPrimaryWidth;

	const fits = (count: number) =>
		count === items.length
			? widths.reduce((sum, width) => sum + width, 0) + gap * (count - 1) <= available
			: count * (widths[0] + gap) + dropdownWidth <= available;
	let expected = 0;
	for (let count = 0; count <= items.length; count++) {
		if (fits(count)) {
			expected = count;
		}
	}

	const visible = items.filter((item) => getComputedStyle(item).visibility !== 'hidden');
	expect({ available: Math.round(available), visible: visible.length }).toEqual({
		available: Math.round(available),
		visible: expected,
	});
	expect(!!dropdown).toBe(expected < items.length);
};

// Runs against the real layout, which the unit tests can't: no button too few (room left over) and
// none too many (overflow), going from wide to narrow and back
export const FitsAtEveryWidth: StoryFn<typeof DynamicActionMenu> = (args) => (
	<div data-testid="width-box" style={{ backgroundColor: 'beige', padding: '1rem' }}>
		<DynamicActionMenu {...args} />
	</div>
);
FitsAtEveryWidth.play = async ({ canvasElement }) => {
	const box = canvasElement.querySelector<HTMLElement>('[data-testid="width-box"]') as HTMLElement;

	const widths = [700, 640, 600, 560, 520, 480, 440, 400, 300];
	for (const width of [...widths, ...widths.slice(0, -1).reverse()]) {
		box.style.width = `${Math.min(width, canvasElement.clientWidth)}px`;
		await waitFor(() => expectMostButtonsToFit(box), { timeout: 3000 });
	}
};
