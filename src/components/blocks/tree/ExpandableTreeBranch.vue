<!-- ExpandableTreeBranch -->

<script setup>
  import { toRefs } from "vue"

  const props = defineProps({
    content: {
      type: Object,
      default: null,
    },
    // items: {
    //   type: Array,
    //   default: null,
    // },
  })

  // const _items = reactive ( props.items )

  const {
    content,
  } = toRefs( props )

  const emit = defineEmits([
    'clicked:option',
  ])
</script>

<template>
  <VExpansionPanel>
    <VExpansionPanelTitle
      v-slot="{ expanded }"
      :collapse-icon="null"
      :expand-icon="null"
      class="px-0 py-1"
      >
      <VIcon
        :icon="`fa-regular fa-${
          content.children?.length
            ? expanded
              ? 'square-minus'
              : 'square-plus'
            : 'square'
        }`"
        color="gray-darken-3"
        class="branch_icon"
        ></VIcon>

        <div class="d-flex justify-center">

        <VCheckbox
          v-if="content.selected !== undefined"
          :value="content.selected"
          hide-details
          @click.stop="emit ( 'clicked:option', content )"
          ></VCheckbox>
          
        <VLabel>
          {{ content.name }}
        </VLabel>
      </div>
    </VExpansionPanelTitle>

    <VExpansionPanelText
      v-if="content.children"
      >
      <VExpansionPanels>
            
        <ExpandableTreeBranch
          v-for="branch in content.children" :key="branch.name"
          :content="branch"
          @clicked:option="emit ( 'clicked:option', $event )"
          ></ExpandableTreeBranch>
          
      </VExpansionPanels>
    </VExpansionPanelText>
  </VExpansionPanel>
</template>

<style lang="sass">
.branch_icon
  font-size: .8rem
  margin-right: .5rem

.v-expansion-panel-title
  min-height: unset

  .v-expansion-panel--active > &
    min-height: unset

  .v-expansion-panel-title__overlay
    background: transparent

.v-expansion-panel-text__wrapper
  // remove padding
  padding: 0
  padding-left: 1rem
  // add tree downward lines
  margin-left: .35rem
  border-left: 1px dashed rgb( var( --v-theme-gray-lighten-1 ) )

.v-expansion-panel:not(:first-child)::after
  // remove top divider line between panels
  content: unset
</style>