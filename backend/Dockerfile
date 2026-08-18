FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile || yarn install

# Copy source files
COPY . .

EXPOSE 5000

ENV NODE_ENV=production

CMD ["yarn", "start"]
