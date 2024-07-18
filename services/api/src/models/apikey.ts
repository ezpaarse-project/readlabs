export interface ApiKeyConfig {
  name: string,
  owner: string,
  description: string,
  attributes: string[],
  allowed: boolean
}

export interface ApiKey {
  apikey: string
  config: {
    name: string,
    owner: string,
    description: string,
    attributes: string[],
    allowed: boolean
  }
}
