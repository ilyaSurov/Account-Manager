<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-6">
        <!-- Заголовок и кнопка добавления -->
        <v-row class="mb-6">
          <v-col cols="12" class="d-flex align-center justify-space-between">
            <h1 class="text-h4 font-weight-bold">Управление учетными записями</h1>
            <v-btn
              icon="mdi-plus"
              color="primary"
              size="large"
              elevation="2"
              @click="handleAddAccount"
            />
          </v-col>
        </v-row>

        <!-- Список аккаунтов -->
        <v-row v-if="store.accounts.length === 0">
          <v-col cols="12">
            <v-alert
              type="info"
              variant="tonal"
              border="start"
            >
              Нет учетных записей. Нажмите "+" для добавления.
            </v-alert>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12">
            <AccountForm
              v-for="account in store.accounts"
              :key="account.id"
              :account="account"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAccountsStore } from '@/stores/accounts'
import AccountForm from '@/components/AccountForm.vue'

const store = useAccountsStore()

const handleAddAccount = () => {
  store.addAccount()
}
</script>

<style scoped>
/* Дополнительные стили при необходимости */
</style>
