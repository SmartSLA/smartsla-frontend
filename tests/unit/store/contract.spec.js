import store from "@/store/modules/contract";
import { cloneDeep } from "lodash";

const { state, mutations, getters } = store;
const tickets = [
  { _id: 1, name: "ticket1" },
  { _id: 2, name: "ticket2" },
  { _id: 3, name: "ticket3" },
  { _id: 4, name: "ticket4" }
];
const contractId = "1";
let stateMock;

beforeEach(() => {
  stateMock = cloneDeep(state);
});

describe("SET_CONTRACT_TICKETS mutation", () => {
  it("should properly set the tickets associated to contract", () => {
    mutations.SET_CONTRACT_TICKETS(stateMock, {
      contractId,
      tickets
    });

    expect(stateMock.contractTickets).toBeDefined();
    expect(stateMock.contractTickets[contractId]).toBeDefined();
    expect(Array.isArray(stateMock.contractTickets[contractId])).toBeTruthy();
    expect(stateMock.contractTickets[contractId]).toStrictEqual(tickets);
  });
});

describe("getContractTickets getter", () => {
  it("should correctly return the tickets of given contract", () => {
    mutations.SET_CONTRACT_TICKETS(stateMock, {
      contractId,
      tickets
    });

    const result = getters.getContractTickets(stateMock)(contractId);
    expect(result).toBeDefined();
    expect(result).toStrictEqual(tickets);
  });

  it("should return an empty array if contract doesn't exist in store", () => {
    const result = getters.getContractTickets(stateMock)(contractId);
    expect(result).toBeDefined();
    expect(result).toStrictEqual([]);
  });
});
