<!-- InnerCard -->

<script setup>
import { toRefs } from "vue"

  const props = defineProps({
    title: {
      type: String,
      default: null,
    },
  })

  const {
    title,
  } = toRefs( props )
</script>

<template>
  <VCard>

    <VCardTitle
      v-if="title?.length"
      class="px-0"
      >
      <h2>{{ title }}</h2>
    </VCardTitle>

    <VCardText class="px-0">
      <slot></slot>
    </VCardText>

  </VCard>
</template>