import Cookies from 'js-cookie'
import axios from 'axios'

// state
export const state = () => ({
  status: '',
  clientToken: Cookies.get('clientToken') || '',
  user: {},
})

// getters
export const getters = {
  status: state => !!state.clientToken,
}

// mutations
export const mutations = {
  auth_request(state) {
    state.status = 'loading';
  },
  auth_success(state, data) {
    state.status = 'success';
    state.clientToken = data.token;
    state.expiredAt = data.expiredAt;
  },
  auth_error(state) {
    state.status = 'error';
  },
  logout(state) {
    state.status = '';
    state.clientToken = '';
  },
}

// actions
export const actions = {
  authentication({ commit }) {
    return new Promise((resolve, reject) => {
      commit('auth_request');
      axios.post(`${process.env.MQDC_APP_BASE_URI}/client/authenticate`, {
				username: process.env.MQDC_APP_API_USERNAME,
				password: process.env.MQDC_APP_API_PASSWORD,
			})
				.then((response) => {
          const data = response.data;
					Cookies.set('clientToken', data.token);
					Cookies.set('clientTokenTimestamp', data.expiredAt.timestamp);
					axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
					resolve(response);
				})
				.catch((error) => {
					Cookies.remove('clientToken');
					reject(error);
				});
    });
  },
}
