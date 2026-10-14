import { fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { FileMentionEntityType } from '@ie-objects/ie-objects.types';
import type { AiEntity } from '@ie-objects/utils/map-ai-entities';
import { describe, expect, it } from 'vitest';

import { AiEntityPortrait } from './AiEntityPortrait';

const entity = (overrides: Partial<AiEntity> = {}): AiEntity => ({
	id: 'a',
	type: FileMentionEntityType.PERSON,
	name: 'Jane Eve Doe',
	wikidataId: null,
	wikidataUrl: null,
	still: null,
	intervals: [{ start: 0, end: 5 }],
	...overrides,
});

describe('Component: <AiEntityPortrait />', () => {
	it('shows the still of a person', () => {
		const { container } = render(
			<AiEntityPortrait entity={entity({ still: 'jane.jpg' })} size="lg" />
		);

		expect(container.querySelector('img')).toHaveAttribute('src', 'jane.jpg');
		expect(screen.queryByText('JD')).not.toBeInTheDocument();
	});

	it('shows the initials of a person without still, on a coloured background', () => {
		render(<AiEntityPortrait entity={entity()} size="lg" />);

		expect(screen.getByText('JD')).toHaveAttribute(
			'style',
			expect.stringContaining('background-color')
		);
	});

	it('falls back to the initials when the still cannot be loaded', () => {
		const { container } = render(
			<AiEntityPortrait entity={entity({ still: 'broken.jpg' })} size="lg" />
		);

		fireEvent.error(container.querySelector('img') as HTMLImageElement);

		expect(screen.getByText('JD')).toBeInTheDocument();
		expect(container.querySelector('img')).not.toBeInTheDocument();
	});

	it.each([
		[FileMentionEntityType.PLACE, 'Antwerpen', 'A'],
		[FileMentionEntityType.ORGANIZATION, 'Sint Lucas Gent', 'S'],
	])('shows only the first letter of a %s, on a coloured background', (type, name, letter) => {
		render(<AiEntityPortrait entity={entity({ type, name })} size="xs" />);

		expect(screen.getByText(letter)).toHaveAttribute(
			'style',
			expect.stringContaining('background-color')
		);
	});

	it('does not use a still for a place or an organisation', () => {
		const { container } = render(
			<AiEntityPortrait
				entity={entity({ type: FileMentionEntityType.PLACE, name: 'Antwerpen', still: 'x.jpg' })}
				size="xs"
			/>
		);

		expect(container.querySelector('img')).not.toBeInTheDocument();
		expect(screen.getByText('A')).toBeInTheDocument();
	});
});
