<!-- LoaderBlanket -->

<script setup>
  const props = defineProps({
    status: {
      type: Number,
      default: 0,
      required: false,
    },
    message: {
      type: String,
      default: '',
      required: false,
    },
  })
</script>

<template>
  
  <div
    v-if="status > 0"
    class="loader_blanket"
    >
    <VProgressCircular
      :size="50"
      />
    <span class="text-center font-weight-bold mt-4"
      v-html="message"
      ></span>
  </div>

</template>
