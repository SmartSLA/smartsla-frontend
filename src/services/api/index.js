import Axios from "axios";
import store from "@/store";

// Import your API functions here
import ticketsFunctions from "./tickets-api";
import contributionFunctions from "./contributions-api";
import contractsFunctions from "./contracts-api";
import softwareFunctions from "./software-api";
import clientFunctions from "./client-api";

const defaults = {
  baseURL: store.state.applicationConfiguration.baseUrl
};

function Api(config) {
  const instance = Axios.create(Object.assign({}, defaults, config));
  // Assign them to your Axios instance here
  Object.assign(instance, ticketsFunctions);
  Object.assign(instance, contributionFunctions);
  Object.assign(instance, contractsFunctions);
  Object.assign(instance, softwareFunctions);
  Object.assign(instance, clientFunctions);
  return instance;
}

export { Api };
export default new Api();
