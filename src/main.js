import './assets/main.sass'
import '@fortawesome/fontawesome-free/css/all.css'

import InnerCard from './components/blocks/card/InnerCard.vue'
import DialogBasic from './components/blocks/dialog/DialogBasic.vue'
import InputItem from './components/blocks/input/InputItem.vue'
import InputOption from './components/blocks/input/InputOption.vue'
import MenuBasic from './components/blocks/menu/MenuBasic.vue'
import SelectChip from './components/blocks/select/SelectChip.vue'
import SelectItemNested from './components/blocks/select/SelectItemNested.vue'
import SelectNested from './components/blocks/select/SelectNested.vue'
import TablePaginated from './components/blocks/table/TablePaginated.vue'
import ExpandableTree from './components/blocks/tree/ExpandableTree.vue'
import ExpandableTreeBranch from './components/blocks/tree/ExpandableTreeBranch.vue'
import LoaderBlanket from './components/blocks/loader/LoaderBlanket.vue'

import vuetify_default_theme from './assets/js/vuetify_theme'

import useUtils from './composables/utils.composable'

export {
  InnerCard,
  DialogBasic,
  InputItem,
  InputOption,
  MenuBasic,
  SelectChip,
  SelectItemNested,
  SelectNested,
  TablePaginated,
  ExpandableTree,
  ExpandableTreeBranch,
  LoaderBlanket,

  vuetify_default_theme,
  
  useUtils,
}