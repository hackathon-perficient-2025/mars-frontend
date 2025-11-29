# Frontend CI/CD Workflows

## 📋 Workflows

### `ci.yml` - Continuous Integration

Runs on every push and pull request to main branches.

**Steps:**

1. Sets up pnpm and Node.js 20
2. Installs dependencies with frozen lockfile
3. Runs Vitest unit tests
4. Runs ESLint for code quality
5. Builds production bundle
6. Uploads test results and build artifacts

## 🚀 Usage

### Run Tests Locally

```bash
pnpm test -- --run
pnpm lint
pnpm build
```

### Watch Mode

```bash
pnpm test
```

## 📊 Artifacts

- **Test Results** - 30 days retention
- **Build Artifacts** (dist/) - 7 days retention

## 🌐 Vercel Deployment

Frontend is configured for auto-deployment on Vercel:

- Pushes to main/master trigger automatic deployments
- Preview deployments for pull requests
- This CI workflow runs independently for validation

## ✅ Status Checks

The CI workflow must pass before merging PRs to main branches.
