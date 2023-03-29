import Vue from 'vue'

const components = [
    'Picture',
    'VText',
    'VButton',
    'Group',
    'RectShape',
    'VBarcode',
    'VQrcode',
    'VLine',
    'v-table'
]

components.forEach(key => {
    Vue.component(key, () => import(`@/components/DataVisualEditor/custom-component/${key}`))
})
