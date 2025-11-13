import { defineStore } from 'pinia'
import axios from 'axios'

export type StatusType = '전체' | '완료' | '진행중' | '대기'
export type CategoryType = 'main' | 'auth' | 'other'

export interface PublishItem {
  id: number
  category: CategoryType
  depth1: string
  depth2: string
  depth3: string
  type: string
  folder: string
  file: string
  status: Exclude<StatusType, '전체'>
  startDate: string
  endDate: string
  modifiedDate: string
  devStartDate: string
  hasDesign: boolean
  history: string[]
}

interface PublishState {
  publishList: PublishItem[]
  searchKeyword: string
  statusFilter: StatusType
  depth1Filter: string
  categoryFilter: CategoryType | '전체'
  startDateFilter: string // 시작일 필터
  devStartDateFilter: string // 개발시작일 필터
  hasDesignFilter: '전체' | '예' | '아니오' // 디자인 필터
  loading: boolean
  error: string | null
}

export const usePublishStore = defineStore('publish', {
  state: (): PublishState => ({
    publishList: [],
    searchKeyword: '',
    statusFilter: '전체',
    depth1Filter: '전체',
    categoryFilter: '전체',
    startDateFilter: '',
    devStartDateFilter: '',
    hasDesignFilter: '전체',
    loading: false,
    error: null,
  }),

  actions: {
    async fetchPublishList() {
      this.loading = true
      this.error = null
      try {
        const categories: CategoryType[] = ['main', 'auth', 'other']

        const requests = categories.map(cat =>
          axios
            .get<{ publish?: Omit<PublishItem, 'category'>[] }>(`/db/publish-${cat}.json`)
            .then(res => {
              const publishData = res.data?.publish ?? []
              if (!Array.isArray(publishData)) return []
              return publishData.map(item => ({
                ...item,
                category: cat,
              }))
            })
            .catch(err => {
              console.error(`데이터 로드 실패: publish-${cat}.json`, err)
              return []
            })
        )

        const results = await Promise.all(requests)
        this.publishList = results.flat()
      } catch (err: unknown) {
        console.error('데이터 로드 실패:', err)
        this.publishList = []
        this.error = '퍼블리시 데이터를 불러오는데 실패했습니다.'
      } finally {
        this.loading = false
      }
    },
    setSearchKeyword(keyword: string) {
      this.searchKeyword = keyword
    },

    setStatusFilter(status: StatusType) {
      this.statusFilter = status
    },

    setDepth1Filter(depth1: string) {
      this.depth1Filter = depth1
    },

    setCategoryFilter(category: CategoryType | '전체') {
      this.categoryFilter = category
    },
    setStartDateFilter(date: string) {
      this.startDateFilter = date
    },
    setDevStartDateFilter(date: string) {
      this.devStartDateFilter = date
    },
    setHasDesignFilter(value: '전체' | '예' | '아니오') {
      this.hasDesignFilter = value
    },
  },

  getters: {
    filteredList(): PublishItem[] {
      const keyword = this.searchKeyword.trim().toLowerCase()

      return this.publishList.filter(item => {
        const matchCategory =
          this.categoryFilter === '전체' || item.category === this.categoryFilter

        const matchKeyword =
          !keyword ||
          item.depth1.toLowerCase().includes(keyword) ||
          item.depth2.toLowerCase().includes(keyword) ||
          item.depth3.toLowerCase().includes(keyword)

        const matchStatus = this.statusFilter === '전체' || item.status === this.statusFilter

        const matchDepth1 = this.depth1Filter === '전체' || item.depth1 === this.depth1Filter

        const matchStartDate = !this.startDateFilter || item.startDate === this.startDateFilter

        const matchDevStartDate =
          !this.devStartDateFilter || item.devStartDate === this.devStartDateFilter

        const matchHasDesign =
          this.hasDesignFilter === '전체' ||
          (this.hasDesignFilter === '예' && item.hasDesign) ||
          (this.hasDesignFilter === '아니오' && !item.hasDesign)

        return (
          matchCategory &&
          matchKeyword &&
          matchStatus &&
          matchDepth1 &&
          matchStartDate &&
          matchDevStartDate &&
          matchHasDesign
        )
      })
    },

    groupedByDepth1(): Record<string, PublishItem[]> {
      return this.filteredList.reduce(
        (groups: Record<string, PublishItem[]>, item) => {
          if (!groups[item.depth1]) groups[item.depth1] = []
          groups[item.depth1].push(item)
          return groups
        },
        {} as Record<string, PublishItem[]>
      )
    },

    totalCount(): number {
      return this.filteredList.length
    },

    doneCount(): number {
      return this.filteredList.filter(item => item.status === '완료').length
    },

    progressCount(): number {
      return this.filteredList.filter(item => item.status === '진행중').length
    },

    waitCount(): number {
      return this.filteredList.filter(item => item.status === '대기').length
    },

    doneRate(): string {
      const total = this.filteredList.length
      const done = this.filteredList.filter(item => item.status === '완료').length
      return total ? ((done / total) * 100).toFixed(1) + '%' : '0%'
    },
  },
})
