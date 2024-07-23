<!-- InputOption -->

<script setup>
  import { ref, toRefs } from "vue"

  const props = defineProps({
    modelValue: {
      type: String,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    tooltip: {
      type: String,
      default: null,
    }
  })

  const value =  ref ( props.modelValue || [] )

  const {
    loading,
  } = toRefs ( props )

  const emit = defineEmits([
    'update:modelValue',
    'click:add',
    'click:cancel',
  ])
</script>

<template>
  <VAutocomplete
    v-model="value"
    label="Name..."
    clearable
    v-bind="$attrs"
    @update:modelValue="emit ( 'update:modelValue', value )"
    >    
    <template #append>

      <VTooltip
        :text="tooltip"
        location="top"
        >
        <template #activator="{ props }">
          <IconBtn
            v-bind="props"
            class="ml-2"
            color="blue"
            icon="fas fa-plus"
            :loading="loading && 'primary'"
            @click="emit ( 'click:add', value )"
            ></IconBtn>
        </template>
      </VTooltip>
      
      <VTooltip
        text="Cancel"
        location="top"
        >
        <template #activator="{ props }">
          <IconBtn
            v-bind="props"
            class="ml-2"
            icon="fas fa-xmark"
            @click="emit ( 'click:cancel' )"
            ></IconBtn>
        </template>
      </VTooltip>
      
    </template>
  </VAutocomplete>
</template>