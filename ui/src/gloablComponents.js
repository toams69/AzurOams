import fgInput from './components/Inputs/formGroupInput.vue'
import DropDown from './components/Dropdown.vue'
import Checkbox from './components/Inputs/Checkbox.vue'
import Radio from './components/Inputs/Radio.vue'
/**
 * You can register global components here and use them as a plugin in your main Vue instance
 * Ideally, only small components that are re-used many times across your application should be registered here.
 * For plugins and bigger components local registration is preferable because it will allow you to do code splitting easier :)
 */
const GlobalComponents = {
  install (Vue) {
    Vue.component(fgInput.name, fgInput)
    Vue.component(DropDown.name, DropDown)
    Vue.component(Checkbox.name, Checkbox)
    Vue.component(Radio.name, Radio)
  }
}

export default GlobalComponents
