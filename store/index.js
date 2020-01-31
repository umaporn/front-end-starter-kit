import Cookies from 'js-cookie'
import { cookieFromRequest } from '~/utils'

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    console.log(`nuxtServerInit`)
    const token = cookieFromRequest(req, 'token')

    if (token) {
      commit('auth/SET_TOKEN', token)
    }
    const locale = cookieFromRequest(req, 'locale')
    if (locale) {
      commit('lang/SET_LOCALE', { locale })
    }
  },
  nuxtClientInit({ commit, dispatch }) {
  
    dispatch('authentication/authentication')
    
    const locale = Cookies.get('locale')
    if (locale) {
      commit('lang/SET_LOCALE', { locale })
    }
  }
}
