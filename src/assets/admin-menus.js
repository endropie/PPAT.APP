import moment from 'moment'

const common = [
  {
    name: 'Good Items',
    path: 'items',
    icon: 'style',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: null } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: null } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: null } },
      { page: 'view', path: ':id', meta: { permission: null } }
    ]
  },
  {
    hide: true,
    name: 'Materials',
    path: 'materials',
    opened: true,
    children: [
      {
        name: 'Material Items',
        path: 'e',
        icon: 'style'
      },
      {
        name: 'Material index',
        path: 'items2',
        icon: 'style'
      },
      {
        name: 'Material stock',
        path: 'items1',
        icon: 'style'
      }
    ]
  }
]

const incomes = [
  {
    name: 'Customers',
    icon: 'group',
    path: 'customers',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'customers-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'customers-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'customers-update' } },
      { page: 'view', path: ':id', meta: { permission: 'customers-read' } }
    ]
  },
  {
    hide: true,
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
    name: 'Deliveries',
    icon: 'border_all',
    path: 'delivery',
    first: 'pre-deliveries',
    // iframeTabs: true,
    // tabs: []
    children: [
      {
        name: 'Delivery Orders',
        icon: 'linear_scale',
        path: 'pre-deliveries',
        resources: [
          { page: 'index', path: '', icon: 'list', meta: { permission: 'pre-deliveries-read' } },
          { page: 'form', path: 'create', meta: { mode: 'create', permission: 'pre-deliveries-create' } },
          { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'pre-deliveries-update' } },
          { page: 'view', path: ':id', meta: { permission: 'pre-deliveries-read' } }
        ]
      },
      {
        name: 'Item Verify',
        icon: 'playlist_add_check',
        path: 'ship-delivery-items',
        resources: [
          { page: 'index', path: '', icon: 'list', meta: { permission: 'ship-delivery-items-read' } },
          { page: 'form', path: 'create', meta: { mode: 'create', permission: 'ship-delivery-items-create' } },
          // {page: 'form', path: ':id/edit', meta: {mode: 'edit', permission: 'ship-delivery-items-update'}},
          { page: 'view', path: ':id', meta: { permission: 'ship-delivery-items-read' } }
        ]
      },
      {
        name: 'Shipments',
        icon: 'local_shipping',
        path: 'ship-deliveries',
        resources: [
          { page: 'index', path: '', icon: 'list', meta: { permission: 'ship-deliveries-read' } },
          { page: 'form', path: 'create', meta: { mode: 'create', permission: 'ship-deliveries-create' } },
          // {page: 'form', path: ':id/edit', meta: {mode: 'edit', permission: 'ship-deliveries-update'}},
          { page: 'view', path: ':id', meta: { permission: 'ship-deliveries-read' } }
        ]
      },
      {
        name: 'SJ Delivery',
        icon: 'local_offer',
        path: 'delivery-orders',
        resources: [
          { page: 'index', path: '', icon: 'list', meta: { permission: 'delivery-orders-read' } },
          // {page: 'form', path: 'create', meta: {mode: 'create', permission: 'delivery-orders-create'}},
          // {page: 'form', path: ':id/edit', meta: {mode: 'edit', permission: 'delivery-orders-update'}},
          { page: 'reform', path: ':id/revision', meta: { mode: 'revision', permission: 'delivery-orders-update' } },
          { page: 'view', path: ':id', meta: { mode: 'view', permission: 'delivery-orders-read' } }
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
    name: 'Purchase Deliveries',
    icon: 'archive',
    path: 'purchase-deliveries',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'purcahse-delivery-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'purcahse-delivery-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'purcahse-delivery-update' } },
      { page: 'view', path: ':id', meta: { permission: 'purcahse-delivery-read' } }
    ]
  },
  {
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
    name: 'Incoming Goods',
    icon: 'assignment_returned',
    path: 'incoming-goods',
    param: '?begin_date=' + moment().format('YYYY-MM-DD') + '&until_date=' + moment().format('YYYY-MM-DD'),
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: null } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: null } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: null } },
      { page: 'view', path: ':id', meta: { permission: null } }
    ]
  }
]

const factories = [
  {
    name: 'Work Order',
    icon: 'timeline',
    path: 'work-orders',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: null } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: null } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: null } },
      { page: 'view', path: ':id', meta: { permission: null } }
    ]
  },
  {
    name: 'Work-In Production',
    icon: 'play_for_work',
    path: 'workin-productions',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: null } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: null } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: null } },
      { page: 'view', path: ':id', meta: { permission: null } }
    ]
  },
  {
    name: 'Packing Goods',
    icon: 'move_to_inbox',
    path: 'packings',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: null } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: null } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: null } },
      { page: 'view', path: ':id', meta: { permission: null } }
    ]
  }
]

const references = [
  {
    name: 'Brands',
    icon: 'format_bold',
    path: 'brands',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: null } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: null } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: null } }
    ]
  },
  {
    name: 'Specifications',
    icon: 'view_array',
    path: 'specifications',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: null } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: null } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: null } }
    ]
  },
  {
    name: 'Colors',
    icon: 'color_lens',
    path: 'colors',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: null } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: null } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: null } }
    ]
  },
  {
    name: 'Units',
    icon: 'web_asset',
    path: 'units',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: null } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: null } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: null } }
    ]
  },
  {
    name: 'Sizes',
    icon: 'format_size',
    path: 'sizes',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: null } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: null } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: null } }
    ]
  },
  {
    name: 'Type of items',
    icon: 'dehaze',
    path: 'type_items',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: null } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: null } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: null } }
    ]
  },
  {
    name: 'Category of items',
    icon: 'table_chart',
    path: 'category_items',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: null } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: null } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: null } }
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
        icon: 'input',
        path: 'general'
      },
      {
        name: 'Modules',
        icon: 'input',
        path: 'modules'
      }
    ]
  },
  { // Profile
    name: 'Profile',
    icon: 'perm_identity',
    path: 'profile',
    resources: [
      { page: 'form', path: '', meta: { mode: 'edit', permission: null } }
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
          { page: 'index', path: '', icon: 'list', meta: { permission: null } },
          { page: 'form', path: 'create', meta: { mode: 'create', permission: null } },
          { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: null } }
        ]
      },
      {
        name: 'Permissions',
        icon: 'format_bold',
        path: 'permissions',
        resources: [
          { page: 'index', path: '', icon: 'list', meta: { permission: null } },
          { page: 'form', path: 'create', meta: { mode: 'create', permission: null } },
          { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: null } }
        ]
      }
    ]
  },
  { // Customize
    name: 'Customize',
    icon: 'perm_identity',
    path: 'customize',
    resources: [
      { page: 'form', path: '', meta: { mode: 'edit' } }
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
  // { // Dashboard
  //   name: 'Dashboard',
  //   icon: 'widgets',
  //   path: 'dashboard',
  //   fileType: '.md'
  // },
  { // common
    name: 'Common',
    icon: 'shopping_cart',
    path: 'common',
    children: common
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
  { // Warehouse
    name: 'Warehouses',
    icon: 'kitchen',
    path: 'warehouses',
    children: warehouses
  },
  { // Factory
    name: 'Factories',
    icon: 'gavel',
    path: 'factories',
    children: factories
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
    name: 'Change Log',
    icon: 'widgets',
    path: 'log',
    file: 'README.md'
    // fileType: '.md'
  }
]
