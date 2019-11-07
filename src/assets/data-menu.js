// import moment from 'moment'

const common = [
  {
    name: 'Part Items',
    path: 'items',
    icon: 'style',
    lang: 'general.item',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'items-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'items-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'items-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'items-read' } }
    ]
  },
  {
    name: 'Employee',
    path: 'employees',
    icon: 'style',
    lang: 'general.employee',
    resources: [
      { page: 'index', path: '', icon: 'mdi-account-group', meta: { permission: 'employees-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'employees-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'employees-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'items-read' } }
    ]
  },
  {
    name: 'Customers',
    icon: 'group',
    path: 'customers',
    lang: 'general.customer',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'items-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'customers-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'customers-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'customers-read' } }
    ]
  }
]

const references = [
  {
    name: 'Departments',
    icon: 'mdi-flag-triangle',
    path: 'departments',
    lang: 'general.department',
    resources: [
      { page: 'index', path: '', meta: { permission: 'departments-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'departments-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'departments-update' } }
    ]
  },
  {
    name: 'Positions',
    icon: 'mdi-account-settings',
    path: 'positions',
    lang: 'general.position',
    resources: [
      { page: 'index', path: '', meta: { permission: 'positions-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'positions-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'positions-update' } }
    ]
  },
  {
    name: 'Vehicles',
    icon: 'mdi-car-multiple',
    path: 'vehicles',
    lang: 'general.vehicle',
    resources: [
      { page: 'index', path: '', meta: { permission: 'brands-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'brands-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'brands-update' } }
    ]
  },
  {
    name: 'Brands',
    icon: 'format_bold',
    path: 'brands',
    lang: 'general.brand',
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
    lang: 'general.specification',
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
    lang: 'general.line',
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
    lang: 'general.color',
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
    lang: 'general.unit',
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
    lang: 'general.size',
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
    lang: 'general.item_type',
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
    lang: 'general.item_category',
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
    icon: 'mdi-settings-outline',
    path: 'app',
    lang: 'general.application',
    meta: { permission: 'setting' }
  },
  { // Profile
    name: 'Profile',
    icon: 'perm_identity',
    path: 'profile',
    lang: 'general.profile',
    resources: [
      { page: 'form', path: '', meta: { mode: 'edit', permission: 'profile' } }
    ]
  },
  {
    name: 'Authentication',
    icon: 'verified_user',
    menuicon: true,
    path: 'auth',
    lang: 'general.auth',
    children: [
      {
        name: 'Users',
        icon: 'supervisor_account',
        path: 'users',
        lang: 'auth.user',
        resources: [
          { page: 'index', path: '', icon: 'list', meta: { permission: 'users-read' } },
          { page: 'form', path: 'create', meta: { mode: 'create', permission: 'users-create' } },
          { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'users-update' } }
        ]
      },
      {
        name: 'Permissions',
        icon: 'verified_user',
        path: 'permissions',
        lang: 'auth.permission',
        resources: [
          { page: 'index', path: '', icon: 'list', meta: { permission: 'permissions-read' } },
          { page: 'form', path: 'create', meta: { mode: 'create', permission: 'permissions-create' } },
          { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'permissions-update' } }
        ]
      },
      {
        name: 'Roles',
        icon: 'supervised_user_circle',
        path: 'roles',
        lang: 'auth.role',
        resources: [
          { page: 'index', path: '', icon: 'list', meta: { permission: 'roles-read' } },
          { page: 'form', path: 'create', meta: { mode: 'create', permission: 'roles-create' } },
          { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'roles-update' } }
        ]
      }
    ]
  },
  { // Customize
    name: 'Customize',
    icon: 'perm_identity',
    path: 'customize',
    lang: 'general.layout',
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
    icon: 'apps',
    path: 'dashboard'
  },
  { // common
    name: 'Common',
    icon: 'dns',
    path: 'common',
    lang: 'general.common',
    children: common
  },
  // Bussines process
  {
    name: 'Forecasts',
    icon: 'pie_chart',
    path: 'forecasts',
    lang: 'general.forecast',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'forecasts-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'forecasts-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'forecasts-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'forecasts-read' } }
    ]
  },
  {
    name: 'Incoming Good',
    icon: 'move_to_inbox',
    path: 'incoming-goods',
    lang: 'general.incoming_good',
    param: `?status=OPEN`,
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'incoming-goods-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'incoming-goods-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'incoming-goods-update' } },
      { page: 'restoration', path: ':id/restoration', meta: { mode: 'edit', permission: 'incoming-goods-create' } },
      { page: 'validation', path: ':id/validation', meta: { mode: 'edit', permission: 'incoming-goods-validation' } },
      { page: 'revision', path: ':id/revision', meta: { mode: 'edit', permission: 'incoming-goods-validation' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'incoming-goods-read' } }
    ]
  },
  {
    name: 'Outgoing Good',
    icon: 'unarchive',
    path: 'outgoing-goods',
    lang: 'general.outgoing_good',
    param: `?status=OPEN`,
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'outgoing-goods-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'outgoing-goods-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'outgoing-goods-update' } },
      { page: 'restoration', path: ':id/restoration', meta: { mode: 'edit', permission: 'outgoing-goods-create' } },
      { page: 'validation', path: ':id/validation', meta: { mode: 'edit', permission: 'outgoing-goods-validation' } },
      { page: 'revision', path: ':id/revision', meta: { mode: 'edit', permission: 'outgoing-goods-validation' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'outgoing-goods-read' } }
    ]
  },
  {
    name: 'Stock Opname',
    icon: 'assignment_turned_in',
    path: 'opname-stocks',
    lang: 'general.opname_stocks',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'opname-stocks-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'opname-stocks-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'opname-stocks-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'opname-stocks-read' } }
    ]
  },
  {
    name: 'Transfer Stock',
    icon: 'assignment_turned_in',
    path: 'transfer-stocks',
    lang: 'general.transfer_stocks',
    resources: [
      { page: 'index', path: '', icon: 'list', meta: { permission: 'transfer-stocks-read' } },
      { page: 'form', path: 'create', meta: { mode: 'create', permission: 'transfer-stocks-create' } },
      { page: 'form', path: ':id/edit', meta: { mode: 'edit', permission: 'transfer-stocks-update' } },
      { page: 'view', path: ':id', meta: { mode: 'view', permission: 'transfer-stocks-read' } }
    ]
  },
  { // References
    name: 'References',
    icon: 'dashboard',
    path: 'references',
    lang: 'general.preference',
    children: references
  },
  { // References
    name: 'Configuration',
    icon: 'settings',
    path: 'configuration',
    lang: 'general.configuration',
    children: configuration
  }
  // {
  //   name: 'Documentation',
  //   icon: 'chrome_reader_mode',
  //   path: 'log',
  //   lang: 'general.documentation',
  //   file: 'README.md'
  //   // fileType: '.md'
  // }
]
