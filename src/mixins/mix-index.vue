<script>
import GlobalMix from './mix-global.vue'
import MixSheet from '@/mixins/mix-sheet.vue'
import MixPage from '@/mixins/mix-page.vue'
import '@/css/index-page.styl'

export default {
  mixins: [GlobalMix, MixPage, MixSheet],
  data () {
    return {
      INDEX: {
        load: (callbacks) => this.INDEX__load(callbacks)
      },
      TABLE: {
        mode: 'datagrid',
        show: false,
        loading: false,
        resource: {},
        columns: [],
        rowData: [],
        resData: [],
        pagination: {
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 0,
          sortBy: null,
          descending: false,
          default: () => { // default properties :
            return {
              page: 1,
              rowsPerPage: 10,
              rowsNumber: 0,
              sortBy: null,
              descending: false
            }
          }
        },
        filter: '',
        selected: [
          // initial selection => { id: 5 }
        ],
        // init: () => this.__onPagination(),
        compute: (props) => this.TABLE__compute(props),
        delete: (val) => this.TABLE__delete(val),
        refresh: (done) => this.TABLE__refresh(done),
        getTitle: () => this.TABLE__getTitle()
      },
      FILTERABLE: {
        model: [],
        search: [],
        fill: {},
        transform: {},
        params: '',
        // init: () => this.__onFilterable(),
        setCreate: ({val}) => this.FILLABEL__setCreate({val}),
        setRemove: ({index, value}) => this.FILLABEL__setRemove({index, value}),
        submit: () => {
          let apiParamlink = this.TABLE__getParams().join('&')
          this.TABLE.pagination.page = 1
          this.DATAINDEX__route(this.TABLE.resource.uri + `?` + apiParamlink)
          this.DATAINDEX__getData()
        }
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    // console.error('beforeRouteEnter', to.fullPath)
    if (!to.query.hasOwnProperty('return')) {
      to.meta.lastest = {
        query: to.query,
        fullPath: to.fullPath
      }
    }
    next(vm => {
      if (to.query.hasOwnProperty('return') && to.meta.hasOwnProperty('lastest')) {
        vm.$router.replace(to.meta.lastest.fullPath)
        return false
      }
    })
  },
  beforeRouteUpdate (to, from, next) {
    // console.error('beforeRouteUpdate', to.fullPath)
    to.meta.lastest = {
      query: to.query,
      fullPath: to.fullPath
    }
    if (this.TABLE.mode === 'datagrid') {
      next()
    }
    else {
      this.DATAINDEX__getData(next)
    }
  },
  computed: {
    FILLABEL () {
      let value = [], indexes = []

      for (const i in this.FILTERABLE.fill) {
        if (this.FILTERABLE.fill.hasOwnProperty(i)) {
          const fill = this.FILTERABLE.fill[i]
          if (fill.value) break
          if (fill.hasOwnProperty('transform')) {
            let trans = fill.transform(fill.value)
            if (!trans) break
            let count = value.push(trans)
            indexes[count - 1] = i
          }
          else {
            let count = value.push('[' + i + '-' + fill + ']')
            indexes[count - 1] = i
          }
        }
      }

      for (const i in this.FILTERABLE.search) {
        if (this.FILTERABLE.search.hasOwnProperty(i)) {
          const fill = this.FILTERABLE.search[i]
          let count = value.push(fill)
          indexes[count - 1] = null
        }
      }

      return {value: value, indexes: indexes}
    }
  },
  methods: {
    INDEX__load (callbacks = null) {
      const callBase = () => {
        if (this.TABLE.mode === 'datagrid') {
          this.TABLE__init()
          this.DATAGRID__getData(null, callbacks)
        }
        else {
          this.TABLE__init(this.$route)
          this.DATAINDEX__getData(null, callbacks)
        }
      }
      if (typeof callbacks === 'function') {
        this.SHEET.assign()
        this.SHEET.request(
          callBase()
        )
      }
      else {
        console.warn('*[PLAY]* - callback is function required')
      }
    },
    DATAINDEX__compute (props) {
      setTimeout(() => {
        if (props) this.TABLE.pagination = props.pagination

        const apiParamlink = this.TABLE__getParams().join('&')
        this.DATAINDEX__route(this.TABLE.resource.uri + `?` + apiParamlink)
      }, 500)
    },
    DATAINDEX__route (paramUrl) {
      this.$router.push(paramUrl)
    },
    DATAINDEX__getData (refresh = null, callbacks) {
      let pagination = this.TABLE.pagination
      this.TABLE.loading = true
      let apiParamlink = this.TABLE__getParams().join('&')
      
      // console.log('[PLAY] $get = "'+ (this.TABLE.resource.api + `?` + apiParamlink) +'"')
      this.$axios
        .get(this.TABLE.resource.api + `?` + apiParamlink)
        .then(response => {
          this.TABLE.pagination = pagination
          this.TABLE.rowData = response.data.data

          this.TABLE.pagination.page = Number(response.data.current_page)
          this.TABLE.pagination.rowsNumber = Number(response.data.total)
          this.TABLE.pagination.rowsPerPage = Number(response.data.per_page)

          setTimeout(() => {
            if (refresh !== null) setTimeout(() => { refresh() }, 800)
            const call = (f) => {
              if (typeof f === 'function') return f()
              else if (typeof f === 'undefined') return f
            }

            if (typeof callbacks === 'object' && Array.isArray(callbacks)) {
              callbacks.map((f) => {
                if (typeof f === 'function') f()
                console.warn('[PLAY] WARNING - Many (array) of callbacks must call function type!')
              })
            }
            else return call(callbacks)
          }, 500)
        })
        .catch(error => {
          this.$app.response.error(error.response, 'Load Items')
        })
        .finally(() => {
          setTimeout(() => {
            this.TABLE.loading = false
            this.TABLE.show = true
          }, 500)
        })
    },

    // ************** DATAGRID ******************
    DATAGRID__compute (props) {
      this.TABLE.loading = true
      setTimeout(() => {
        this.TABLE.pagination = props.pagination

        let
          table = this.$refs.table,
          rows = [],
          { page, rowsPerPage, sortBy, descending } = props.pagination

        // res -> MAP -> map -> row

        if (this.TABLE.resData && this.TABLE.resData.length > 0) rows = this.TABLE.resData.slice()

        if (props.filter) {
          rows = table.filterMethod(rows, props.filter)
        }

        // console.warn(table, page, rowsPerPage, sortBy, descending)
        if (table && sortBy) {
          rows = table.sortMethod(rows, sortBy, descending)
        }

        this.TABLE.pagination.rowsNumber = rows.length

        if (rowsPerPage) {
          rows = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage)
        }

        this.TABLE.rowData = rows

        setTimeout(() => {
          const params = this.TABLE__getParams()
          const paramUrl = (params.length > 0) ? params.join('&') : ''
          // this.DATAGRID__route(paramUrl)

          this.TABLE.loading = false
        }, 400)
      }, 200)
    },
    DATAGRID__route (paramUrl) {
      this.$router.push(this.TABLE.resource.uri + `?` + paramUrl)
    },
    DATAGRID__setData (data) {
      return JSON.parse(JSON.stringify(data))
    },
    DATAGRID__getData (refresh = null, callbacks) {
      this.$axios
        .get(this.TABLE.resource.api + '?mode=datagrid')
        .then(response => {
          // this.TABLE.resData = response.data;
          this.TABLE.resData = this.DATAGRID__setData(response.data)

          this.TABLE.compute({
            pagination: this.TABLE.pagination,
            filter: this.TABLE.filter
          })

          if (refresh !== null) setTimeout(() => { refresh() }, 800)

          const call = (f) => {
            if (typeof f === 'function') return f()
            else if (typeof f === 'undefined') return f
          }

          if (typeof callbacks === 'function') call(callbacks)
        })
        .catch(error => {
          this.$app.response.error(error.response, 'Load Items')
        })
    },

    // ************** TABLE ********************
    TABLE__init (to) {
      if (!to) to = this.$route
      // console.error('TABLE__init', to.meta.lastest)
      const params = (to.query.hasOwnProperty('return') && to.meta.hasOwnProperty('lastest'))
        ? to.meta.lastest.query
        : to.query

      if (params.hasOwnProperty('limit')) this.TABLE.pagination.rowsPerPage = Number(params.limit)
      if (params.hasOwnProperty('page')) this.TABLE.pagination.page = Number(params.page)
      if (params.hasOwnProperty('sort')) this.TABLE.pagination.sortBy = params.sort
      if (params.hasOwnProperty('descending')) this.TABLE.pagination.descending = true

      if (this.TABLE.mode === 'datagrid') {
        if (params.hasOwnProperty('search')) this.TABLE.filter = params.search
      }
      else {
        for (const key in params) {
          if (params.hasOwnProperty(key)) {
            if (key === 'search') this.FILTERABLE.search = params[key].split('|')
            else if (this.FILTERABLE.fill.hasOwnProperty(key)) {
              let type = this.FILTERABLE.fill[key].type || ''
              switch (type) {
                case 'integer':
                  this.FILTERABLE.fill[key].value = Number(params[key])
                  break

                default:
                  this.FILTERABLE.fill[key].value = params[key]
                  break
              }
            }
          }
        }
      }
    },
    TABLE__refresh (done = null) {
      if (this.TABLE.mode === 'datagrid') {
        this.DATAGRID__getData(done)
      }
      else {
        this.DATAINDEX__getData(done)
      }
    },
    TABLE__compute (prop) {
      if (this.TABLE.mode === 'datagrid') {
        this.DATAGRID__compute(prop)
      }
      else {
        this.DATAINDEX__compute(prop)
      }
    },
    TABLE__delete (row) {
      this.$q.dialog({
        title: 'Delete Confirm',
        message: 'Are you sure to delete the record ?',
        preventClose: true,
        ok: 'Yes, please!',
        cancel: 'Cancel'
      })
        .then(() => {
          this.$axios.delete(`${this.TABLE.resource.api}/${row.id}`)
            .then((response) => {
            // console.warn(response)
              if (response.data.success) {
                this.TABLE__rowDelete(row.id)
                let txtMessage = 'The record has been deleted!'
                this.$q.notify({message: txtMessage, color: 'positive', icon: 'check', position: 'top-right', timeout: 3000})
              }
            })
            .catch(error => {
              this.$app.response.error(error.response, 'Delete')
            })
        })
        .catch(() => {})
    },
    TABLE__rowDelete (id) {
      this.TABLE.resData = this.TABLE.resData.filter((item) => {
        if (item.id === id) return
        return item
      })
      this.TABLE.compute({
        pagination: this.TABLE.pagination,
        filter: this.TABLE.filter
      })
    },
    TABLE__getTitle () {
      const head = this.TABLE.mode !== 'datagrid' ? 'LIST' : 'GRID'
      return (head + ' - ' + (this.$route.meta.title || 'Data')).toUpperCase()
    },
    TABLE__getParams () {
      let params = []
      const pagination = this.TABLE.pagination
      if (pagination.page > 1) params.push(`page=${pagination.page}`)
      if (pagination.rowsPerPage) params.push(`limit=${pagination.rowsPerPage}`)
      if (pagination.sortBy) params.push(`sort=${pagination.sortBy}`)
      if (pagination.descending) params.push(`descending`)

      if (this.TABLE.mode === 'datagrid') {
        if (this.TABLE.filter) params.push(`search=${this.TABLE.filter}`)
      }
      else {
        params = params.concat(this.FILTERABLE_getParams())
      }

      return params
    },
    FILTERABLE_getParams () {
      let params = []
      for (const i in this.FILTERABLE.fill) {
        if (this.FILTERABLE.fill.hasOwnProperty(i)) {
          const fill = this.FILTERABLE.fill[i]
          if (!fill.value) continue
          params.push(i + '=' + fill.value)
        }
      }
      let search = ''
      for (const i in this.FILTERABLE.search) {
        if (this.FILTERABLE.search.hasOwnProperty(i)) {
          const fill = this.FILTERABLE.search[i]
          search = search === '' ? (fill) : (search + '|' + fill)
        }
      }
      if (search) params.push('search=' + search)
      return params
    },
    FILLABEL__setChange (values) {
      // console.log(values)
    },
    FILLABEL__setCreate ({val}) {
      this.FILTERABLE.search.push(val)
    },
    FILLABEL__setRemove ({index, value}) {
      if (this.FILLABEL.indexes[index]) {
        let field = this.FILLABEL.indexes[index]
        if (this.FILTERABLE[field].hasOwnProperty('transform')) {
          this.FILTERABLE.fill[field] = this.FILTERABLE[field].transform(value)
        }
        else this.FILTERABLE.fill[field] = null
      }
      else {
        this.FILTERABLE.search = this.FILTERABLE.search.filter((s) => s !== value[0])
      }
      return false
    }
  }
}
</script>
