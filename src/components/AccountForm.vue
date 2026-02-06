<template>
  <v-card class="mb-4" elevation="2">
    <v-card-text>
      <v-row>
        <!-- Label Field -->
        <v-col cols="12" md="3">
          <v-text-field
            v-model="localAccount.label"
            label="Label"
            density="comfortable"
            variant="outlined"
            :error="errors.label"
            @blur="validateLabel"
            @update:model-value="handleLabelUpdate"
            hide-details="auto"
            :error-messages="errors.label ? 'Максимум 50 символов' : ''"
          >
            <template v-slot:append-inner v-if="labelChips.length > 0">
              <div class="d-flex flex-wrap gap-1">
                <v-chip
                  v-for="(chip, index) in labelChips"
                  :key="index"
                  size="x-small"
                  color="primary"
                  variant="flat"
                >
                  {{ chip.text }}
                </v-chip>
              </div>
            </template>
          </v-text-field>
        </v-col>

        <!-- Type Field -->
        <v-col cols="12" md="2">
          <v-select
            v-model="localAccount.type"
            :items="['LDAP', 'Local']"
            label="Type"
            density="comfortable"
            variant="outlined"
            @update:model-value="handleTypeChange"
            hide-details
          />
        </v-col>

        <!-- Login Field -->
        <v-col cols="12" md="3">
          <v-text-field
            v-model="localAccount.login"
            label="Login"
            density="comfortable"
            variant="outlined"
            :error="errors.login"
            @blur="validateLogin"
            @update:model-value="handleLoginUpdate"
            hide-details="auto"
            :error-messages="errors.login ? 'Обязательное поле, макс. 100 символов' : ''"
          />
        </v-col>

        <!-- Password Field -->
        <v-col cols="12" md="3" v-if="localAccount.type === 'Local'">
          <v-text-field
            v-model="localAccount.password"
            label="Password"
            type="password"
            density="comfortable"
            variant="outlined"
            :error="errors.password"
            @blur="validatePassword"
            @update:model-value="handlePasswordUpdate"
            hide-details="auto"
            :error-messages="errors.password ? 'Обязательное поле, макс. 100 символов' : ''"
          />
        </v-col>

        <!-- Delete Button -->
        <v-col cols="12" md="1" class="d-flex align-center">
          <v-btn
            icon="mdi-delete"
            color="error"
            variant="text"
            @click="handleDelete"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Account } from '@/types/account'
import { useAccountsStore } from '@/stores/accounts'

interface Props {
  account: Account
}

const props = defineProps<Props>()
const store = useAccountsStore()

const localAccount = ref<Account>({ ...props.account })

const errors = ref({
  label: false,
  login: false,
  password: false
})

// Parse label для отображения чипов
const labelChips = computed(() => {
  if (!localAccount.value.label) return []
  return localAccount.value.label
    .split(';')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .map(tag => ({ text: tag }))
})

// Валидация label
const validateLabel = () => {
  if (localAccount.value.label.length > 50) {
    errors.value.label = true
    return false
  }
  errors.value.label = false
  return true
}

// Валидация login
const validateLogin = () => {
  if (!localAccount.value.login || localAccount.value.login.length === 0) {
    errors.value.login = true
    return false
  }
  if (localAccount.value.login.length > 100) {
    errors.value.login = true
    return false
  }
  errors.value.login = false
  return true
}

// Валидация password
const validatePassword = () => {
  if (localAccount.value.type === 'Local') {
    if (!localAccount.value.password || localAccount.value.password.length === 0) {
      errors.value.password = true
      return false
    }
    if (localAccount.value.password.length > 100) {
      errors.value.password = true
      return false
    }
  }
  errors.value.password = false
  return true
}

// Обработчики изменений
const handleLabelUpdate = () => {
  if (validateLabel()) {
    store.updateAccount(localAccount.value)
  }
}

const handleLoginUpdate = () => {
  // Обновляем сразу, но показываем ошибку если невалидно
  store.updateAccount(localAccount.value)
}

const handlePasswordUpdate = () => {
  // Обновляем сразу, но показываем ошибку если невалидно
  store.updateAccount(localAccount.value)
}

const handleTypeChange = (newType: 'LDAP' | 'Local') => {
  if (newType === 'LDAP') {
    localAccount.value.password = null
    errors.value.password = false
  } else {
    localAccount.value.password = ''
  }
  store.updateAccount(localAccount.value)
}

const handleDelete = () => {
  store.removeAccount(localAccount.value.id)
}

// Синхронизация с props
watch(() => props.account, (newAccount) => {
  localAccount.value = { ...newAccount }
}, { deep: true })
</script>

<style scoped>
.gap-1 {
  gap: 4px;
}
</style>
