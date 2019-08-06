import moment from 'moment'

const common = [
  {
    name: 'Good Items',
    path: 'items',
    icon: 'style',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'items-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'items-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'items-update' } },
      { page: 'view', path: ':id', meta: { permission: 'items-read' } }
    ]
  }
]

const incomes = [
  {
    name: 'Customers',
    icon: 'group',
    path: 'customers',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'items-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'customers-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'customers-update' } },
      { page: 'view', path: ':id', meta: { permission: 'customers-read' } }
    ]
  },
  {
    name: 'Forecasts',
    icon: 'timeline',
    path: 'forecasts',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'forecasts-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'forecasts-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'forecasts-update' } },
      { page: 'view', path: ':id', meta: { permission: 'forecasts-read' } }
    ]
  },
  {
    name: 'Sale Orders',
    icon: 'shop',
    path: 'request-orders',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'request-orders-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'request-orders-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'request-orders-update' } },
      { page: 'view', path: ':id', meta: { permission: 'request-orders-read' } }
    ]
  },
  {
    name: 'Delivery',
    icon: 'local_shipping',
    path: 'delivery',
    first: 'pre-deliveries',
    // iframeTabs: true,
    // tabs: []
    children: [
      {
        name: 'Pre-Delivery Orders',
        icon: 'assignment',
        path: 'pre-deliveries',
        resources: [
          { page: 'index', path: '', icon: 'list', meta: { permission: 'pre-deliveries-read' } },
          { page: 'form', path: 'create', meta: { mode: 'create', permission: 'pre-deliveries-create' } },
          { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'pre-deliveries-update' } },
          { page: 'view', path: ':id', meta: { permission: 'pre-deliveries-read' } }
        ]
      },
      {
        name: 'SJ-Delivery Orders',
        icon: 'local_offer',
        path: 'delivery-orders',
        resources: [
          { page: 'index', path: '', icon: 'list', meta: { permission: 'sj-delivery-orders-read' } },
          // {page: 'form', path: 'create', meta: {mode: 'create', permission: 'delivery-orders-create'}},
          // {page: 'form', path: ':id/edit', meta: {mode: 'edit', permission: 'delivery-orders-update'}},
          { page: 'reform', path: ':id/revision', meta: { mode: 'revision', permission: 'sj-delivery-orders-update' } },
          { page: 'view', path: ':id', meta: { mode: 'view', permission: 'sj-delivery-orders-read' } }
        ]
      }
    ]
  },
  {
    hide: true,
    name: 'Invoices',
    icon: 'local_atm',
    path: 'invoices',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'invoices-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'invoices-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'invoices-update' } },
      { page: 'view', path: ':id', meta: { permission: 'invoices-read' } }
    ]
  }
]

const expenses = [
  {
    hide: true,
    name: 'Purchase Orders',
    icon: 'shopping_basket',
    path: 'purchase-orders',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'purchase-orders-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'purchase-orders-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'purchase-orders-update' } },
      { page: 'view', path: ':id', meta: { permission: 'purchase-orders-read' } }
    ]
  },
  {
    hide: true,
    name: 'Purchase Deliveries',
    icon: 'archive',
    path: 'purchase-deliveries',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'purchase-delivery-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'purchase-delivery-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'purchase-delivery-update' } },
      { page: 'view', path: ':id', meta: { permission: 'purchase-delivery-read' } }
    ]
  },
  {
    hide: true,
    name: 'Purchase bills',
    icon: 'money',
    path: 'purchase-bills',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'purchase-bills-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'purchase-bills-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'purchase-bills-update' } },
      { page: 'view', path: ':id', meta: { permission: 'purchase-bills-read' } }
    ]
  }
]

const warehouses = [
  {
    name: 'Incoming Good',
    icon: 'move_to_inbox',
    path: 'incoming-goods',
    param: `?begin_date=${moment().format('YYYY-MM-DD')}`,
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'incoming-goods-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'incoming-goods-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'incoming-goods-update' } },
      { page: 'view', path: ':id', meta: { permission: 'incoming-goods-read' } }
    ]
  },
  {
    name: 'Outgoing Verification',
    icon: 'assignment_turned_in',
    path: 'outgoing-verifications',
    param: `?isWait=1`,
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'outgoing-verifications-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'outgoing-verifications-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'outgoing-verifications-update' } },
      { page: 'view', path: ':id', meta: { permission: 'outgoing-verifications-read' } }
    ]
  },
  {
    name: 'Outgoing Good',
    icon: 'unarchive',
    path: 'outgoing-goods',
    param: ``,
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'outgoing-goods-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'outgoing-goods-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'outgoing-goods-update' } },
      { page: 'view', path: ':id', meta: { permission: 'outgoing-goods-read' } }
    ]
  }
]

const factories = [
  {
    name: 'Work Order',
    icon: 'work',
    path: 'work-orders',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'work-orders-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'work-orders-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'work-orders-update' } },
      { page: 'view', path: ':id', meta: { permission: 'work-orders-read' } }
    ]
  },
  {
    name: 'Work In Process',
    icon: 'work',
    path: 'work-process',
    param: `?status=OPEN`,
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'work-process-read' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'work-process-close' } },
      { page: 'view', path: ':id', meta: { permission: 'work-process-read' } }
    ]
  },
  {
    name: 'Production',
    icon: 'gavel',
    path: 'productions',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'productions-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'productions-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'productions-update' } },
      { page: 'view', path: ':id', meta: { permission: 'productions-read' } }
    ]
  },
  {
    name: 'Packing Goods',
    icon: 'move_to_inbox',
    path: 'packings',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'packings-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'packings-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'packings-update' } },
      { page: 'view', path: ':id', meta: { permission: 'packings-read' } }
    ]
  }
]

const references = [
  {
    name: 'Brands',
    icon: 'format_bold',
    path: 'brands',
    resources: [
      { page: 'index', path: '', meta: { permission: 'brands-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'brands-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'brands-update' } }
    ]
  },
  {
    name: 'Specifications',
    icon: 'view_array',
    path: 'specifications',
    resources: [
      { page: 'index', path: '', meta: { permission: 'specifications-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'specifications-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'specifications-update' } }
    ]
  },
  {
    name: 'Lines',
    icon: 'insert_chart_outlined',
    path: 'lines',
    resources: [
      { page: 'index', path: '', meta: { permission: 'lines-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'lines-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'lines-update' } }
    ]
  },
  {
    name: 'Colors',
    icon: 'color_lens',
    path: 'colors',
    resources: [
      { page: 'index', path: '', meta: { permission: 'colors-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'colors-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'colors-update' } }
    ]
  },
  {
    name: 'Units',
    icon: 'web_asset',
    path: 'units',
    resources: [
      { page: 'index', path: '', meta: { permission: 'units-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'units-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'units-update' } }
    ]
  },
  {
    name: 'Sizes',
    icon: 'format_size',
    path: 'sizes',
    resources: [
      { page: 'index', path: '', meta: { permission: 'sizes-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'sizes-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'sizes-update' } }
    ]
  },
  {
    name: 'Type of items',
    icon: 'dehaze',
    path: 'type_items',
    resources: [
      { page: 'index', path: '', meta: { permission: 'type-items-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'type-items-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'type-items-update' } }
    ]
  },
  {
    name: 'Category of items',
    icon: 'table_chart',
    path: 'category_items',
    resources: [
      { page: 'index', path: '', meta: { permission: 'category-items-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'category-items-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'category-items-update' } }
    ]
  }
]

const configuration = [
  { // Application
    name: 'Application',
    icon: 'border_all',
    path: 'app',
    first: 'general',
    iframeTabs: true,
    tabs: [
      {
        name: 'General',
        icon: 'business',
        path: 'general'
      },
      {
        name: 'Modules',
        icon: 'apps',
        path: 'modules'
      }
    ]
  },
  { // Profile
    name: 'Profile',
    icon: 'perm_identity',
    path: 'profile',
    resources: [
      { page: 'form', path: '', meta: { mode: 'edit', permission: 'profile-update' } }
    ]
  },
  {
    name: 'Authentication',
    icon: 'verified_user',
    menuicon: true,
    path: 'auth',
    children: [
      {
        name: 'Users',
        icon: 'supervisor_account',
        path: 'users',
        resources: [
          { page: 'index', path: '', icon: 'list', meta: { permission: 'users-read' } },
          { page: 'form', path: 'create', meta: { mode: 'create', permission: 'users-create' } },
          { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'users-update' } }
        ]
      },
      {
        name: 'Roles',
        icon: 'format_bold',
        path: 'roles',
        resources: [
          { page: 'index', path: '', icon: 'list', meta: { permission: 'roles-read' } },
          { page: 'form', path: 'create', meta: { mode: 'create', permission: 'roles-create' } },
          { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'roles-update' } }
        ]
      },
      {
        name: 'Permissions',
        icon: 'format_bold',
        path: 'permissions',
        resources: [
          { page: 'index', path: '', icon: 'list', meta: { permission: 'permissions-read' } },
          { page: 'form', path: 'create', meta: { mode: 'create', permission: 'permissions-create' } },
          { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'permissions-update' } }
        ]
      }
    ]
  },
  { // Customize
    name: 'Customize',
    icon: 'perm_identity',
    path: 'customize',
    resources: [
      { page: 'form', path: '', meta: { mode: 'edit', permission: null } }
    ]
  }
]

export default [
  { // Desktop
    name: 'Desktop',
    icon: 'home',
    path: 'desktop',
    meta: {
      authenticated: true
    }
  },
  { // Dashboard
    name: 'Dashboard',
    icon: 'widgets',
    path: 'dashboard'
  },
  { // Warehouse
    name: 'Warehouse',
    icon: 'kitchen',
    path: 'warehouses',
    children: warehouses
  },
  { // Factory
    name: 'Factories',
    icon: 'group_work',
    path: 'factories',
    children: factories
  },
  { // Incomes
    name: 'Incomes',
    icon: 'monetization_on',
    path: 'incomes',
    children: incomes
  },
  { // Expenses
    hide: true,
    name: 'Expenses',
    icon: 'shopping_cart',
    path: 'expenses',
    children: expenses
  },
  { // common
    name: 'Common',
    icon: 'dns',
    path: 'common',
    children: common
  },
  { // References
    name: 'References',
    icon: 'dashboard',
    path: 'references',
    // extract: true,
    children: references
  },
  { // References
    name: 'Configuration',
    icon: 'settings',
    path: 'configuration',
    // extract: true,
    children: configuration
  },
  {
    name: 'Documentation',
    icon: 'chrome_reader_mode',
    path: 'log',
    file: 'README.md'
    // fileType: '.md'
  }
]
