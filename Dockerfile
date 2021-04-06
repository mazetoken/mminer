FROM node:12-buster-slim

RUN apt update && apt install -y git g++ gcc make cmake python3 libstdc++6

ADD . /srv

WORKDIR /srv

RUN cd fastmine && cmake . && make

RUN npm install --unsafe-perm --build-from-source
RUN npm run tsc

CMD ["node", "src/miner"]

