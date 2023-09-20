<!-- MenuBasic -->

<script setup>
  import { capitalize } from '@/composables/utils.composable'
  import { toRefs } from 'vue'

  const props = defineProps ({
    label: {
      type: String,
      default: null,
    },
    options: {
      type: Object,
      default: null,
    },
    loading: {
      type: [ Boolean, String ],
      default: false,
    }
  })

  const {
    label,
    options,
    loading,
  } = toRefs ( props )
</script>

<template>
  <VMenu>
    <template #activator="{ props }">
      <SecondaryBtn
        v-bind="props"
        append-icon="fas fa-caret-down"
        :loading="loading"
        >
        {{ label }}
      </SecondaryBtn>
    </template>
    <VList>
      <VListItem
        v-for="([ key, option ]) in Object.entries ( options )" :key="key"
        class="pa-0"
        >
        <VBtn
          variant="plain"
          rounded="0"
          class="w-100"
          :prepend-icon="option.icon ? `fas fa-${ option.icon }` : null"
          :color="option.color"
          @click="option.click"
          >
          {{ option.label || capitalize ( key ) }}
        </VBtn>
      </VListItem>
    </VList>
  </VMenu>
</template>