const PageScrollDirective = {
  mounted (el, binding) {
    el.__PageScrollDirectiveHandler__ = () => {
      if (binding.instance.showMobileNavMenu) {
        binding.value()
      }
    }
    document.addEventListener('scroll', el.__PageScrollDirectiveHandler__, {
      passive: true
    })
  },
  unmounted (el) {
    document.removeEventListener('scroll', el.__PageScrollDirectiveHandler__)
  }
}

export default (app) => {
  app.directive('page-scroll', PageScrollDirective)
}
