# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@shined/react-use` is a comprehensive, SSR-friendly React Hooks library developed in TypeScript. It provides 100+ high-quality, semantic hooks inspired by VueUse, react-use, and ahooks. The library emphasizes a "Hooks first" programming paradigm to reduce reliance on `useEffect` and `useState`.

**Key Principles:**
- **SSR-friendly**: All hooks must work with server-side rendering
- **Tree-shakable**: ESM-first design for optimal bundle sizes
- **Type-safe**: Full TypeScript support with JSDoc comments
- **Stable functions**: All exported functions are stabilized by default using `useStableFn`
- **Safe state**: Implements safe state strategies to prevent updates after unmount
- **Latest state**: Avoids stale closure issues using `useLatest` internally

## Repository Structure

This is a pnpm monorepo with the following structure:

```
packages/
  react-use/          # Main library package (@shined/react-use)
    src/
      use-*/          # Each hook in its own directory
        index.ts      # Hook implementation
        index.test.ts # Vitest tests
        index.cy.tsx  # Cypress component tests (optional)
        demo.tsx      # Demo component
        index.mdx     # English documentation
        index.zh-cn.mdx # Chinese documentation
      index.ts        # Central export file
docs/                 # RSPress documentation site
examples/             # Example projects (Next.js, Vite)
testing/              # Shared testing utilities
```

## Development Commands

### Build & Development
```bash
pnpm build              # Build all packages
pnpm dev               # Run all packages in watch mode
pnpm -C packages/react-use build  # Build only the library
pnpm -C packages/react-use dev    # Watch mode for library
```

### Linting & Type Checking
```bash
pnpm lint              # Run Biome + oxlint + typecheck
pnpm lint:fix          # Auto-fix linting issues
pnpm typecheck         # TypeScript type checking across all packages
```

### Testing
```bash
pnpm test              # Run Vitest tests with coverage
pnpm test:ci           # Full CI test suite (build + lint + test)
pnpm cy:open           # Open Cypress component testing UI
pnpm cy:run            # Run Cypress tests headlessly
```

**Test file patterns:**
- `*.test.ts(x)` - Standard Vitest unit tests
- `*.ssr.test.ts(x)` - SSR-specific tests
- `*.cy.ts(x)` - Cypress component tests

**Running a single test:**
```bash
vitest packages/react-use/src/use-boolean/index.test.ts
```

### Documentation
```bash
pnpm docs:dev          # Run docs dev server (builds library first)
pnpm docs:build        # Build documentation site
```

### Release
```bash
pnpm release           # Interactive version bump
pnpm publish:ci        # CI publish script
```

## Code Architecture

### Hook Implementation Pattern

All hooks follow a consistent structure:

1. **Type definitions first**: Export types before implementation
2. **JSDoc documentation**: Include `@since` version and parameter descriptions
3. **Use composition**: Build complex hooks from simpler ones
4. **Return stable references**: Use `useCreation` or `useMemo` for object returns
5. **Return readonly tuples**: Use `as const` for tuple returns

**Example structure:**
```typescript
export type UseHookOptions = { /* ... */ }
export type UseHookReturns = { /* ... */ }

/**
 * Hook description.
 *
 * @param options - Options description
 * @since 1.x.0
 */
export function useHook(options: UseHookOptions): UseHookReturns {
  // Implementation using other hooks
  const stable = useCreation(() => ({ /* ... */ }))
  return stable
}
```

### Core Utilities

**Foundation hooks** (located in `packages/react-use/src/`):
- `use-stable-fn` - Stabilizes function references (used internally everywhere)
- `use-latest` - Always returns latest value without re-renders
- `use-safe-state` - State that won't update after unmount
- `use-creation` - Like `useMemo` but for initialization only
- `use-pausable` - Adds pause/resume control to hooks
- `use-target-element` - Resolves element from ref, selector, or Element

**ElementTarget pattern:**
Most DOM-related hooks accept `ElementTarget` which can be:
- A React ref: `React.RefObject<Element>`
- A CSS selector: `string`
- An element getter: `() => Element | null`
- The element itself: `Element`

### Biome Configuration

The project uses Biome for linting with custom rules:
- Custom hooks are configured in `biome.json` for exhaustive deps checking
- Hooks with stable returns are marked with `stableResult: true`
- Line width: 120 characters
- Semicolons: as needed (not required)
- Quotes: single quotes preferred

### Testing Strategy

**Vitest setup:**
- Environment: jsdom with `pretendToBeVisual: true`
- Import alias: `@/test` points to `testing/` directory
- Auto cleanup and mock reset after each test

**SSR testing:**
- Use `renderHookServer` from `testing/render-hook-server.tsx`
- Files: `*.ssr.test.ts(x)`
- Ensure hooks don't break in server environments

### TypeScript Configuration

Multiple tsconfig files for different contexts:
- `tsconfig.json` - Root configuration
- `tsconfig.base.json` - Shared base
- `packages/react-use/tsconfig.build.json` - Build configuration
- `packages/react-use/tsconfig.test.json` - Test configuration
- `packages/react-use/tsconfig.cy.json` - Cypress configuration

## Creating a New Hook

1. Create directory: `packages/react-use/src/use-my-hook/`
2. Required files:
   - `index.ts` - Implementation
   - `index.test.ts` - Tests
   - `demo.tsx` - Usage demo
   - `index.mdx` - English docs
   - `index.zh-cn.mdx` - Chinese docs
3. Export from `packages/react-use/src/index.ts`
4. Add to Biome config if it has stable results
5. Run `pnpm build && pnpm test && pnpm lint`

## Common Patterns

### State Hooks
Always use `useSafeState` instead of `useState` for hooks that manage state. This prevents updates after unmount.

### Function Stabilization
Wrap callbacks and APIs in `useStableFn` or return them from `useCreation` to ensure stable references.

### Dependencies Collection
Many hooks support a `deps` parameter for manual control of when effects should re-run, following the "Dependencies Collection" pattern.

### Pausable Pattern
Complex hooks that involve intervals, event listeners, or observers should consider supporting the Pausable pattern via `usePausable`.

## Git Workflow

- Main branch: `main`
- Husky pre-commit: Runs `lint-staged` with Biome formatting
- Commit messages: Follow conventional commits (automated by `conventional-changelog`)
- After release: Changelog is auto-generated and committed

## Documentation

The documentation site uses RSPress and is located in the `docs/` directory. Each hook's documentation is co-located with its implementation in `.mdx` files. The site supports both English and Chinese languages.

## Performance & Bundle Size

- Target: ES5 for maximum compatibility
- Format: Both ESM and CJS
- Splitting: Enabled for better tree-shaking
- Source maps: Generated for debugging
- Package size is monitored via pkg-size.dev badge
