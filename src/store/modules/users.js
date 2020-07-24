import Vue from "vue";
import { formatAsTicketUser } from "@/services/helpers/user";

function initialState() {
  return {
    users: {},
    length: 0
  };
}

const types = {
  SET_USERS: "SET_USERS",
  UPDATE_USER: "UPDATE_USER",
  SET_LENGTH: "SET_LENGTH",
  REMOVE_USER: "REMOVE_USER"
};

const actions = {
  fetchUsers: ({ commit }) => {
    return Vue.axios.listUsers().then(({ data }) => {
      commit(types.SET_USERS, data);
      commit(types.SET_LENGTH, data.length);
    });
  },

  fetchUserById: ({ commit }, userId) => {
    return Vue.axios.getUserById(userId).then(({ data }) => commit(types.UPDATE_USER, data));
  },

  createUser: ({ dispatch }, user) => {
    return Vue.axios.createUser(user).then(({ data }) => dispatch("fetchUserById", data._id));
  },

  updateUser: ({ dispatch }, { userId, user }) => {
    return Vue.axios.updateUser(userId, user).then(() => dispatch("fetchUserById", user.user));
  },

  deleteUser: ({ commit }, userId) => {
    return Vue.axios.deleteUser(userId).then(() => commit(types.REMOVE_USER, userId));
  }
};

const mutations = {
  [types.SET_USERS](state, users) {
    (users || []).map(user => Vue.set(state.users, user.user._id, user));
  },

  [types.UPDATE_USER](state, user) {
    Vue.set(state.users, user.user, user);
  },

  [types.REMOVE_USER](state, userId) {
    Vue.delete(state.users, userId);
  },

  [types.SET_LENGTH](state, length) {
    state.length = length;
  }
};

const getters = {
  getUsers: state => Object.values(state.users) || [],
  getUsersAsTicketUsers: state => (Object.values(state.users) || []).map(formatAsTicketUser),
  getUsersByType: state => type => Object.values(state.users || []).filter(user => user.type === type),
  getUserById: state => id => state.users[id] || {},
  getUsersCount: state => Number(state.length) || 0
};

export default {
  namespaced: true,
  state: initialState(),
  actions,
  mutations,
  getters
};
