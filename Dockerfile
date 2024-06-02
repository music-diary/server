# Deploy to AWS Elastic Beanzstalk in node.js environment
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci

# Bundle app source
COPY . .

EXPOSE 5000

CMD [ "npm", "start" ]


