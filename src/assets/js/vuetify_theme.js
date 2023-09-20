import { aliases, fa } from 'vuetify/iconsets/fa'
import { VListItem, VBtn } from 'vuetify/lib/components/index.mjs'

const custom_colors = {
  blue: '#3BA5D9',
  'blue-darken-1': '#10709E',
  red: '#9E1029', //'#EB3F00',
  orange: '#EB8D0C',
  green: '#44EB6E',
  'green-darken-1': '#109E2B',
  'gray-lighten-2': '#F0F0F1',
  'gray-lighten-1': '#C5D9E6',
  gray: '#636D73',
  'gray-darken-3': '#818E96',
}

const default_button_style = {
  'text-transform': 'none',
  height: '44px'
  // ; width: 44px
}

const custom_theme = {
  dark: false,
  colors: {
    background: '#fff',
    surface: custom_colors [ 'gray-lighten-2' ],
    primary: custom_colors.blue,
    secondary: custom_colors.gray,
    error: custom_colors.red,
    info: custom_colors [ 'blue-darken-1' ],
    success: custom_colors [ 'green-darken-1' ],
    warning: custom_colors.orange,
    ...custom_colors,
  },
}

export default {
  
  theme: {
    defaultTheme: 'custom_theme',
    themes: { custom_theme },
    variations: {
      colors: [
        'primary', 'secondary',
        ...Object.keys( custom_colors ),
      ],
      lighten: 1,
      darken: 1,
    },
  },

  aliases: {
    AppNavLink: VListItem,
    PrimaryBtn: VBtn,
    SecondaryBtn: VBtn,
    IconBtn: VBtn,
  },

  icons: {
    defaultSet: 'fa',
    aliases,
    sets: { fa },
  },

  defaults: {

    VCard: {
      elevation: 0,
      color: 'white',
      rounded: true,
    },

    VBtn: {
      rounded: true,
      variant: 'tonal',
      style: default_button_style,
    },

    PrimaryBtn: {
      variant: 'flat',
      rounded: true,
      color: 'primary',
      style: default_button_style,
    },

    SecondaryBtn: {
      variant: 'outlined',
      rounded: true,
      color: 'primary',
      style: default_button_style,
    },

    IconBtn: {
      variant: 'text',
      color: 'gray-darken-3',
      style: {
        ...default_button_style,
        width: '44px',
        fontSize: '.65rem'
      },
    },

    VTextField: {
      variant: 'outlined',
      density: 'compact',
    },

    VTextarea: {
      variant: 'outlined',
      density: 'compact',
    },

    VAutocomplete: {
      variant: 'outlined',
      density: 'compact',
      'auto-select-first': true,
    },

    VExpansionPanels: {
      multiple: true,
      variant: 'accordion',
    },

    VExpansionPanel: {
      elevation: 0,
      bgColor: 'white',
    },

    VProgressCircular: {
      indeterminate: true,
      color: 'primary',
      width: 2,
    },

  },

}