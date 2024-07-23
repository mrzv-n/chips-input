<template>
  <div class="chips-input _readonly">
    <div class="chips-input__container">
      <div class="chips-input__body">
        <div class="chips-input__chips">
          <div class="chip _readonly">
            <div class="chip__label">first</div>
            <button class="chip__remove-btn" style="display: none">
              <svg
                class="chip__remove-icon"
                width="12"
                height="12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m6.795 6.007 3.346-3.345a.567.567 0 1 0-.803-.803L5.993 5.205 2.647 1.859a.568.568 0 0 0-.802.803L5.19 6.007 1.845 9.353a.568.568 0 0 0 .802.802L5.993 6.81l3.345 3.345a.568.568 0 0 0 .803-.802L6.795 6.007Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          <div class="chip _error">
            <div class="chip__label">second</div>
            <button class="chip__remove-btn">
              <svg
                class="chip__remove-icon"
                width="12"
                height="12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m6.795 6.007 3.346-3.345a.567.567 0 1 0-.803-.803L5.993 5.205 2.647 1.859a.568.568 0 0 0-.802.803L5.19 6.007 1.845 9.353a.568.568 0 0 0 .802.802L5.993 6.81l3.345 3.345a.568.568 0 0 0 .803-.802L6.795 6.007Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          <div class="chip">
            <div class="chip__label">third</div>
            <button class="chip__remove-btn">
              <svg
                class="chip__remove-icon"
                width="12"
                height="12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m6.795 6.007 3.346-3.345a.567.567 0 1 0-.803-.803L5.993 5.205 2.647 1.859a.568.568 0 0 0-.802.803L5.19 6.007 1.845 9.353a.568.568 0 0 0 .802.802L5.993 6.81l3.345 3.345a.568.568 0 0 0 .803-.802L6.795 6.007Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          <div class="chip">
            <div class="chip__label">
              longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong
            </div>
            <button class="chip__remove-btn">
              <svg
                class="chip__remove-icon"
                width="12"
                height="12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m6.795 6.007 3.346-3.345a.567.567 0 1 0-.803-.803L5.993 5.205 2.647 1.859a.568.568 0 0 0-.802.803L5.19 6.007 1.845 9.353a.568.568 0 0 0 .802.802L5.993 6.81l3.345 3.345a.568.568 0 0 0 .803-.802L6.795 6.007Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          <input class="chips-input__input" type="text" />
        </div>
      </div>
      <label class="chips-input__label">Label</label>
    </div>
    <div class="chips-input__info">Info Message</div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss"></style>
