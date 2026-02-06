# Account Manager

Приложение для управления учетными записями (LDAP и Local).

## Технологии

- **Vue 3** - Composition API + `<script setup>`
- **TypeScript** - строгая типизация
- **Pinia** - state management с persist в localStorage
- **Vuetify 3** - UI компоненты
- **Vite** - сборщик
- **@vueuse/core** - утилиты для Vue
- **uuid** - генерация уникальных ID

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для production
npm run build

# Предпросмотр production build
npm run preview
```

## Функциональность

### Основные возможности

- ✅ Добавление аккаунтов
- ✅ Удаление аккаунтов
- ✅ Редактирование с автосохранением
- ✅ Валидация полей
- ✅ Persist в localStorage
- ✅ Responsive дизайн

### Типы аккаунтов

- **Local** - требует login и password
- **LDAP** - требует только login, password = null

### Валидация

- **Login**: обязательное, макс. 100 символов
- **Password**: обязательное для Local, макс. 100 символов
- **Label**: опционально, макс. 50 символов

Валидация срабатывает на:
- `blur` для текстовых полей
- `change` для select

### Label (теги)

Формат: `"tag1; tag2; tag3"`

Отображается как чипы в UI, хранится как строка с разделителем `;`

## Структура проекта

```
src/
├── types/
│   └── account.ts          # TypeScript интерфейсы
├── stores/
│   └── accounts.ts         # Pinia store
├── components/
│   └── AccountForm.vue     # Форма аккаунта
├── App.vue                 # Главный компонент
└── main.ts                 # Точка входа
```

## Коммиты

```
feat: setup vue3 ts pinia vuetify
feat: accounts store + persist
feat: account form + validation
fix: label chips parsing
feat: ldap password toggle
style: responsive + polish
```
