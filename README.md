# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```bash
# Clone the repo
git clone https://github.com/ChocolateNao/nodejs2024Q1-service.git

# Navigate to the folder
cd ./nodejs2024Q1-service

# Switch to the development branch
git checkout dev

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

```bash
npm start
```

After starting the app on port (4000 as default or the one configured in `.env`) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```bash
npm run test
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

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
