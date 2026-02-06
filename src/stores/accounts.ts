import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { Account } from '@/types/account'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])

  const addAccount = () => {
    const newAccount: Account = {
      id: uuidv4(),
      label: '',
      type: 'Local',
      login: '',
      password: ''
    }
    accounts.value.push(newAccount)
  }

  const removeAccount = (id: string) => {
    const index = accounts.value.findIndex(acc => acc.id === id)
    if (index !== -1) {
      accounts.value.splice(index, 1)
    }
  }

  const updateAccount = (account: Account) => {
    const index = accounts.value.findIndex(acc => acc.id === account.id)
    if (index !== -1) {
      accounts.value[index] = account
    }
  }

  return {
    accounts,
    addAccount,
    removeAccount,
    updateAccount
  }
}, {
  persist: true
})
