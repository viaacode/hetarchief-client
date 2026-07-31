import ThemeThumbnailInput from '@admin/components/ThemeThumbnailInput/ThemeThumbnailInput';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';

const makeFile = (name = 'thumb.png', type = 'image/png'): File =>
	new File([new Uint8Array(10)], name, { type });

const getFileInput = (container: HTMLElement): HTMLInputElement =>
	container.querySelector('input[type="file"]') as HTMLInputElement;

const getDropzone = (container: HTMLElement): HTMLElement =>
	container.querySelector('[aria-hidden="true"]') as HTMLElement;

describe('<ThemeThumbnailInput />', () => {
	it('renders a file input so the control is keyboard reachable', () => {
		const { container } = render(<ThemeThumbnailInput imageUrl={null} onFileSelected={vi.fn()} />);

		expect(getFileInput(container)).toBeInTheDocument();
	});

	it('accepts only jpeg and png', () => {
		const { container } = render(<ThemeThumbnailInput imageUrl={null} onFileSelected={vi.fn()} />);

		expect(getFileInput(container)).toHaveAttribute('accept', 'image/jpeg,image/png');
	});

	it('shows the placeholder when there is no thumbnail yet', () => {
		render(<ThemeThumbnailInput imageUrl={null} onFileSelected={vi.fn()} />);

		expect(screen.queryByRole('img')).not.toBeInTheDocument();
	});

	it('previews the existing thumbnail when one is set', () => {
		const { container } = render(
			<ThemeThumbnailInput imageUrl="https://example.com/thumb.jpg" onFileSelected={vi.fn()} />
		);
		const preview = container.querySelector('img');

		expect(preview).toBeInTheDocument();
		expect(preview).toHaveAttribute('src', 'https://example.com/thumb.jpg');
	});

	it('previews a blob url, which is what a freshly picked file produces', () => {
		const { container } = render(
			<ThemeThumbnailInput imageUrl="blob:http://localhost/abc-123" onFileSelected={vi.fn()} />
		);

		expect(container.querySelector('img')).toHaveAttribute('src', 'blob:http://localhost/abc-123');
	});

	it('reports the file picked through the input', () => {
		const onFileSelected = vi.fn();
		const { container } = render(
			<ThemeThumbnailInput imageUrl={null} onFileSelected={onFileSelected} />
		);
		const file = makeFile();

		fireEvent.change(getFileInput(container), { target: { files: [file] } });

		expect(onFileSelected).toHaveBeenCalledTimes(1);
		expect(onFileSelected).toHaveBeenCalledWith(file);
	});

	it('reports a file dropped onto the drop zone', () => {
		const onFileSelected = vi.fn();
		const { container } = render(
			<ThemeThumbnailInput imageUrl={null} onFileSelected={onFileSelected} />
		);
		const file = makeFile();

		fireEvent.drop(getDropzone(container), { dataTransfer: { files: [file] } });

		expect(onFileSelected).toHaveBeenCalledTimes(1);
		expect(onFileSelected).toHaveBeenCalledWith(file);
	});

	it('ignores a drop that carries no file', () => {
		const onFileSelected = vi.fn();
		const { container } = render(
			<ThemeThumbnailInput imageUrl={null} onFileSelected={onFileSelected} />
		);

		fireEvent.drop(getDropzone(container), { dataTransfer: { files: [] } });

		expect(onFileSelected).not.toHaveBeenCalled();
	});

	it('opens the file picker when the drop zone is clicked', () => {
		const { container } = render(<ThemeThumbnailInput imageUrl={null} onFileSelected={vi.fn()} />);
		const clickSpy = vi.spyOn(getFileInput(container), 'click');

		fireEvent.click(getDropzone(container));

		expect(clickSpy).toHaveBeenCalledTimes(1);
	});

	it('does not add a second tab stop for the drop zone', () => {
		const { container } = render(<ThemeThumbnailInput imageUrl={null} onFileSelected={vi.fn()} />);

		expect(getDropzone(container)).not.toHaveAttribute('tabindex');
	});
});
