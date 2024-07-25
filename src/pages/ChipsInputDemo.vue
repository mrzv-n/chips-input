<template>
  <div class="page">
    <div class="page__form">
      <ChipsInput
        class="page__form-field"
        :model="mails"
        label="Label"
        hint="Small hint"
        test="test"
        @update:model="updateMails"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChipsInput from '@/components/UI/ChipsInput/ChipsInput.vue'

const mails = ref(['aaaa', 'bbb', 'ccc'])

function updateMails(newMails: string[]) {
  mails.value = newMails
}
</script>
