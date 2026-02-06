export interface Account {
  id: string // uuid
  label: string // raw string "tag1; tag2"
  type: 'LDAP' | 'Local'
  login: string
  password?: string | null // null для LDAP
}
