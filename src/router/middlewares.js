import store from '@/store'

const authCheck = (query = null) => {
  if (!store.state.auth.authId) {
    return { name: 'LoginPage', query }
  }
}

const logout = async () => {
  await store.dispatch('auth/signOut')
  return { name: 'Home' }
}

export { authCheck, logout }
