
const config = {
  general: {
    baseURL: 'http://ppa.virmata.com' // 'http://laravel.ppa'
  },
  options: {
    transaction_mode: [
      { label: 'REGULER', value: 'REGULER' },
      { label: 'RETURN', value: 'RETURN' }
    ],
    order_mode: [
      { label: 'PO', value: 'PO' },
      { label: 'None PO', value: 'NONE' },
      { label: 'PO Accumulate', value: 'ACCUMULATE' }
    ]
  },
  model: {
    pre_deliveries: {
      max_quantity_validation: true
    }
  }
}

export default config
