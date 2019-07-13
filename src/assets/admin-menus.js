import moment from 'moment'
import access from '@/router/middleware/access'
import permission from '@/router/middleware/permission'

const common = [
  {
    name: 'Good Items',
    path: 'items',
    icon: 'style',
    middleware: [access, permission],
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { middleware: [permission()] } },
      { page: 'form', path: 'create', meta: { mode: 'create', middleware: [permission()] } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', middleware: [permission()] } },
      { page: 'view', path: ':id', meta: { middleware: [permission()] } }
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
      { page: 'index', path: '', icon: 'list', meta: { middleware: [permission()] } },
      { page: 'form', path: 'create', meta: { mode: 'create', middleware: [permission()] } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', middleware: [permission()] } },
      { page: 'view', path: ':id', meta: { middleware: [permission()] } }
    ]
  },
  {
    hide: true,
    name: 'Forecasts',
    icon: 'timeline',
    path: 'forecasts',
    middleware: [access],
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { middleware: [permission()] } },
      { page: 'form', path: 'create', meta: { mode: 'create', middleware: [permission()] } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', middleware: [permission()] } },
      { page: 'view', path: ':id', meta: { middleware: [permission()] } }
    ]
  },
  {
    name: 'Sale Orders',
    icon: 'shop',
    path: 'request-orders',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { middleware: [permission()] } },
      { page: 'form', path: 'create', meta: { mode: 'create', middleware: [permission()] } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', middleware: [permission()] } },
      { page: 'view', path: ':id', meta: { middleware: [permission()] } }
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
          { page: 'index', path: '', icon: 'list', meta: { middleware: [permission()] } },
          { page: 'form', path: 'create', meta: { mode: 'create', middleware: [permission()] } },
          { page: 'form', path: ':id/edit', meta: { mode: 'edit', middleware: [permission()] } },
          { page: 'view', path: ':id', meta: { middleware: [permission()] } }
        ]
      },
      {
        name: 'Item Verify',
        icon: 'playlist_add_check',
        path: 'ship-delivery-items',
        resources: [
          { page: 'index', path: '', icon: 'list', meta: { middleware: [permission(['delivery-orders-read'])] } },
          { page: 'form', path: 'create', meta: { mode: 'create', middleware: [permission(['delivery-orders-create'])] } },
          // {page: 'form', path: ':id/edit', meta: {mode: 'edit', middleware: [permission(['delivery-orders-update'])]}},
          { page: 'view', path: ':id', meta: { middleware: [permission(['delivery-orders-read'])] } }
        ]
      },
      {
        name: 'Shipments',
        icon: 'local_shipping',
        path: 'ship-deliveries',
        resources: [
          { page: 'index', path: '', icon: 'list', meta: { middleware: [permission(['delivery-orders-read'])] } },
          { page: 'form', path: 'create', meta: { mode: 'create', middleware: [permission(['delivery-orders-create'])] } },
          // {page: 'form', path: ':id/edit', meta: {mode: 'edit', middleware: [permission(['delivery-orders-update'])]}},
          { page: 'view', path: ':id', meta: { middleware: [permission(['delivery-orders-read'])] } }
        ]
      },
      {
        name: 'SJ Delivery',
        icon: 'local_offer',
        path: 'delivery-orders',
        resources: [
          { page: 'index', path: '', icon: 'list', meta: { middleware: [permission(['delivery-orders-read'])] } },
          // {page: 'form', path: 'create', meta: {mode: 'create', middleware: [permission(['delivery-orders-create'])]}},
          // {page: 'form', path: ':id/edit', meta: {mode: 'edit', middleware: [permission(['delivery-orders-update'])]}},
          { page: 'reform', path: ':id/revision', meta: { mode: 'revision', middleware: [permission(['delivery-orders-read'])] } },
          { page: 'view', path: ':id', meta: { mode: 'view', middleware: [permission(['delivery-orders-read'])] } }
        ]
      }
    ]
  },
  {
    hide: true,
    name: 'Invoices',
    icon: 'local_atm',
    path: 'invoices'
  }
]

const expenses = [
  {
    name: 'Purchase Orders',
    icon: 'shopping_basket',
    path: 'purchase-orders'
  },
  {
    name: 'Purchase Deliveries',
    icon: 'archive',
    path: 'purchase-deliveries'
  },
  {
    name: 'Purchase bills',
    icon: 'money',
    path: 'purchase-bills'
  }
]

const warehouses = [
  {
    name: 'Incoming Goods',
    icon: 'assignment_returned',
    path: 'incoming-goods',
    param: '?begin_daterange=' + moment().format('YYYY-MM-DD') + '&until_daterange=' + moment().format('YYYY-MM-DD'),
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { middleware: [permission()] } },
      { page: 'form', path: 'create', meta: { mode: 'create', middleware: [permission()] } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', middleware: [permission()] } },
      { page: 'view', path: ':id', meta: { middleware: [permission()] } }
    ]
  }
]

const factories = [
  {
    name: 'Work Order',
    icon: 'timeline',
    path: 'work-orders',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { middleware: [permission()] } },
      { page: 'form', path: 'create', meta: { mode: 'create', middleware: [permission()] } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', middleware: [permission()] } },
      { page: 'view', path: ':id', meta: { middleware: [permission()] } }
    ]
  },
  {
    name: 'Work-In Production',
    icon: 'play_for_work',
    path: 'workin-productions',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { middleware: [permission()] } },
      { page: 'form', path: 'create', meta: { mode: 'create', middleware: [permission()] } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', middleware: [permission()] } },
      { page: 'view', path: ':id', meta: { middleware: [permission()] } }
    ]
  },
  {
    name: 'Packing Goods',
    icon: 'move_to_inbox',
    path: 'packings',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { middleware: [permission()] } },
      { page: 'form', path: 'create', meta: { mode: 'create', middleware: [permission()] } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', middleware: [permission()] } },
      { page: 'view', path: ':id', meta: { middleware: [permission()] } }
    ]
  }
]

const references = [
  {
    name: 'Brands',
    icon: 'format_bold',
    path: 'brands',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { middleware: [permission()] } },
      { page: 'form', path: 'create', meta: { mode: 'create', middleware: [permission()] } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', middleware: [permission()] } }
    ]
  },
  {
    name: 'Specifications',
    icon: 'view_array',
    path: 'specifications',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { middleware: [permission()] } },
      { page: 'form', path: 'create', meta: { mode: 'create', middleware: [permission()] } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', middleware: [permission()] } }
    ]
  },
  {
    name: 'Colors',
    icon: 'color_lens',
    path: 'colors',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { middleware: [permission()] } },
      { page: 'form', path: 'create', meta: { mode: 'create', middleware: [permission()] } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', middleware: [permission()] } }
    ]
  },
  {
    name: 'Units',
    icon: 'web_asset',
    path: 'units',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { middleware: [permission()] } },
      { page: 'form', path: 'create', meta: { mode: 'create', middleware: [permission()] } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', middleware: [permission()] } }
    ]
  },
  {
    name: 'Sizes',
    icon: 'format_size',
    path: 'sizes',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { middleware: [permission()] } },
      { page: 'form', path: 'create', meta: { mode: 'create', middleware: [permission()] } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', middleware: [permission()] } }
    ]
  },
  {
    name: 'Type of items',
    icon: 'dehaze',
    path: 'type_items',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { middleware: [permission()] } },
      { page: 'form', path: 'create', meta: { mode: 'create', middleware: [permission()] } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', middleware: [permission()] } }
    ]
  },
  {
    name: 'Category of items',
    icon: 'table_chart',
    path: 'category_items',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { middleware: [permission()] } },
      { page: 'form', path: 'create', meta: { mode: 'create', middleware: [permission()] } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', middleware: [permission()] } }
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
      { page: 'form', path: '', meta: { mode: 'edit', middleware: [permission()] } }
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
          { page: 'index', path: '', icon: 'list', meta: { middleware: [permission(['users-read'])] } },
          { page: 'form', path: 'create', meta: { mode: 'create', middleware: [permission(['users-create'])] } },
          { page: 'form', path: ':id/edit', meta: { mode: 'edit', middleware: [permission(['users-update'])] } }
        ]
      },
      {
        name: 'Roles',
        icon: 'format_bold',
        path: 'roles',
        resources: [
          { page: 'index', path: '', icon: 'list', meta: { middleware: [permission()] } },
          { page: 'form', path: 'create', meta: { mode: 'create', middleware: [permission()] } },
          { page: 'form', path: ':id/edit', meta: { mode: 'edit', middleware: [permission()] } }
        ]
      },
      {
        name: 'Permissions',
        icon: 'format_bold',
        path: 'permissions',
        resources: [
          { page: 'index', path: '', icon: 'list', meta: { middleware: [permission()] } },
          { page: 'form', path: 'create', meta: { mode: 'create', middleware: [permission()] } },
          { page: 'form', path: ':id/edit', meta: { mode: 'edit', middleware: [permission()] } }
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
    middleware: [access, permission],
    path: 'desktop'
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
