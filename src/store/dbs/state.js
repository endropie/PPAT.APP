const std = {
  data: [],
  loading: false,
  error: false,
  message: null
}
export default {
  common: {
    items: {
      api: 'api/v1/common/items',
      ...std
    }
  },
  references: {
    brands: {
      api: 'api/v1/references/brands',
      ...std
    },
    spesifications: {
      api: 'api/v1/references/spesifications',
      ...std
    }
  }
}
