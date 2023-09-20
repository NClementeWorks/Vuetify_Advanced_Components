<!-- SelectChip -->

<script setup>
import { toRefs } from "vue"

  const props = defineProps({
    text: {
      type: String,
      default: null,
    },
  })

  const {
    text
  } = toRefs ( props )

  const emit = defineEmits([
    'click:remove',
  ])
</script>

<template>
  <VLabel class="text-wrap">
    <span class="py-4">
      {{ text }}
    
      <VTooltip
        text="Remove Scripture"
        location="right"
        >
        <template #activator="{ props }">
          <VIcon
            v-bind="props"
            icon="fas fa-circle-xmark"
            class="ml-2"
            size="small"
            color="gray-darken-3"
            @click="emit ( 'click:remove', text )"
            ></VIcon>
        </template>
      </VTooltip>
    </span>
  </VLabel>
</template>