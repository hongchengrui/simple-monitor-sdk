import { onPageChange } from './onPageChange'

/** 是否仍处于「首次访问」：发生首次路由切换后置为 false。CCP 仅在首次访问期间采集。 */
let firstVisitedState = true

onPageChange(() => {
  firstVisitedState = false
})

const getFirstVisitedState = () => {
  return {
    get state(): boolean {
      return firstVisitedState
    },
  }
}

export default getFirstVisitedState
