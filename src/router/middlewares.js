import store from '@/store'
import { returnToHome } from '@/router/helpers'

const authCheck = (query = null) => {
  if (!store.state.auth.authId) {
    console.log('🚏 redirecting to Login page')
    return { name: 'Login', query }
  }
}

const logout = async () => {
  await store.dispatch('auth/signOut')
  return { name: 'Home' }
}

export { authCheck, logout }
