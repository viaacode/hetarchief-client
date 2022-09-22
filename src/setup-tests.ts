import kyMock from './__mocks__/ky-universal';
import nextConfig from './__mocks__/next-config';
import nextRouterMock from './__mocks__/next-router';

window.scrollTo = jest.fn();
kyMock.mock('ky-universal');
nextConfig.mock('next/config');
nextRouterMock.mock('next/router');
