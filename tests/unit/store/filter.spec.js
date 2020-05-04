import store from "@/store/modules/filter";
import { keyBy, cloneDeep } from "lodash";

const { mutations, getters, state } = store;
const filters = [{ _id: 1, name: "A" }, { _id: 2, name: "B" }, { _id: 3, name: "C" }, { _id: 4, name: "D" }];
let stateMock;

beforeEach(() => {
  stateMock = cloneDeep(state);
});

describe("SET_FILTERS mutation", () => {
  it("should put the filters correctly in the store", () => {
    const expected = keyBy(filters, "_id");

    mutations.SET_FILTERS(stateMock, filters);
    expect(stateMock.filters instanceof Object).toBeTruthy();
    expect(stateMock.filters).toStrictEqual(expected);
  });
});

describe("getFilterList getter", () => {
  it("should correctly return the filters when the store has entries", () => {
    mutations.SET_FILTERS(stateMock, filters);
    const FilterList = getters.getFilterList(stateMock);

    expect(Array.isArray(FilterList)).toBeTruthy();
    expect(FilterList).toHaveLength(filters.length);
    expect(FilterList).toStrictEqual(filters);
  });

  it("should correct return an empty list when no filters in store", () => {
    const FilterList = getters.getFilterList(stateMock);

    expect(Array.isArray(FilterList)).toBeTruthy();
    expect(FilterList).toStrictEqual([]);
  });
});
