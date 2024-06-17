import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  vi.resetAllMocks()
})

// madge --image graph.png --exclude '((index\.mdx)|(demo\.tsx))'  ./src/**/*

