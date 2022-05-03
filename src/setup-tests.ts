import kyMock from './__mocks__/ky-universal';
import nextConfig from './__mocks__/next-config';
import nextRouterMock from './__mocks__/next-router';
import reactI18nextMock from './__mocks__/react-i18next';

window.scrollTo = jest.fn();
kyMock.mock('ky-universal');
nextConfig.mock('next/config');
nextRouterMock.mock('next/router');
reactI18nextMock.mock('react-i18next');
