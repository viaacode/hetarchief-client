import { Component, ReactNode } from 'react';

import styles from './ErrorBoundry.module.scss';

interface ErrorBoundaryProps {
	children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps> {
	state: { error: unknown | undefined; eventId: string | undefined } = {
		error: undefined,
		eventId: undefined,
	};

	constructor(props: ErrorBoundaryProps) {
		super(props);
	}

	static getDerivedStateFromError(error: unknown): { error?: unknown } {
		if (error) {
			return { error };
		}
		return {};
	}

	render(): ReactNode {
		const { error } = this.state;
		const { children } = this.props;

		if (error) {
			return (
				<p className={styles['p-error-boundary__message']}>
					{/* No translations since those could throw a new error */}
					Er ging iets mis op de pagina. <br />
					Indien dit blijft gebeuren, contacteer ons via de Feedback knop rechts onderaan.
				</p>
			);
		}

		return children;
	}
}

export default ErrorBoundary;
