const names = ['张三', '李四', '王五', '任六', '鬼脚七']
const gender = ['男', '女', '不明']
const sample = arr => arr[Math.floor(Math.random() * arr.length)]

export default function getData (pageNo, pageSize) {
  return {
    pageNo,
    pageSize,
    totalPage: Math.floor(Math.random() * 10),
    rows: [...Array(pageSize)].map(() => ({
      name: sample(names),
      gender: sample(gender),
      age: Math.floor(Math.random() * 100)
    })),
  }
}
