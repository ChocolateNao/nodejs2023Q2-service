# Home Library Service

## Prerequisites

### Runtime

- Git - [Download & Install Git](https://git-scm.com/downloads)
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager

### Docker

- Docker - [Get Docker](https://docs.docker.com/get-docker/)
- Docker Desktop - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

_For Linux users follow [here](https://docs.docker.com/desktop/install/linux-install/). Here's a simple [installation guide](https://gist.github.com/ChocolateNao/b0ac7b512471342f4cf1a8ef81d37de1) in case you're using Arch or its derivatives_

## Downloading

```bash
# Clone the repo
git clone https://github.com/ChocolateNao/nodejs2024Q1-service.git

# Navigate to the folder
cd ./nodejs2024Q1-service

# Switch to the development branch
git checkout feat/containerization-database-orm

# Set up the .env file
cp .env.example .env
```

## Installing NPM modules

```bash
npm install

# In case of using yarn
yarn install

# In case of using pnpm
pnpm install
```

## Running application

### 🐳 The Docker Way (Preferable)

Docker compose file inside a root folder reates two containers:
| Name | Address | Base Image |
|---|---|---|
| app-container | 0.0.0.0:4000->4000/tcp | node:lts-alpine3.19 |
| postgres-container | 0.0.0.0:5432->5432/tcp | postgres:alpine3.19 |

#### Pull Image

You can pull the [image](https://hub.docker.com/r/choconao/rest-music-service) from the official registry

```bash
docker pull choconao/rest-music-service
```

#### Run `docker-compose.yml`

To bootstrap the application with database included simply run

```bash
docker compose up -d
```

#### Misc

To stop all containers and its volumes/images associated with it (optionally) (i.e clear database, delete `node_modules`) run the following command

```bash
# Stop all running containers
docker compose down

# Stop containers and delete ALL volumes
docker compose down --volumes

# Stop containers and delete ALL volumes AND ALL images
docker compose down --volumes --rmi=all
```

To check the size of your images

```bash
docker images
```

To scan the built image for vulnerabilities run the npm script

_You have to be logged in into docker with `docker login` command as this script uses `docker scout` under the hood._

```bash
npm run scan:app
```

### The Traditional Way

Before starting the apllication the traditional way, you have to unstall PostgreSQL locally on your machine. Then, you have to point the app to the database i.e edit `.env` `DATABASE_URL` variable from `postgres` to `localhost`. This way you will be able to also reach the database inside a container. By default it's set to reach the containder's network.

```bash
# Generate SQL migration files
npx prisma migrate dev --name run

# Run the spplication
npm start
```

After starting the app on port (4000 as default or the one configured in `.env`) you can open
in your browser OpenAPI documentation by typing <http://localhost:4000/doc/>.
For more information about OpenAPI/Swagger please visit <https://swagger.io/>.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```bash
npx jest test/*.e2e.spec.ts
```

To run only one of all test suites

```bash
npm run test -- <path to suite>
```

To run all test with authorization

```bash
npm run test:auth
```

To run only specific test suite with authorization

```bash
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```bash
npm run lint
```

```bash
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: <https://code.visualstudio.com/docs/editor/debugging>
