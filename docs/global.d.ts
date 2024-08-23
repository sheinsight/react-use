type Category = string

type Feature = 'Pausable' | 'IsSupported' | 'LowLevel' | 'DevOnly'

declare const frontmatter: {
  category: Category
  features: Feature[]
  deprecated?: boolean
}
