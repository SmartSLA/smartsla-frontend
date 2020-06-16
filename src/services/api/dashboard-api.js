import { buildQueryParam } from "@/services/helpers/dashboard";

export default {
  getData(filterParams) {
    const params = buildQueryParam(filterParams);
    return this.get(`/ticketing/api/dashboard`, { params });
  }
};
