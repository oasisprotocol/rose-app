export enum CardConfigLabel {
  Grant = 'grant',
}

export interface CardConfig {
  title: string
  labels?: CardConfigLabel[]
  type?: string
  imgSrc: string
  externalLink: string
}
