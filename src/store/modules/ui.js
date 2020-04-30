import Vue from "vue";

const DRAWER_LOCALSTORAGE_KEY = "drawer";
const DEFAULT_DRAWER = {
  // sets the open status of the drawer
  open: true,
  // sets if the drawer is shown above (false) or below (true) the toolbar
  clipped: true,
  // sets if the drawer is CSS positioned as 'fixed'
  fixed: false,
  // sets if the drawer remains visible all the time (true) or not (false)
  permanent: false,
  // sets the drawer to the mini variant, showing only icons, of itself (true)
  // or showing the full drawer (false)
  mini: true
};
const DEFAULT_TOOLBAR = {
  fixed: true,
  // sets if the toolbar contents is leaving space for drawer (false) or not (true)
  clippedLeft: true
};

function initialState() {
  const localStorageDrawer = {};
  return {
    snackbar: {
      color: "red",
      message: null,
      timeout: 5000
    },
    drawer: localStorageDrawer.drawer || DEFAULT_DRAWER,
    toolbar: localStorageDrawer.toolbar || DEFAULT_TOOLBAR
  };
}

const types = {
  SHOW_SNACKBAR: "SHOW_SNACKBAR",
  SHOW_DRAWER: "SHOW_DRAWER",
  TOGGLE_MINI_DRAWER: "TOGGLE_MINI_DRAWER",
  TOGGLE_DRAWER: "TOGGLE_DRAWER"
};

const actions = {
  displaySnackbar({ commit }, snackbar) {
    commit(types.SHOW_SNACKBAR, snackbar);
  },
  toggleMiniDrawer({ commit }) {
    commit(types.TOGGLE_MINI_DRAWER);
  },
  toggleDrawer({ commit }) {
    commit(types.TOGGLE_DRAWER);
  },
  showDrawer({ commit }, value) {
    commit(types.SHOW_DRAWER, value);
  }
};

const mutations = {
  [types.TOGGLE_MINI_DRAWER](state) {
    // toggles the drawer variant (mini/full)
    state.drawer.mini = !state.drawer.mini;
    localStorage.setItem(DRAWER_LOCALSTORAGE_KEY, JSON.stringify({ drawer: state.drawer, toolbar: state.toolbar }));
  },
  [types.TOGGLE_DRAWER](state) {
    // toggles the temporary drawer(shows/hides)
    state.drawer.mini = false;
    state.drawer.open = !state.drawer.open;
    localStorage.setItem(DRAWER_LOCALSTORAGE_KEY, JSON.stringify({ drawer: state.drawer, toolbar: state.toolbar }));
  },
  [types.SHOW_DRAWER](state, value) {
    state.drawer.open = value;
    localStorage.setItem(DRAWER_LOCALSTORAGE_KEY, JSON.stringify({ drawer: state.drawer, toolbar: state.toolbar }));
  },
  [types.SHOW_SNACKBAR](state, snackbar) {
    snackbar.show = true;
    Vue.set(state, "snackbar", snackbar);
  }
};

const getters = {};

export default {
  namespaced: true,
  state: initialState(),
  getters,
  actions,
  mutations
};
