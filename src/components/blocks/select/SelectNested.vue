<!-- SelectNested -->

<script setup>
  import SelectChip from '@/components/blocks/select/SelectChip.vue'
  import SelectItemNested from '@/components/blocks/select/SelectItemNested.vue';
  import { computed, ref, toRefs, watch } from "vue"

  const props = defineProps({
    modelValue: {
      type: Array,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    items: {
      type: Array,
      default: new Array (),
    },
    loading: {
      type: [ Boolean, String ],
      default: false,
    },
  })

  const {
    modelValue,
    label,
    items,
    loading,
  } = toRefs ( props )

  const value =  ref ( modelValue.value || [] )
  watch ( modelValue, new_value => {
    console.log('watch modelValue :: new_value', new_value)
    value.value = new_value
  })

  const emit = defineEmits([
    'update:modelValue',
    'create:new',
  ])

  const input_field = ref ( null )

  const items_array = computed ( () => {
    items.value.forEach ( item => item.parent = items.value.find ( parent_item => parent_item.id === item.parent_id ) )
    items.value.forEach ( item => item.children = items.value.filter ( child_item => child_item.parent_id === item.id ) )
    items.value.forEach ( item => item.depth = get_branch_depth ( item ) )
    items.value.forEach ( item => item.all_ancestors = get_all_ancestors ( item ).map ( parent => parent.id ) )

    const items_tree = items.value.filter ( item => item.parent_id === 0 )

    return tree_to_array ( items_tree )
  })

  const items_map = computed ( () => {
    return items_array.value
      .reduce ( ( obj, item ) => ({
        ...obj,
        [ item.id ]: item,
      }), {})
  })

  function tree_to_array ( tree ) {
    const tree_array = tree.reduce ( ( arr, branch ) => {
      if ( branch.children?.length )
        return [
          ...arr,
          branch,
          ...tree_to_array ( branch.children ),
        ]
      else
        return [
          ...arr,
          branch,
        ]
    }, [])

    return tree_array
  }

  function get_branch_depth ( branch, depth = 0 ) {
    return branch.parent
      ? get_branch_depth ( branch.parent, depth + 1 )
      : depth
  }

  function get_all_ancestors ( item ) {
    return item.parent
      ? [ item.parent, ...get_all_ancestors ( item.parent ) ]
      : []
  }

  const all_values_leaves = computed ( () => {
    const all_ancestors = [... new Set ( value.value?.flatMap ( value_id => items_map.value [ value_id ]?.all_ancestors ) ) ]
    const _all_values_leaves = value.value?.filter ( id => !all_ancestors.includes ( id ) )
    return _all_values_leaves
  })

  const all_values_ancestors = computed ( () => {
    const _all_values_ancestors = [... new Set ( all_values_leaves.value?.flatMap ( value_id => items_map.value [ value_id ]?.all_ancestors ) ) ]
    return _all_values_ancestors
  })

  function validate_selection_tree ( item ) {
    // verify if item in current value ancestors
    if ( all_values_ancestors.value.includes( item.id ) ) {
      // remove any values down the hierarchy of item
      value.value = value.value.filter( id => !items_map.value [ id ].all_ancestors.includes ( item.id ) )
    }
    // verify if item ancestors in current value
    else if ( item.all_ancestors.some ( id => value.value.includes ( id ) ) ) {
      // remove any values up the hierarcy of item
      value.value = value.value.filter( id => !item.all_ancestors.includes ( id ) )
    }
  }

  function update_model ( item ) {
    if ( !item ) return

    // if item is already a leave value - remove it
    const is_item_added = all_values_leaves.value.includes ( item.id )
    if ( is_item_added )
      value.value = value.value.filter ( id => id !== item.id )
    // if value is not a leave value - add it
    else
      value.value = [ ...new Set ( [ item.id, ...value.value ] ) ]

    validate_selection_tree ( item )

    const new_model_value = [ ...all_values_leaves.value, ...all_values_ancestors.value ]
    value.value = new_model_value
    emit ( 'update:modelValue', new_model_value )
  }

  // function remove_item ( item ) {
  //   value.value = value.value.filter ( item_id => item_id != item.id )
  // }
  
  const saving_new_item = ref ( false )
  function create_new_item ( item ) {
    saving_new_item.value = true
    emit ( 'create:new' , item, create_new_item_callback )
  }

  function create_new_item_callback ( result_item ) {
    update_model ( result_item )
    saving_new_item.value = false
  }

  function get_selected_item_display_text ( item ) {
    const ancestors = item.raw.all_ancestors
      ?.sort ( ( id_1, id_2 ) => items_map.value [ id_1 ].depth - items_map.value [ id_2 ].depth )
      ?.map ( id => items_map.value [ id ].name ).join ( ' > ' )

    const split = item.raw.all_ancestors?.length ? '>' : ''

    return `${ ancestors } ${ split } ${ item.title }`
  }
</script>

<template>
  <VAutocomplete
    ref="input_field"
    v-model="all_values_leaves"
    :label="label"
    :items="items_array"
    :multiple="true"
    auto-select-first
    item-title="name"
    item-value="id"
    :loading="loading"
    >

    <template #selection="{ item }">
      <SelectChip
        class="mr-4"
        :text="get_selected_item_display_text ( item )"
        @click:remove="update_model ( item.raw )"
        />
    </template>

    <template #no-data>
      <div class="d-flex align-center flex-column">
        <VLabel
          class="ma-2 w-100 d-flex justify-center"
          >
          "{{ input_field?.value }}" was not found
        </VLabel>

        <SecondaryBtn
          prepend-icon="fas fa-plus"
          variant="text"
          class="w-100"
          :loading="saving_new_item"
          @click="create_new_item ( { name: input_field.value, parent: null } )"
          >
          
          Create New

          <VTooltip>
            This will create a <b>first-level</b> item.
            <br />To make a <b>nested</b> item
            <br />click on the plus <b>(+)</b> icon
            <br />of any existing item.
          
            <template #activator="{ props }">
              <VIcon
                v-bind="props"
                icon="fas fa-circle-question"
                size="x-small"
                class="ml-2"
                />
            </template>
          </VTooltip>
        </SecondaryBtn>
        
      </div>
    </template>

    <template #item="{ item, props }">
      <SelectItemNested
        :item="item"
        :props="props"
        :value="value"
        :all_values_leaves="all_values_leaves"
        :all_values_ancestors="all_values_ancestors"
        :loading="saving_new_item"
        @create:new="create_new_item"
        @selected:item="update_model"
        />
    </template>

  </VAutocomplete>
</template>

<style lang="sass">
.v-autocomplete .v-input__control .v-field .v-field__input > input
  align-self: center
  border: none
</style>