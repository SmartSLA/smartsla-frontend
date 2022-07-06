import Vue from "vue";

const DRAWER_LOCALSTORAGE_KEY = "drawer";
const LEFT_DRAWER = {
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

const isMobile = () => {
  switch (Vue.prototype.$vuetify.breakpoint.name) {
    case "xs":
      return true;
    case "sm":
    case "md":
    case "lg":
    case "xl":
      return false;
  }
};

const MOBILE_BREAKPOINT_WIDTH = 768;

const isMobileBreakpoint = () => Vue.prototype.$vuetify.breakpoint.width <= MOBILE_BREAKPOINT_WIDTH;

const RIGHT_DRAWER = {
  open: true,
  clipped: true,
  fixed: false,
  permanent: false,
  mini: false
};

const DEFAULT_TOOLBAR = {
  fixed: true,
  // sets if the toolbar contents is leaving space for drawer (false) or not (true)
  clippedLeft: true,
  clippedRight: true
};

const localStorageLeftDrawer = JSON.parse(localStorage.getItem(`${DRAWER_LOCALSTORAGE_KEY}_drawerLeft`)) || {};
const localStorageRightDrawer = JSON.parse(localStorage.getItem(`${DRAWER_LOCALSTORAGE_KEY}_drawerRight`)) || {};

function initialState() {
  if (localStorageLeftDrawer.drawer && window.innerWidth >= MOBILE_BREAKPOINT_WIDTH) {
    localStorageLeftDrawer.drawer.open = true;
  }

  return {
    snackbar: {
      color: "red",
      message: null,
      timeout: 5000
    },
    drawerLeft: localStorageLeftDrawer.drawer || LEFT_DRAWER,
    drawerRight: localStorageRightDrawer.drawer || RIGHT_DRAWER,
    toolbar: DEFAULT_TOOLBAR
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
  toggleMiniDrawer({ commit }, drawer) {
    commit(types.TOGGLE_MINI_DRAWER, drawer);
  },
  toggleDrawer({ commit }, drawer) {
    commit(types.TOGGLE_DRAWER, drawer);
  },
  showDrawer({ commit }, { drawer, value }) {
    commit(types.SHOW_DRAWER, { drawer, value });
  }
};

const mutations = {
  [types.TOGGLE_MINI_DRAWER](state, drawer) {
    // toggles the drawer variant (mini/full)
    state[drawer].mini = !state[drawer].mini;
    localStorage.setItem(`${DRAWER_LOCALSTORAGE_KEY}_${drawer}`, JSON.stringify({ drawer: state[drawer] }));
  },
  [types.TOGGLE_DRAWER](state, drawer) {
    // toggles the temporary drawer(shows/hides)
    if (drawer === "drawerLeft" && isMobileBreakpoint()) {
      state[drawer].mini = false;
    }

    state[drawer].open = !state[drawer].open;
    localStorage.setItem(`${DRAWER_LOCALSTORAGE_KEY}_${drawer}`, JSON.stringify({ drawer: state[drawer] }));
  },
  [types.SHOW_DRAWER](state, { drawer, value }) {
    // toggles the temporary mini drawer
    if (drawer === "drawerLeft" && !isMobileBreakpoint()) {
      state[drawer].mini = localStorageLeftDrawer.drawer.mini;
    }

    state[drawer].open = value;
    localStorage.setItem(`${DRAWER_LOCALSTORAGE_KEY}_${drawer}`, JSON.stringify({ drawer: state[drawer] }));
  },
  [types.SHOW_SNACKBAR](state, snackbar) {
    snackbar.show = true;
    Vue.set(state, "snackbar", snackbar);
  }
};

const getters = {
  drawerRightMini: state => (isMobile() ? false : state.drawerRight.mini)
};

export default {
  namespaced: true,
  state: initialState(),
  getters,
  actions,
  mutations
};
