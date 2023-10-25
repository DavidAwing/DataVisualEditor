export default {
  mutations: {
    lock({ curComponent, activeComponentList, canvasComponentData }) {
      curComponent.isLock = true
      activeComponentList.forEach(id => {
        const c = canvasComponentData.find(c => c.id === id)
        c.isLock = true
      })

    },

    unlock({ curComponent, activeComponentList, canvasComponentData }) {
      curComponent.isLock = false
      activeComponentList.forEach(id => {
        const c = canvasComponentData.find(c => c.id === id)
        c.isLock = false
      })
    }
  }
}
