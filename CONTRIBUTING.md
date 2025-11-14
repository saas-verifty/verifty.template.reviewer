# Contributing to Verifty Template Reviewer

Thank you for your interest in contributing to this project. Please follow these guidelines to ensure smooth collaboration.

## Governance & Requirements

### Corporate Email Requirement

All commits MUST use a @verifty.com email address. This is enforced by:
- Pre-commit hooks (local validation)
- CI pipeline (automated validation)

Configure your email:

```bash
git config user.email your.name@verifty.com
```

### Branch Protection

- The `main` branch is protected
- Direct pushes to `main` are not allowed
- All changes must go through Pull Requests
- All CI checks must pass before merging
- Code review is required

## Development Workflow

### 1. Create a Feature Branch

Use descriptive branch names following these conventions:

```bash
# For new features
git checkout -b feature/add-user-authentication

# For bug fixes
git checkout -b fix/header-alignment-issue

# For improvements
git checkout -b improve/api-error-handling
```

### 2. Make Changes

- Write clean, maintainable code
- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation as needed

### 3. Commit Guidelines

#### Commit Often
- Make small, focused commits
- Each commit should represent a logical unit of work
- Commit frequently to track progress

#### Commit Message Format

```
<type>: <short description>

<optional longer description>

<optional footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:

```
feat: add user authentication module

Implements JWT-based authentication with login and logout functionality.
Includes token refresh mechanism and protected routes.
```

```
fix: resolve header alignment on mobile devices

The navigation header was misaligned on screens smaller than 768px.
Updated CSS flexbox properties to fix the issue.
```

### 4. Pre-commit Validation

Before committing, the following checks run automatically:

- ✅ Corporate email validation
- ✅ TypeScript type checking
- ✅ ESLint linting
- ✅ Prettier formatting

If any check fails, fix the issues before committing.

### 5. Push and Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create PR via GitHub UI
```

### 6. Pull Request Requirements

Your PR must:

- Have a clear, descriptive title
- Include a detailed description of changes
- Reference any related issues
- Pass all CI checks
- Have at least one approved review
- Have all commits using @verifty.com emails

## Code Quality Standards

### TypeScript

- Use strict TypeScript mode
- Define proper types for all functions and variables
- Avoid `any` type when possible
- Use interfaces for object shapes

### Testing

- Write tests for new features
- Maintain minimum 70% code coverage
- Follow AAA pattern (Arrange, Act, Assert)
- Use descriptive test names

Example:

```typescript
describe('UserService', () => {
  it('should return user data when login is successful', async () => {
    // Arrange
    const credentials = { email: 'test@verifty.com', password: 'pass123' }

    // Act
    const result = await userService.login(credentials)

    // Assert
    expect(result).toBeDefined()
    expect(result.token).toBeTruthy()
  })
})
```

### Code Style

- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Prefer named exports over default exports
- Keep components small and focused
- Use path aliases (@/) for imports

## Running Quality Checks Locally

Before pushing, run these commands:

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Formatting
npm run format

# All tests
npm run test

# Everything together
npm run typecheck && npm run lint && npm run test && npm run build
```

## Feature Development Guide

### Creating a New Feature

1. Create feature directory structure:

```
src/features/your-feature/
├── components/
│   └── YourComponent.tsx
├── hooks/
│   └── useYourFeature.ts
├── pages/
│   └── YourPage.tsx
├── services/
│   └── yourService.ts
└── types/
    └── index.ts
```

2. Define types first (types/index.ts)
3. Implement service layer (services/)
4. Create custom hooks (hooks/)
5. Build components (components/)
6. Assemble pages (pages/)
7. Write tests
8. Update documentation

## Pull Request Review Process

1. **Automated Checks** - CI pipeline validates:
   - Corporate email compliance
   - TypeScript compilation
   - Linting rules
   - Test coverage
   - Production build

2. **Code Review** - Reviewers check for:
   - Code quality and maintainability
   - Proper testing
   - Documentation updates
   - Security concerns
   - Performance implications

3. **Approval & Merge** - Once approved:
   - Squash and merge (preferred)
   - Rebase and merge (for clean history)
   - Delete feature branch after merge

## Reporting Issues

When reporting bugs:

1. Use GitHub Issues
2. Provide clear reproduction steps
3. Include environment details
4. Attach screenshots if relevant
5. Mention expected vs actual behavior

## Getting Help

- Check existing documentation
- Search closed issues
- Ask in team chat
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the same terms as the project.
