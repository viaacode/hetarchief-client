import { useRouter } from 'next/router';
import { useEffect } from 'react';

export interface NextRedirectsProps {
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
