import VeeValidate from 'vee-validate'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.use(VeeValidate)

  Vue.directive('validate-label', {
    error:true,
    bind: (el, binding, vnode) => {
      console.warn(vnode)

      // let s = JSON.stringify(el)

      let errors = vnode.componentInstance.errors
      console.warn('label')

      
      // vnode.componentInstance.error = errors.has('code')
      // vnode.componentInstance.$vnode.errorMessage = 'lalal'
      // vnode.componentInstance.$emit('error', errors.has('code'))
      // vnode.componentInstance.$emit('errorMessage', errors.first('code'))


      // vnode.componentInstance.errorMessage = errors.first('code')
      // componentInstance
      
    }
  })
}
