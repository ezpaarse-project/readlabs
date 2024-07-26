export interface ApiKeyConfig {
  name: string,
  owner: string,
  description: string,
  attributes: string[],
  allowed: boolean
  createdAt?: string
}

export interface ApiKey {
  apikey: string
  config: ApiKeyConfig
}
