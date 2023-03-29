
import { getRandStr } from './utils'

export function generateUniqueId(len) {
  return getRandStr(len)
}


const idList = []

let id = 0
// 主要用于 Vue 的 diff 算法，为每个元素创建一个独一无二的 ID
export default function generateID() {
  while (idList.indexOf(id) !== -1)
    ++id
  return id++
}


export function resetID(data) {

  data.forEach((item) => {
    if (item.id === null || item.id === undefined)
      item.id = generateID()
    idList.push(item.id)
    if (item.component === "Group") {
      this.resetID(item.propValue);
    }
  });
  return data;
}

