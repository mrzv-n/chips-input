<template>
  <div
    :class="['chips-input', rootClassNames]"
    @click="focusInput"
  >
    <div class="chips-input__container">
      <div class="chips-input__body">
        <div class="chips-input__chips">
          <div
            v-for="(item, index) in model"
            :key="item + index"
            :class="['chip', chipClassNames]"
          >
            <div class="chip__label">{{ item }}</div>
            <button
              v-if="!disabled"
              class="chip__remove-btn"
            >
              <CrossIcon class="chip__remove-icon" />
            </button>
          </div>
          <input
            ref="inputField"
            :disabled="disabled"
            class="chips-input__input"
            type="text"
            v-model="inputValue"
            @keydown="handleKeyDown"
            @blur="handleBlur"
          />
        </div>
      </div>
      <label class="chips-input__label">{{ label }}</label>
    </div>
    <p class="chips-input__info">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue'
import CrossIcon from '@/assets/img/icons/cross.svg'

export interface ChipsInputProps {
  model: string[]
  label?: string
  placeholder?: string
  max?: number
  addOnBlur?: boolean
  allowDuplicate?: boolean
  disabled?: boolean
  validator?: () => boolean
  message?: string
  separators?: string[]
}

const props = withDefaults(defineProps<ChipsInputProps>(), {
  label: '',
  placeholder: '',
  max: Infinity,
  addOnBlur: true,
  allowDuplicate: true,
  disabled: true,
  validator: () => true,
  hint: '',
  separators: () => [',', ' ', '\n']
})

const emit = defineEmits(['update:model', 'add', 'remove', 'focus', 'blur'])

const chips = ref([...props.model])
const error = ref(false)
const inputField = ref<HTMLInputElement>()
const inputValue = ref('')
const rootClassNames = computed(() => ({
  _error: error.value,
  _disabled: props.disabled,
  _active: props.model.length || inputValue.value
}))
const chipClassNames = computed(() => ({
  _error: error.value,
  _disabled: props.disabled
}))

function focusInput(): void {
  inputField.value!.focus()
}

function handleKeyDown(e: KeyboardEvent): void {
  if ((isKeySeparator(e.key) || e.key === 'Enter') && inputValue.value.trim().length) {
    e.preventDefault()

    if (isInputCaretOnEnd()) {
      addChip(inputValue.value)
      clearInputValue()
    }
  }
}

function handleBlur(): void {
  if (props.addOnBlur && inputValue.value) {
    addChip(inputValue.value)
    clearInputValue()
  }
}

function clearInputValue(): void {
  inputValue.value = ''
}

function isInputCaretOnStart(): boolean {
  return inputField.value!.selectionStart === 0
}

function isInputCaretOnEnd(): boolean {
  return inputField.value!.selectionStart === inputValue.value!.length
}

function addChip(chipValue: string): void {
  if (!props.allowDuplicate && chips.value.includes(chipValue)) return

  chips.value.push(chipValue)
  emit('update:model', chips.value)
}

function isKeySeparator(key: string): boolean {
  return props.separators.includes(key)
}
</script>
