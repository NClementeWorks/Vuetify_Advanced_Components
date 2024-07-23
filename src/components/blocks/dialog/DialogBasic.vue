<!-- DialogBasic -->

<script setup>
  import { capitalize } from '@/composables/utils.composable'
  import { computed, toRefs } from "vue"

  const props = defineProps ({
    dialog: {
      type: Object,
      default: null,
    }
  })

  const { dialog } = toRefs ( props )

  function do_action_click ( action ) {
    if ( action.use_loader ) {
      action.loading = true
      const done_callback = () => { action.loading = false }
      action.click ( done_callback )
    }
    action.click ()
  }

  const show_dialog = computed ( () => !!dialog.value?.show )
</script>

<template>
  
  <VDialog
    v-model="show_dialog"
    class="w-50"
    >
    <VCard>
      <VCardTitle
        class="bg-secondary">
        <span v-html="dialog.title"></span>
      </VCardTitle>
      <VCardText
        v-if="dialog.message"
        >
        {{ dialog.message }}
      </VCardText>
      <VCardActions
        class="d-flex justify-end pa-4">
        <VBtn
          v-for="([ key, action ]) in Object.entries ( dialog.actions )" :key="key"
          class="px-4"
          :prepend-icon="action.icon ? `fas fa-${ action.icon }` : null"
          :color="action.color"
          :loading="action.loading"
          @click="do_action_click ( action )"
          >
          {{ action.label || capitalize ( key ) }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

</template>