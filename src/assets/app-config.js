import moment from 'moment'

const config = {
  general: {
    baseURL: 'http://ppa.virmata.com' // 'http://laravel.ppa'
  },
  options: {
    prefix_intervals: [
      { value: '', label: '-' },
      { value: '{Y}', label: `YYYY`, digit: `${moment().format('YYYY')}` },
      { value: '{y}', label: `YY`, digit: `${moment().format('YY')}` },
      { value: '{m-Y}', label: `YYYY-MM`, digit: `${moment().format('YYYY-MM')}` }
    ],
    transaction_mode: [
      { label: 'REGULER', value: 'REGULER' },
      { label: 'RETURN', value: 'RETURN' }
    ],
    worktime: [
      { label: 'REGULER', value: 'REGULER' },
      { label: 'OVERTIME', value: 'OVERTIME', color: 'secondary' }
    ],
    order_mode: [
      { label: 'None', value: 'NONE' },
      { label: 'PO', value: 'PO' },
      { label: 'PO Accumulate', value: 'ACCUMULATE' }
    ],
    invoice_mode: [
      { value: 'JOIN', label: 'JOIN', detail: 'Service & material are joined', color: 'positive' },
      { value: 'SEPARATE', label: 'SEPARATE', detail: 'Service & material are separated', color: 'orange' },
      { value: 'DETAIL', label: 'DETAIL', detail: 'Service & material Specified', color: 'blue' }
    ],
    delivery_mode: [
      { value: 'JOIN', label: 'JOIN', detail: 'Service & material are joined', color: 'positive' },
      { value: 'SEPARATE', label: 'SEPARATE', detail: 'Service & material are separated', color: 'orange' },
      { value: 'DETAIL', label: 'DETAIL', detail: 'Service & material Specified', color: 'blue' },
      { value: 'UNIT_DETAIL', label: 'UNIT_DETAIL', detail: 'Units of service & material Specified', color: 'info' }
    ]
  },
  items: {
    stockists: [
      { value: 'FM', label: 'FRESH MATERIAL' },
      { value: 'WO', label: 'WORK ORDER' },
      { value: 'WIP', label: 'WORK PROCESS' },
      { value: 'FG', label: 'FINISH GOOD' },
      { value: 'NG', label: 'NOT GOOD', color: 'warning' },
      { value: 'RET', label: 'REPAIR', color: 'orange-8' }
    ]
  },
  incomes: {
    // code
  },
  references: {
    vehicle_type: ['DELIVERY', 'OFFICE', 'OTHERS'],
    vehicle_owner: ['PPA', 'RENTAL', 'OTHERS']
  }
}

export default config
