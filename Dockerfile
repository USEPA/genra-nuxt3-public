FROM ghcr.io/usepa/node-20:latest

ARG GITHUB_TOKEN

WORKDIR /genra/

COPY ./package.json ./pnpm-lock.yaml /genra/

RUN npm install -g pnpm

COPY . /genra/

RUN echo "@usepa:registry=https://npm.pkg.github.com" > .npmrc \
 && echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc \
 && pnpm install
RUN pnpm build

CMD ["pnpm", "start"]
