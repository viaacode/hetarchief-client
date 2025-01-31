import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

import kyMock from './__mocks__/ky-universal';
import nextConfig from './__mocks__/next-config';
import nextRouterMock from './__mocks__/next-router';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
declare const window: any;

window.scrollTo = jest.fn();
kyMock.mock('ky-universal');
nextConfig.mock('next/config');
nextRouterMock.mock('next/router');
