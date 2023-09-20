<!-- SelectItemNested -->

<script setup>
import InputItem from '@/components/blocks/input/InputItem.vue'
import { ref, toRefs, watch } from "vue"

  const _props = defineProps({
    item: {
      type: Object,
      default: null,
    },
    props: {
      type: Object,
      default: null,
    },
    value: {
      type: Array,
      default: null,
    },
    all_values_leaves: {
      type: Array,
      default: null,
    },
    all_values_ancestors: {
      type: Array,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  })

  const {
    item,
    props,
    value,
    all_values_ancestors,
    loading,
  } = toRefs ( _props )

  const hover = ref ( false )
  const show_create_subtopic = ref ( false )
  const new_child_item = ref ({
    name: '',
    parent: item.value.value,
  })

  const emit = defineEmits([
    'selected:item',
    'create:new',
  ])

  watch ( loading, new_value => {
    if ( !new_value )
      show_create_subtopic.value = new_value
  })

</script>

<template>
  <VListItem
    class="autoselect_item pl-4"
    @click="() => { props.onClick ( item ); emit ( 'selected:item', item.raw ) }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    >

    <template #prepend>
      <VIcon
        :icon="`fas fa-${ value?.includes ( item.value ) ? 'check' : 'minus' }`"
        class="mr-2"
        :style="{
          marginLeft: `${ item.raw.depth * 2 }rem`
        }"
        :color="all_values_leaves.includes ( item.value )
          ? 'success'
          : all_values_ancestors.includes ( item.value )
            ? 'gray-darken-3'
            : 'surface'"
        />
    </template>

    <VLabel
      class="flex-fill"
      >
      {{ item.title }}
    </VLabel>
    
    <template #append>
      <VTooltip
        :text="show_create_subtopic ? 'Cancel' : `Add Sub-Topic`"
        location="top"
        >
        <template #activator="{ props }">
          <VIcon
            v-bind="props"
            :icon="`fas fa-circle-${ show_create_subtopic ? 'minus' : 'plus' }`"
            class="pl-2"
            size="x-small"
            :color="show_create_subtopic ? 'gray-darken-3' : 'primary'"
            :style="{
              opacity: hover ? 1 : 0,
            }"
            @click.stop="show_create_subtopic = !show_create_subtopic"
            />
        </template>
      </VTooltip>
    </template>
    
  </VListItem>

  <VCard v-if="show_create_subtopic">
    <VCardText>
      <div>
        Create new item under "{{ item.title }}"
      </div>

      <InputItem
        v-model="new_child_item.name"
        :loading="loading"
        @click:add="emit ( 'create:new', new_child_item )"
        @click:cancel="show_create_subtopic = false"
        />

    </VCardText>
  </VCard>

</template>