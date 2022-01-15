import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPencilAlt,
  faHome,
  faAngleRight,
  faCamera
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faPencilAlt, faHome, faAngleRight, faCamera)

export default (app) => {
  app.component('fa-icon', FontAwesomeIcon)
}
