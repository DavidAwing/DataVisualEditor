
const dbName = 'DataVisualEditorDB';
const version = 1
let _storeName = 'canvas-data'

let indexedDB = window.indexedDB
let db: any;
const request = indexedDB.open(dbName, version)

const CallbackMap = {

  onOpenError: new Array<any>(),
  onOpenSuccess: new Array<any>(),

}

request.onsuccess = (event: Event) => {
  db = (event.target as any).result // 数据库对象
  console.log("数据库类型", event);
  console.log("数据库类型", db);
  console.log('数据库打开成功')

  CallbackMap.onOpenSuccess.forEach(callback => {
    callback()
  })
}

request.onerror = function (event) {
  console.log('数据库打开报错')
}

// 数据库创建或升级的时候会触发
request.onupgradeneeded = function (event) {
  console.log('数据库创建或升级, onupgradeneeded')
  db = (event.target as any).result // 数据库对象

  let objectStore
  if (!db.objectStoreNames.contains(_storeName)) {
    objectStore = db.createObjectStore(_storeName, { keyPath: 'id' }) // 创建表
    objectStore.createIndex('id', 'id', { unique: true }) // 创建索引 可以让你搜索任意字段
    objectStore.createIndex('type', 'type', { unique: false }) // 创建索引 可以让你搜索任意字段
  }
}

// 添加数据
function addData(storeName: string, data: any) {

  return new Promise((resolve, reject) => {

    let request = db.transaction([storeName], 'readwrite') // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
      .objectStore(storeName) // 仓库对象
      .add(data)

    request.onsuccess = (event: any) => {
      console.log('数据写入成功')
      resolve('数据写入成功')
    }

    request.onerror = function (event: any) {
      console.log('数据写入失败')
      reject(new Error(event.target.error))
    }
  })
}

function putData(storeName: string, data: any) {

  return new Promise((resolve, reject) => {

    let request = db.transaction([storeName], 'readwrite') // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
      .objectStore(storeName) // 仓库对象
      .put(data)

    request.onsuccess = (event: any) => {
      console.log('put数据写入成功')
      resolve('put数据写入成功')
    }

    request.onerror = function (event: any) {
      console.log('put数据写入失败')
      reject(new Error(event.target.error))
    }
  })
}

// 根据id获取数据
function getDataByKey(storeName: string, key: any) {

  return new Promise((resolve, reject) => {

    const transaction = db.transaction([storeName]) // 事务
    const objectStore = transaction.objectStore(storeName) // 仓库对象
    const request = objectStore.get(key)

    request.onerror = (event: any) => {
      console.log('事务失败')
      reject(new Error('事务失败'))
    }

    request.onsuccess = (event: any) => {
      console.log('主键查询结果: ', request)
      console.log('主键查询结果: ', request.result)
      resolve(request.result?.value)
    }
  })
}

// 根据id修改数
function updateData(storeName: string, data: any) {

  return new Promise((resolve, reject) => {

    let request = db.transaction([storeName], 'readwrite') // 事务对象
      .objectStore(storeName) // 仓库对象
      .put(data)

    request.onsuccess = () => {
      console.log('数据更新成功')
      resolve('数据更新成功')
    }

    request.onerror = () => {
      console.log('数据更新失败');
      reject(new Error('数据更新失败'))
    }
  })
}

// 根据id删除数据
function deleteDB(storeName: string, id: any) {

  return new Promise((resolve, reject) => {

    let request = db.transaction([storeName], 'readwrite').objectStore(storeName).delete(id)

    request.onsuccess = (Event: any) => {
      console.log('数据删除成功')
      resolve(Event)
    }

    request.onerror = (Event: any) => {
      console.log('数据删除失败')
      reject(Event)
    }

  })
}

function objectStoreExist(key: any) {

  if (db.objectStoreNames.contains(key))
    return true;
  else
    return false;

}

function setActiveStoreName(storeName: string) {
  _storeName = storeName
}

function setItem(key: any, value: any) {

  return putData(_storeName, { id: key, type: value?.type, value: value })
}

function getItem(key: any) {

  return getDataByKey(_storeName, key)
}

function removeItem(key: any) {
  return deleteDB(_storeName, key)
}

function getAllItemByKey(keyword: any) {

  return new Promise((resolve, reject) => {

    const transaction = db.transaction([_storeName], "readonly") // 事务
    const objectStore = transaction.objectStore(_storeName) // 仓库对象

    const request = objectStore.openCursor();
    const itemList = new Array<any>()
    let most = 0;
    request.onsuccess = (event: any) => {
      const cursor = event.target.result;
      if (cursor && most < 1000000) {
        const key = cursor.key
        if (keyword === key) {
          itemList.push(cursor.value.value)
          most++;
        }
        cursor.continue();
      } else {
        resolve(itemList)
      }
    };
  })
}

function getAllItemByType(type: string | number) {

  return new Promise((resolve, reject) => {

    const transaction = db.transaction([_storeName], "readonly") // 事务
    const objectStore = transaction.objectStore(_storeName) // 仓库对象

    const request = objectStore.openCursor();
    const itemList = new Array<any>()
    let most = 0;
    request.onsuccess = (event: any) => {
      const cursor = event.target.result;
      if (cursor && most < 10000) {

        const rowType = cursor.value.type
        if (rowType === type) {
          itemList.push(cursor.value.value)
          most++;
        }
        cursor.continue();
      } else {
        resolve(itemList)
      }
    };
  })
}

export { setActiveStoreName, setItem, getItem, removeItem, getAllItemByKey, getAllItemByType, CallbackMap }
