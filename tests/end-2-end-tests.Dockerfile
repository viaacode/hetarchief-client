FROM mcr.microsoft.com/playwright:v1.36.1
USER root
WORKDIR /automation

COPY ./package.json ./
RUN npm install
RUN npm run test:e2e:install-chrome

COPY . ./

CMD npm run test:e2e
