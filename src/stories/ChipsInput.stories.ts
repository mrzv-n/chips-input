import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import { fn } from '@storybook/test'

import ChipsInput from '@/components/UI/ChipsInput/ChipsInput.vue'

const meta: Meta<typeof ChipsInput> = {
  title: 'Components/ChipsInput',
  component: ChipsInput,
  tags: ['autodocs'],
  argTypes: {
    model: { control: 'array' },
    label: { control: 'text' },
    max: { control: 'number' },
    addOnBlur: { control: 'boolean' },
    allowDuplicate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    hint: { control: 'text' },
    separators: { control: 'array' },
    validator: { control: 'function' }
  }
}

export default meta

type Story = StoryObj<typeof ChipsInput>

export const Default: Story = {
  args: {
    model: ['fff'],
    label: 'Заголовок поля',
    max: 10,
    separators: [',', ' ', '\n'],
    addOnBlur: true,
    allowDuplicate: false,
    disabled: false,
    hint: 'Нажмите Enter для добавления тега',
    'onUpdate:model': fn(),
    onAdd: fn(),
    onRemove: fn(),
    onFocus: fn(),
    onBlur: fn()
  },
  render: (args) => ({
    components: { ChipsInput },
    setup() {
      const model = ref(args.model)

      watch(
        () => args.model,
        (val) => {
          model.value = val
        }
      )

      function onUpdate(newMails: string[]) {
        model.value = newMails
      }
      return { args, model, onUpdate }
    },
    template: `
      <ChipsInput 
        v-bind="args" 
        :model="model" 
        @update:model="onUpdate"/>
    `
  })
}

export const WithInitialChips: Story = {
  args: {
    model: ['Первый', 'Второй', 'Третий'],
    label: 'Заголовок поля',
    max: 10,
    separators: [',', ' ', '\n'],
    addOnBlur: true,
    allowDuplicate: false,
    disabled: false,
    validator: (chip: string) => chip.length > 0,
    hint: 'Нажмите Enter для добавления тега'
  },
  render: (args) => ({
    components: { ChipsInput },
    setup() {
      const model = ref(args.model)

      watch(
        () => args.model,
        (val) => {
          model.value = val
        }
      )

      function onUpdate(newMails: string[]) {
        model.value = newMails
      }
      return { args, model, onUpdate }
    },
    template: `
      <ChipsInput 
        v-bind="args" 
        :model="model" 
        @update:model="onUpdate"/>
    `
  })
}

export const Disabled: Story = {
  args: {
    model: ['Первый', 'Второй', 'Третий'],
    label: 'Заголовок поля',
    max: 10,
    separators: [',', ' ', '\n'],
    addOnBlur: true,
    allowDuplicate: false,
    disabled: true,
    validator: (chip: string) => chip.length > 0,
    hint: 'Нажмите Enter для добавления тега'
  },
  render: (args) => ({
    components: { ChipsInput },
    setup() {
      const model = ref(args.model)

      watch(
        () => args.model,
        (val) => {
          model.value = val
        }
      )

      function updateModel(newMails: string[]) {
        model.value = newMails
      }
      return { args, model, updateModel }
    },
    template: `
      <ChipsInput 
        v-bind="args" 
        :model="model" 
        @update:model="onUpdate"/>
    `
  })
}

export const Error: Story = {
  args: {
    model: ['Первый', 'Второй', 'Третий'],
    label: 'Заголовок поля',
    max: 10,
    separators: [',', ' ', '\n'],
    addOnBlur: true,
    allowDuplicate: false,
    disabled: false,
    validator: (chip: string) => chip.length < 2,
    hint: 'Нажмите Enter для добавления тега'
  },
  render: (args) => ({
    components: { ChipsInput },
    setup() {
      const model = ref(args.model)

      watch(
        () => args.model,
        (val) => {
          model.value = val
        }
      )

      function onUpdate(newMails: string[]) {
        model.value = newMails
      }
      return { args, model, onUpdate }
    },
    template: `
      <ChipsInput 
        v-bind="args" 
        :model="model" 
        @update:model="onUpdate"/>
    `
  })
}
