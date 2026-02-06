export interface LabelItem {
  text: string
}

export interface Account {
  id: string
  /** В стейте хранится массив { text: элемент }, не строка */
  label: LabelItem[]
  type: 'LDAP' | 'Local'
  login: string
  password?: string | null // null для LDAP
}
