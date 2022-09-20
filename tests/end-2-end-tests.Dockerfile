FROM mcr.microsoft.com/playwright:bionic
USER root
WORKDIR /automation
COPY ./package.json ./
RUN npm install
RUN npm run test:e2e:install-chrome

COPY . ./

CMD npm run test:e2e
