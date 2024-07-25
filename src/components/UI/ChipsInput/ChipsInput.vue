<template>
  <div
    :class="['chips-input', rootClassNames]"
    @click="focusInput"
  >
    <div class="chips-input__container">
      <div class="chips-input__body">
        <div class="chips-input__chips">
          <div
            v-for="(chipLabel, index) in model"
            :key="chipLabel + index"
            :ref="(chip) => addChipRef(chip, index)"
            :class="['chip', chipClassNames]"
            role="option"
            tabindex="0"
            @click.stop="(e) => handleChipClick(e, index)"
            @keydown="(e) => handleChipKeyDown(e, index)"
          >
            <div class="chip__label">{{ chipLabel }}</div>
            <button
              v-if="!disabled"
              class="chip__remove-btn"
              @click.stop="() => removeChip(index, chipLabel)"
              tabindex="-1"
            >
              <CrossIcon class="chip__remove-icon" />
            </button>
          </div>
          <input
            v-model="inputValue"
            :id="fieldId"
            ref="inputField"
            :disabled="disabled"
            class="chips-input__input"
            type="text"
            :aria-describedby="hintId"
            @input="resizeInput"
            @keydown="handleKeyDown"
            @blur="handleBlur"
            @focus="handleFocus"
          />
        </div>
      </div>
      <label
        :for="fieldId"
        class="chips-input__label"
        >{{ label }}</label
      >
    </div>
    <p
      v-if="hint"
      :id="hintId"
      class="chips-input__info"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import {
  defineProps,
  ref,
  computed,
  type ComponentPublicInstance
} from 'vue'
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
  hint?: string
  separators?: string[]
}

const props = withDefaults(defineProps<ChipsInputProps>(), {
  label: '',
  placeholder: '',
  max: Infinity,
  addOnBlur: true,
  allowDuplicate: true,
  disabled: false,
  validator: () => true,
  hint: '',
  separators: () => [',', ' ', '\n']
})

const emit = defineEmits(['update:model', 'add', 'remove', 'focus', 'blur'])

const chips = ref([...props.model])
const error = ref(false)
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

const inputField = ref<HTMLInputElement | null>(null)
let chipRefs: HTMLElement[] = []

const fieldId = `input-${Date.now()}`
const hintId = `hint-${Date.now()}`

function addChipRef(chipRef: Element | ComponentPublicInstance | null, index: number) {
  if (chipRef) {
    chipRefs[index] = chipRef as HTMLElement
  }
}

function focusInput(): void {
  inputField.value?.focus()
}

function handleKeyDown(e: KeyboardEvent): void {
  if ((isKeySeparator(e.key) || e.key === 'Enter') && inputValue.value.trim().length) {
    e.preventDefault()

    if (isInputCaretOnEnd()) {
      addChip(inputValue.value)
      clearInputValue()
    }
  }

  if (isInputCaretOnStart() && e.key === 'ArrowLeft' && chips.value.length) {
    const lastChipIndex = chips.value.length - 1

    chipRefs[lastChipIndex].focus()
  }
}

function handleChipKeyDown(e: KeyboardEvent, index: number): void {
  let currentIndex = index

  if (e.key === 'ArrowLeft' && currentIndex > 0) {
    chipRefs[--currentIndex].focus()
  }
  if (e.key === 'ArrowRight') {
    currentIndex < chips.value.length - 1 ? chipRefs[++currentIndex].focus() : focusInput()
  }

  if (e.key === 'Backspace') {
    removeChip(currentIndex, chips.value[currentIndex])
  }
}

function handleChipClick(e: Event, index: number): void {
  chipRefs[index].focus()
}

function handleFocus(): void {
  emit('focus')
}

function handleBlur(): void {
  if (props.addOnBlur && inputValue.value) {
    addChip(inputValue.value)
    clearInputValue()
  }

  emit('blur')
}

function addChip(chipLabel: string): void {
  if (!props.allowDuplicate && chips.value.includes(chipLabel)) return

  chips.value.push(chipLabel)
  emit('add', chipLabel)
  emit('update:model', chips.value)
}

function removeChip(index: number, chipLabel: string): void {
  // Реализовано через slice и в emit('remove') передается объект, так как возможны одноименные чипсы
  chips.value = [...chips.value.slice(0, index), ...chips.value.slice(index + 1)]

  emit('remove', {
    index,
    chipLabel
  })
  emit('update:model', chips.value)

  focusInput()
}

function clearInputValue(): void {
  inputValue.value = ''
}

function isInputCaretOnStart(): boolean {
  return inputField.value ? inputField.value.selectionStart === 0 : false
}

function isInputCaretOnEnd(): boolean {
  return inputField.value ? inputField.value.selectionStart === inputValue.value.length : false
}

function isKeySeparator(key: string): boolean {
  return props.separators.includes(key)
}

function resizeInput(): void {
  if (inputField.value) {
    inputField.value.style.width = inputValue.value.length + 'ch'
  }
}
</script>
