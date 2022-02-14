import kyMock from './__mocks__/ky-universal';
import nextRouterMock from './__mocks__/next-router';
import reactI18nextMock from './__mocks__/react-i18next';

kyMock.mock('ky-universal');
nextRouterMock.mock('next/router');
reactI18nextMock.mock('react-i18next');
