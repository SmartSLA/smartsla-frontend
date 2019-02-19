import Axios from "axios";
import store from "@/store";

// Import your API functions here
import functions from "./tickets-api";

const defaults = {
  baseURL: store.state.applicationConfiguration.baseUrl
};

function Api(config) {
  const instance = Axios.create(Object.assign({}, defaults, config));
  // Assign them to your Axios instance here
  Object.assign(instance, functions);
  return instance;
}

export { Api };
export default new Api();
