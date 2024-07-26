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
            @paste="handlePaste"
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
import { defineProps, ref, computed, type ComponentPublicInstance } from 'vue'
import CrossIcon from '@/assets/img/icons/cross.svg'

const props = withDefaults(
  defineProps<{
    /**
     * Список токенов
     */
    model: string[]
    /**
     * Заголовок поля
     */
    label?: string
    /**
     * Максимальное количество токенов, которые могут быть добавлены в поле
     */
    max?: number
    /**
     * Параметр разрешающий / запрещающий добавление токена при потере фокуса на поле
     */
    addOnBlur?: boolean
    /**
     * Параметр разрешающий / запрещающий повторяющиеся значения токенов
     */
    allowDuplicate?: boolean
    /**
     * Определяет состояние блокировки поля
     */
    disabled?: boolean
    /**
     * Функция для валидации значений токенов. Вызывается для каждого токена. Должна
     * возвращать true - для валидного, false - для невалидного значения
     */
    validator?: (value: string) => boolean
    /**
     * Подсказка под элементом ввода
     */
    hint?: string
    /**
     * Массив допустимых разделителей для разбиения строки на токены
     */
    separators?: string[]
  }>(),
  {
    label: '',
    placeholder: '',
    max: Infinity,
    addOnBlur: true,
    allowDuplicate: true,
    disabled: false,
    validator: () => true,
    hint: '',
    separators: () => [',', ' ', '\n']
  }
)

const emit = defineEmits<{
  /**
   * Событие происходит при изменениях в наборе токенов
   */
  'update:model': [model: string[]]
  /**
   * Событие происходит при добавлении токена
   */
  add: [value: string]
  /**
   * Событие происходит при удалении токена
   */
  remove: [value: string]
  /**
   * Событие происходит при фокусе на input
   */
  focus: [e: FocusEvent]
  /**
   * Событие происходит при потере фокуса с input
   */
  blur: [e: FocusEvent]
}>()

const chips = ref([...props.model])
const inputValue = ref('')

const isAllChipsValid = computed(() => {
  return chips.value.every(isValidChip)
})

const rootClassNames = computed(() => ({
  _error: !isAllChipsValid.value,
  _disabled: props.disabled,
  _active: props.model.length || inputValue.value
}))

const chipClassNames = computed(() => ({
  _error: !isAllChipsValid.value,
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

function handlePaste(event: ClipboardEvent): void {
  if (props.disabled) return

  const pasteData = event.clipboardData?.getData('text')

  if (pasteData) {
    const pastedChips = pasteData
      .split(new RegExp(`[${props.separators.join('')}]`))
      .map((chip) => chip.trim())
      .filter((chip) => chip.length)

    pastedChips.forEach((chip) => addChip(chip))
    clearInputValue()
    event.preventDefault()
  }
}

function handleKeyDown(e: KeyboardEvent): void {
  if ((isKeySeparator(e.key) || e.key === 'Enter') && inputValue.value.trim().length) {
    e.preventDefault()

    if (isInputCaretOnEnd()) {
      addChip(inputValue.value)
      clearInputValue()
    }
  }

  if (
    isInputCaretOnStart() &&
    (e.key === 'ArrowLeft' || e.key === 'Backspace') &&
    chips.value.length
  ) {
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

function handleFocus(e: FocusEvent): void {
  emit('focus', e)
}

function handleBlur(e: FocusEvent): void {
  if (props.addOnBlur && inputValue.value) {
    addChip(inputValue.value)
    clearInputValue()
  }

  emit('blur', e)
}

function addChip(chipLabel: string): void {
  if (!props.allowDuplicate && chips.value.includes(chipLabel)) return
  if (chips.value.length === props.max) return

  chips.value.push(chipLabel)
  emit('add', chipLabel)
  emit('update:model', chips.value)
}

function removeChip(index: number, chipLabel: string): void {
  // Реализовано через slice и в emit('remove') передается объект, так как возможны одноименные чипсы
  chips.value = [...chips.value.slice(0, index), ...chips.value.slice(index + 1)]

  emit('remove', chipLabel)
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

function isValidChip(chipValue: string) {
  return props.validator(chipValue)
}

function resizeInput(): void {
  if (inputField.value) {
    inputField.value.style.width = inputValue.value.length + 'ch'
  }
}
</script>
