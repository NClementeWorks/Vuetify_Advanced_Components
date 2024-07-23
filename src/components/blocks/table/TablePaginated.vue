<!-- TablePaginated -->

<script setup>
  import DialogBasic from '@/components/blocks/dialog/DialogBasic.vue'
  import { capitalize } from '@/composables/utils.composable'
  import { computed, ref, toRefs, watch } from 'vue'

  defineOptions ({
    inheritAttrs: false,
  })

  const props = defineProps ({
    columns: {
      type: Object,
      default: null,
    },
    // data: {
    //   type: Array,
    //   default: null,
    // },
    data_id: {
      type: String,
      default: 'id',
    },
    // page: {
    //   type: Number,
    //   default: 1,
    // },
    // loading: {
    //   type: Boolean,
    //   default: false,
    // },
    data_callback: {
      type: Function,
      default: null,
    },
    // search_action: {
    //   type: Function,
    //   default: null,
    // },
    row_actions: {
      type: Object,
      default: null,
    },
    create_new_callback: {
      type: Function,
      default: null,
    },
    delete_dialog_title: {
      type: Function,
      default: () => 'Moving item to trash',
    }
  })

  const {
    columns,
    // data,
    data_id,
    // page,
    // loading,
    data_callback,
    create_new_callback,
    row_actions,
    delete_dialog_title,
  } = toRefs ( props )

  const emit = defineEmits ([
    'load:data',
    'add:new',
  ])

  /**
   * Table Columns
   */
  const columns_array = computed (() => {
    return Object.entries ( columns.value )
      .map( ( [ k, v ] ) => ({ _name: k, ...v }) )
  })

  function get_data_property ( item, col ) {
    return item [ col._name ] || item [ col.field_name ]
  }

  /**
   * Pagination
   */
  const total_pages = ref ( 0 )
  const per_page = ref ( 10 )
  const current_page = ref ( 1 )

  function change_page () {
    load_items ( data_callback.value )
  }
  
  /**
   * Search
   */
  const search_string = ref ( '' )
  function do_search () {
    load_items ( data_callback.value )
  }
  
  /**
   * Load Data
   */
  const data = ref ( null )
  const loading = ref ( false )

  watch ( data_callback, ( new_callback ) => {
    load_items ( new_callback )
  })

  function load_items ( callback ) {
    if ( callback ) {
      loading.value = true
      callback ({
        per_page: per_page.value,
        page: current_page.value,
        search: search_string.value.trim (),
      })
      .then ( res => {
        data.value = res.data
        total_pages.value = res.headers ? res.headers [ 'x-wp-totalpages' ] : 1
        set_is_row_action_loading ()
        emit ( 'load:data', data.value )
      })
      .catch ( err => console.error ( err ) )
      .finally ( () => {
        loading.value = false
      })
    }
  }

  load_items ( data_callback.value )

  /**
   * Create New Item
   */
  const creating_new_item = ref ( false )
  function create_new_item () {
    emit ( 'add:new' )
    if ( create_new_callback.value ) {
      creating_new_item.value = true
      create_new_callback.value (
        created_new_done_callback
      )
    }
  }
  
  function created_new_done_callback ( success, reload ) {
    creating_new_item.value = false
    if ( reload )
      load_items ( data_callback.value )
  }


  /**
   * Row Actions
   */
  const has_row_actions = computed ( () => row_actions.value && Object.keys ( row_actions )?.length )
  function do_row_action ( row_action, item, key ) {

    if ( row_action.click ) {

      if ( key === 'delete' ) {
        dialog.value = delete_dialog_basis
        dialog.value.title = delete_dialog_title ( item )
        dialog.value.actions.ok.click = () => 
          do_row_action_with_loaders ( row_action, item, key )
        dialog.value.show = true
      }

      else {
        do_row_action_with_loaders ( row_action, item, key )
      }
    }
  }

  function do_row_action_with_loaders ( row_action, item, key ) {
    row_action.click ( item, row_action_done_callback )
    is_row_action_loading.value [ item.id ] [ key ] = true
    is_row_action_loading.value [ item.id ].is_loading = true
  }
  
  function row_action_done_callback ( reload ) {
    dialog.value.show = false

    if ( reload )
      load_items ( data_callback.value )
  }

  const is_row_action_loading = ref ( {} )
  function set_is_row_action_loading () {
    is_row_action_loading.value = data.value.reduce ( ( obj, item ) => ({
      ...obj,
      [ item.id ]: Object.keys ( row_actions.value ).reduce ( ( actions_obj, action_key ) => ({
        ...actions_obj,
        [ action_key ]: false,
        is_loading: false,
      }), {})
    }), {})
  }

  /**
   * Dialog
   */
  const dialog = ref ({
    show: false
  })
  const delete_dialog_basis = {
    show: false,
    actions: {
      ok: {
        label: 'Move to Trash',
        icon: 'check',
        color: 'error',
        use_loader: true,
      },
      cancel: {
        click: () => dialog.value.show = false,
        icon: 'xmark',
        color: 'gray-darken-2',
      }
    }
  }

</script>

<template>
  
  <VTable
    class="table_paginated bg-transparent"
    v-bind="$attrs"
    density="compact"
    fixed-header
    hover
    >

    <template #top>
      
      <div class="d-flex align-center">
        <SecondaryBtn
          v-if="create_new_callback"
          :loading="creating_new_item"
          @click.prevent="create_new_item"
          >
          Add New
        </SecondaryBtn>

        <VSpacer></VSpacer>

        <VTextField
          placeholder="Search..."
          v-model="search_string"
          @keypress.enter="do_search"
          >
          <template #append-inner>
            <VTooltip
              activator="parent"
              text="Search"
              location="top"
              >
              <template #activator="{ props }">
                <IconBtn
                  v-bind="props"
                  icon="fas fa-search"
                  @click="do_search"
                  />
              </template>
            </VTooltip>
          </template>

        </VTextField>
      </div>
    </template>

    <thead>
      <tr>
        <th v-for="col in columns_array" :key="col._name">
          <slot :name="`th_${ col._name }`">
            {{ col.label || capitalize ( col._name?.replace( '_', ' ' ) ) }}
          </slot>
        </th>

        <th v-if="has_row_actions"></th>
      </tr>
    </thead>
    <tbody>

      <TransitionGroup name="table_paginated_rows">
        <tr
          v-if="loading"
          key="table_paginated_loading"
          class="w-100 overflow-hidden"
          >
          <td
            :colspan="Object.entries ( columns )?.length"
            >
            <div class="w-100 d-flex align-center justify-center overflow-hidden pa-4">
              <VProgressCircular />
            </div>

          </td>
        </tr>

        <tr
          v-for="item in data"
          :key="item [ data_id ]"
          :class="{
            'text-disabled': is_row_action_loading [ item.id ]?.is_loading,
          }"
          >
          <td v-for="col in columns_array" :key="col._name">

            <slot :name="col._name" :item="item">
              {{ get_data_property ( item, col ) }}
            </slot>

          </td>
          <td v-if="has_row_actions" class="d-flex flex-nowrap align-center jusifty-right">
            <IconBtn
              v-for="[ key, action ] in Object.entries ( row_actions )" :key="key"
              :icon="`fas fa-${ action.icon }`"
              size="x-small"
              class="row_action"
              :class="{
                loading: is_row_action_loading [ item.id ] [ key ], 
              }"
              :loading="is_row_action_loading [ item.id ] [ key ]"
              :data-key="key"
              :data-item_id="item.id"
              :data-laoding="is_row_action_loading [ item.id ] [ key ]"
              @click="do_row_action ( action, item, key )"
              />
          </td>
        </tr>
      </TransitionGroup>
    </tbody>
  </VTable>

  <VPagination
    v-model="current_page"
    :length="total_pages"
    :total-visible="4"
    rounded="circle"
    @update:modelValue="change_page"
    />

  <DialogBasic
    :dialog="dialog"
    />
</template>