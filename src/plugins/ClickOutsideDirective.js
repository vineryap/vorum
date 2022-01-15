const ClickOutsideDirective = {
  mounted (el, binding) {
    el.__ClickOutsideDirective__ = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.body.addEventListener('click', el.__ClickOutsideDirective__)
  },
  unmounted (el) {
    document.body.removeEventListener('click', el.__ClickOutsideDirective__)
  }
}

export default (app) => {
  app.directive('click-outside', ClickOutsideDirective)
}
