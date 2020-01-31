import Cookies from 'js-cookie'
import axios from 'axios'

// state
const state = {
	status: '',
	userToken: Cookies.get('userToken') || '',
	userProfile: {},
};

// getters
export const getters = {
	status: state => !!state.userToken,
	userProfile: state => state.userProfile,
	user: state => state.userProfile,
};

// mutations
export const mutations = {
	login_request(state) {
		state.status = 'loading';
	},
	login_success(state, data) {
		state.status = 'success';
		state.userToken = data.token;
		state.userExpiredAt = data.expiredAt;
		state.userProfile = data.userProfile;
	},
	login_error(state) {
		state.status = 'error';
	},
	logout(state) {
		state.status = '';
		state.userToken = '';
	},
};

// actions
export const actions = {
	login({ commit }, user) {
		return new Promise((resolve, reject) => {
			commit('login_request');
			axios.post(`${process.env.MQDC_APP_BASE_URI}/login`, user)
				.then((response) => {
					const data = response.data.data;
					Cookies.set('userToken', data.token);
					Cookies.set('userTokenTimestamp', data.expiredAt.timestamp);
					Cookies.set('userEmail', data.userProfile.email);
					axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
					commit('login_success', data);
					resolve(response);
				})
				.catch((error) => {
					commit('login_error');
					Cookies.remove('userToken');
					reject(error);
				});
		});
	},
	logout({ commit }) {
		return new Promise((resolve) => {
			commit('logout');
			Cookies.remove('userToken');
			Cookies.remove('userEmail');
			Cookies.remove('userTokenTimestamp');
			delete axios.defaults.headers.common.Authorization;
			resolve();
		});
	},
};
