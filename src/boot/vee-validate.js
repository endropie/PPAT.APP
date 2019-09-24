import VeeValidate from 'vee-validate'

VeeValidate.Validator.extend('eq', (value, [paramValue]) => {
  return value === paramValue
}, { hasTarget: true, computesRequired: true })

VeeValidate.Validator.extend('phone', (value) => {
  // eslint-disable-next-line camelcase
  let phone_regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\\./0-9]*$/g
  return phone_regex.test(value)
}, { hasTarget: true, computesRequired: true })

VeeValidate.Validator.extend('lt_value', (value, [paramValue]) => {
  return Number(value) < Number(paramValue)
}, { hasTarget: true, computesRequired: true })

VeeValidate.Validator.extend('gt_value', (value, [paramValue]) => {
  return Number(value) > Number(paramValue)
}, { hasTarget: true, computesRequired: true })

VeeValidate.Validator.localize('id')

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.use(VeeValidate)

  Vue.directive('validate-name', {
    bind: (el, binding, vnode) => {
      console.warn(vnode)
      const ref = vnode.data.ref
      const component = vnode.context.$refs[ref]
      console.warn('input', component)
      let errors = vnode.context.errors
      vnode.componentInstance.$emit('error', errors.has('name'))
      // component.error = errors.has('name')
      // component.errorMessage = errors.first('name')
      // vnode.componentInstance.innerError = errors.has('name')
      // vnode.componentInstance.innerErrorMessage = errors.first('name')
      // componentInstance
    },
    update: (el, binding, vnode) => {
      // let errors = vnode.context.errors
      // vnode.componentInstance.error = errors.has('name')
      // vnode.componentInstance.innerError = errors.has('name')
      // vnode.componentInstance.innerErrorMessage = errors.first('name')
      // vnode.componentInstance.errorMessage = errors.first('name')
      // console.warn('SET', vnode.componentOptions.propsData.error)
      // console.warn('ERROR', errors.has('name'), errors.first('name'))
    }
  })
}
