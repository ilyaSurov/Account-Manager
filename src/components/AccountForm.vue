<template>
  <v-card class="mb-4" elevation="2">
    <v-card-text>
      <v-row>
        <!-- Метка -->
        <v-col cols="12" md="3">
          <v-text-field
            v-model="labelInputString"
            label="Метка"
            density="comfortable"
            variant="outlined"
            :error="errors.label"
            :placeholder="labelHint"
            :hint="labelHint"
            persistent-hint
            @blur="handleLabelBlur"
            hide-details="auto"
            :error-messages="errors.label ? 'Максимум 50 символов' : ''"
          >
            <template v-slot:append-inner v-if="localAccount.label.length > 0">
              <div class="d-flex flex-wrap gap-1">
                <v-chip
                  v-for="(item, index) in localAccount.label"
                  :key="index"
                  size="x-small"
                  color="primary"
                  variant="flat"
                >
                  {{ item.text }}
                </v-chip>
              </div>
            </template>
          </v-text-field>
        </v-col>

        <!-- Тип записи -->
        <v-col cols="12" md="2">
          <v-select
            v-model="localAccount.type"
            :items="typeItems"
            item-title="title"
            item-value="value"
            label="Тип записи"
            density="comfortable"
            variant="outlined"
            @update:model-value="handleTypeChange"
            hide-details
          />
        </v-col>

        <!-- Логин -->
        <v-col cols="12" md="3">
          <v-text-field
            v-model="localAccount.login"
            label="Логин"
            density="comfortable"
            variant="outlined"
            :error="errors.login"
            @blur="handleLoginBlur"
            hide-details="auto"
            :error-messages="errors.login ? 'Обязательное поле, макс. 100 символов' : ''"
          />
        </v-col>

        <!-- Пароль -->
        <v-col cols="12" md="3" v-if="localAccount.type === 'Local'">
          <v-text-field
            v-model="localAccount.password"
            label="Пароль"
            type="password"
            density="comfortable"
            variant="outlined"
            :error="errors.password"
            @blur="handlePasswordBlur"
            hide-details="auto"
            :error-messages="errors.password ? 'Обязательное поле, макс. 100 символов' : ''"
          />
        </v-col>

        <!-- Кнопка удаления -->
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
import { ref, watch } from 'vue'
import type { Account } from '@/types/account'
import { useAccountsStore } from '@/stores/accounts'

const labelHint = 'Метки через точку с запятой, например: admin; dev'

const typeItems = [
  { title: 'LDAP', value: 'LDAP' as const },
  { title: 'Локальная', value: 'Local' as const }
]

interface Props {
  account: Account
}

const props = defineProps<Props>()
const store = useAccountsStore()

const localAccount = ref<Account>(normalizeAccount(props.account))

/** Строка для ввода метки (отображаемая в input); при сохранении парсится в label[] */
const labelInputString = ref(stringFromLabel(localAccount.value.label))

function stringFromLabel(label: { text: string }[]): string {
  return label.map(item => item.text).join('; ')
}

function labelFromString(s: string): { text: string }[] {
  if (!s.trim()) return []
  return s
    .split(';')
    .map(part => part.trim())
    .filter(part => part.length > 0)
    .map(text => ({ text }))
}

/** Приводит аккаунт к формату ТЗ (label — массив); миграция со старого формата */
function normalizeAccount(account: Account & { label?: unknown }): Account {
  const raw = account.label
  const label: { text: string }[] = Array.isArray(raw)
    ? raw
    : typeof raw === 'string'
      ? labelFromString(raw)
      : []
  return { ...account, label }
}

const errors = ref({
  label: false,
  login: false,
  password: false
})

const validateLabel = () => {
  if (labelInputString.value.length > 50) {
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

const handleLabelBlur = () => {
  if (!validateLabel()) return
  localAccount.value.label = labelFromString(labelInputString.value)
  store.updateAccount(localAccount.value)
}

const handleLoginBlur = () => {
  if (validateLogin()) {
    store.updateAccount(localAccount.value)
  }
}

const handlePasswordBlur = () => {
  if (validatePassword()) {
    store.updateAccount(localAccount.value)
  }
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

watch(() => props.account, (newAccount: Account & { label?: unknown }) => {
  const normalized = normalizeAccount(newAccount)
  localAccount.value = normalized
  labelInputString.value = stringFromLabel(normalized.label)
}, { deep: true })
</script>

<style scoped>
.gap-1 {
  gap: 4px;
}
</style>
