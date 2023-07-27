import Vue from 'vue'

const components = [
    'VPicture',
    'VText',
    'v-button',
    'v-input',
    'v-select',
    'v-date-picker',
    'Group',
    'VRectShape',
    'VBarcode',
    'VQrcode',
    'VLine',
    'v-table',
    'v-iframe',
    'v-video',
    'vc-chart',
    'vc-bar-MultipleYAxes',
]

components.forEach(key => {
    Vue.component(key, () => import(`@/components/DataVisualEditor/custom-component/${key}`))
})
