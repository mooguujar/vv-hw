import type { ComputedRef } from 'vue'
import { application } from '@tg/utils'
import { watch } from 'vue'

// 定义一个返回Promise的函数
interface PromiseFn {
  (...args: any[]): Promise<any>
}

interface IResetPage {
  (): void
}

export function useListSearch(params: ComputedRef, fn: PromiseFn, resetPage: IResetPage) {
  fn(application.removeEmpty(params.value))

  watch(params, (val, oVal) => {
    if (val.page === oVal.page && oVal.page !== 1) {
      resetPage()
      return
    }
    if (!(`${val.start_time}${val.end_time}`).includes('Invalid Date'))
      fn(application.removeEmpty(params.value))
  })
}
