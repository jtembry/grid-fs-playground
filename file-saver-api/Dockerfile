FROM node:lts
RUN mkdir /home/node/app && chown node:node /home/node/app
RUN mkdir /home/node/app/node_modules && chown node:node /home/node/app/node_modules
WORKDIR  /home/node/app
COPY package.json package-lock.json ./
RUN npm ci --quiet
RUN npm i -g @nestjs/cli  
COPY . .
