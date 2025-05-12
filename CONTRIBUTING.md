# Contributing to Design Tokens Format Module

Thank you for your interest in contributing to the Design Tokens Format Module! This document provides guidelines and instructions to help you get started.

## Getting Started

### Prerequisites

- Node.js (preferably the latest LTS version)
- npm

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally
   ```bash
   git clone https://github.com/YOUR-USERNAME/design-tokens-format-module.git
   cd design-tokens-format-module
   ```
3. Add the original repository as an upstream remote
   ```bash
   git remote add upstream https://github.com/nclsndr/design-tokens-format-module.git
   ```
4. Install dependencies
   ```bash
   npm install
   ```

## Development Workflow

1. Create a new branch for your feature or bugfix
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or
   ```bash
   git checkout -b fix/issue-you-are-fixing
   ```

2. Make your changes and commit them using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

   We follow the Conventional Commits specification which provides a standardized format for commit messages:
   ```
   <type>([optional scope]): <description>
   
   [optional body]
   
   [optional footer(s)]
   ```
   
   Common types include:
   - `feat`: A new feature
   - `fix`: A bug fix
   - `docs`: Documentation changes
   - `style`: Changes that don't affect the code's meaning (formatting, etc.)
   - `refactor`: Code changes that neither fix a bug nor add a feature
   - `test`: Adding or correcting tests
   - `chore`: Changes to the build process or auxiliary tools

3. Keep your branch updated with the upstream main branch
   ```bash
   git pull upstream main
   ```

## Code Style and Formatting

This project uses Prettier for code formatting. The configuration is defined in `.prettierrc.json`.

### Formatting Your Code

Before submitting a pull request, make sure your code is properly formatted:

```bash
# Format all files
npm run format

# Check formatting without modifying files
npx prettier --check .
```

## Testing

The project uses Vitest for testing. Make sure to add tests for any new features or bug fixes.

### Running Tests

```bash
# Run tests in watch mode during development
npm run test

# Run tests once (e.g., before submitting a PR)
npm run test -- --run
```

### Test Coverage

To generate a test coverage report:

```bash
npm run test -- --coverage
```

## Building

The project uses TypeScript for type safety and transpilation.

### Building the Project

```bash
npm run build
```

This command cleans the `dist` directory and rebuilds the project according to the TypeScript configuration.

### Type Checking

To run the TypeScript compiler without emitting files (useful for checking types):

```bash
npm run tsc
```

## Pull Requests

1. Push your changes to your fork
   ```bash
   git push origin your-branch-name
   ```

2. Open a pull request against the main repository's `main` branch

3. Ensure your PR includes:
   - A clear description of the changes
   - Any relevant issue numbers (use "#123" to link to issue 123)
   - Updated or new tests covering your changes
   - Documentation updates if needed

4. Before opening a PR, make sure:
   - Tests pass: `npm run test -- --run`
   - The build succeeds: `npm run build`
   - Code is properly formatted: `npm run format`

## Code of Conduct

Please be respectful and considerate of others when contributing to this project. We strive to maintain a welcoming and inclusive environment for everyone.

## Questions?

If you have any questions or need help, feel free to open an issue or reach out to @nclsndr.

Thank you for contributing to the Design Tokens Format Module! 