import store from "@/store/modules/ticket";
import { cloneDeep } from "lodash";

const tickets = [
  { _id: 1, title: "ticket1" },
  { _id: 2, title: "ticket2" },
  { _id: 3, title: "ticket3" },
  { _id: 4, title: "ticket4" },
  { _id: 5, title: "ticket5" }
];

const { mutations, state, getters } = store;
let stateMock;

beforeEach(() => {
  stateMock = cloneDeep(state);
});

describe("SET_FILTER mutation", () => {
  it("should put the filter name correctly in the store", () => {
    const expected = "closed";

    mutations.SET_FILTER(stateMock, expected);
    expect(stateMock.filter instanceof String).toBeTruthy();
    expect(stateMock.filter).toStrictEqual(expected);
  });
});

describe("RESET_FILTER mutation", () => {
  it("should empty the tickets list in the store", () => {
    mutations.SET_TICKETS(stateMock, tickets);
    expect(stateMock.tickets).not.toStrictEqual({});
    mutations.RESET_TICKETS(stateMock);
    expect(stateMock.tickets).toStrictEqual({});
  });
});

describe("the filter getter", () => {
  it("should return the current filter in the store", () => {
    mutations.SET_FILTER(stateMock, "closed");
    const currentFilter = getters.filter(state);

    expect(currentFilter).toBeDefined();
    expect(currentFilter).toStrictEqual("closed");
  });

  it("should return null when no filter is stored", () => {
    const currentFilter = getters.filter(state);
    expect(currentFilter).toBeUndefined();
  });
});
