<!-- ExpandableTree -->

<script setup>
  import ExpandableTreeBranch from '@/components/blocks/tree/ExpandableTreeBranch.vue';
  import { toRefs } from 'vue';

  const props = defineProps({
    items: {
      type: Array,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  })

  const {
    items,
    loading,
  } = toRefs ( props )

  const emit = defineEmits([
    'clicked:option',
  ])

</script>

<template>
  <VProgressCircular
    v-if="loading"
    class="image_progress"
    />
  <VExpansionPanels
    v-else
    >
    <ExpandableTreeBranch
      v-for="branch in items" :key="branch.name"
      :content="branch"
      @clicked:option="emit ( 'clicked:option', $event )"
      ></ExpandableTreeBranch>
  </VExpansionPanels>
</template>