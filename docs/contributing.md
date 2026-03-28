# Contributing to utility-ts

Thank you for your interest in contributing to utility-ts! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in the issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (Node.js version, OS, etc.)
   - Code examples if applicable

### Suggesting Features

1. Check if the feature has already been suggested
2. Create a new issue with:
   - Clear description of the feature
   - Use case and motivation
   - Proposed API or interface
   - Examples of how it would be used

### Submitting Changes

1. **Fork the repository**
2. **Create a branch** from `dev`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**:
   - Follow the code style and conventions
   - Add JSDoc comments for new functions
   - Update documentation if needed
4. **Build and test**:
   ```bash
   pnpm run build
   ```
5. **Commit your changes**:
   - Use conventional commit format
   - Write clear commit messages
6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**:
   - Target the `dev` branch
   - Provide a clear description
   - Reference related issues

## Development Setup

See [onboarding.md](onboarding.md) for detailed setup instructions.

Quick setup:

```bash
git clone git@github-first:Arunkumarcs/utility-ts.git
cd utility-ts
pnpm install
pnpm run build
```

## Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Avoid `any` types in public APIs
- Use explicit return types for exported functions
- Follow existing code style

### Code Style

- Use meaningful variable and function names
- Keep functions focused and single-purpose
- Add JSDoc comments for all public functions
- Follow existing formatting (spaces, line length, etc.)

### Example Function

```typescript
/**
 * Brief description of what the function does
 * @param param1 - Description of parameter 1
 * @param param2 - Description of parameter 2
 * @returns Description of return value
 * @example
 * const result = myFunction('value1', 'value2');
 * // Returns: 'processed value'
 */
export function myFunction(param1: string, param2: number): string {
  // Implementation
}
```

## Module Organization

### Adding New Utilities

- **General utilities**: Add to `src/utils.ts` or create new module if it's a distinct category
- **CDK utilities**: Add to appropriate module in `src/cdk/` or create new module
- **New module**: Create new file and export from appropriate index

### Module Structure

Each module should:
- Have a clear, single responsibility
- Export all public functions and types
- Include JSDoc documentation
- Be tree-shakeable (no side effects)

## Testing

While a test suite is not yet implemented, when adding tests:

- Write unit tests for all new functions
- Aim for high code coverage
- Test edge cases and error conditions
- Keep tests simple and readable

## Documentation

### Code Documentation

- Add JSDoc comments to all public functions
- Include parameter descriptions
- Include return value descriptions
- Add usage examples where helpful

### Project Documentation

- Update `README.md` for user-facing changes
- Update `docs/architecture.md` for architectural changes
- Create ADRs for significant architectural decisions
- Update `docs/onboarding.md` if setup process changes

## Pull Request Process

1. **Ensure your code builds**:
   ```bash
   pnpm run build
   ```

2. **Check for issues**:
   - No TypeScript errors
   - Code follows style guidelines
   - Documentation is updated

3. **Write a good PR description**:
   - What changes were made
   - Why the changes were made
   - How to test the changes
   - Any breaking changes

4. **Respond to feedback**:
   - Address review comments
   - Make requested changes
   - Keep discussions constructive

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(cdk): add stack naming utility
fix(naming): resolve resource name generation issue
docs(readme): update installation instructions
refactor(utils): improve function organization
```

## Review Process

- All PRs require at least one review
- Maintainers will review for:
  - Code quality and style
  - Functionality and correctness
  - Documentation completeness
  - Breaking changes
- Address feedback promptly
- PRs may be merged after approval

## Release Process

- Releases are made from the `main` branch
- Version numbers follow [Semantic Versioning](https://semver.org/)
- Release notes are generated from commit messages
- Releases are published to npm

## Questions?

- Open an issue for questions or discussions
- Check existing documentation first
- Be patient - maintainers are volunteers

Thank you for contributing to utility-ts! 🎉

