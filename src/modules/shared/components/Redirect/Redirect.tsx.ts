import { useRouter } from 'next/router';
import { type ReactNode, useEffect } from 'react';

export interface NextRedirectsProps {
	children?: ReactNode;
	to: string;
	method: 'push' | 'replace';
}

export function NextRedirect({ to, method }: NextRedirectsProps) {
	const router = useRouter();
	useEffect(() => {
		if (method === 'push') {
			router.push(to);
		} else {
			router.replace(to);
		}
	}, [method, router, to]);
	return null;
}
