export interface Settings {
  ['skip-hidden']: boolean
  include: string[]
  exclude: string[]
  filenames: string[]
  output: string
  depth: number
}

export type RcSettings = Partial<Settings>
