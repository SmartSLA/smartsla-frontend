import store from "@/store/modules/client";
import { cloneDeep, keyBy } from "lodash";

const { state, mutations, getters } = store;
const clients = [
  { _id: 1, name: "client1", active: false },
  { _id: 2, name: "client2", active: true },
  { _id: 3, name: "client3", active: false },
  { _id: 4, name: "client4", active: true }
];
let stateMock;

beforeEach(() => {
  stateMock = cloneDeep(state);
});

describe("SET_CLIENTS mutation", () => {
  it("should put the clients correctly in the store", () => {
    const expected = keyBy(clients, "_id");

    mutations.SET_CLIENTS(stateMock, clients);
    expect(stateMock.clients instanceof Object).toBeTruthy();
    expect(stateMock.clients).toStrictEqual(expected);
  });
});

describe("SET_CLIENT mutation", () => {
  it("should update the client correctly in store", () => {
    const _id = 1;
    const name = "updated client 1";
    const client = { _id, name };

    mutations.SET_CLIENT(stateMock, client);
    expect(stateMock.clients[_id]).toBeDefined();
    expect(stateMock.clients[_id]).toStrictEqual(client);
    expect(stateMock.clients[_id].name).toEqual(name);
  });

  it("should set the client in store if it doesn't exist", () => {
    const newClient = { _id: 99, name: "client 99" };

    mutations.SET_CLIENT(stateMock, newClient);
    expect(stateMock.clients[99]).toBeDefined();
    expect(stateMock.clients[98]).toBeUndefined();
    expect(stateMock.clients[99] instanceof Object).toBeTruthy();
    expect(stateMock.clients[99]).toStrictEqual(newClient);
  });
});

describe("SET_LENGTH mutation", () => {
  it("should set the length correctly", () => {
    const length = 7;

    mutations.SET_LENGTH(stateMock, length);
    expect(stateMock.length).toBeDefined();
    expect(typeof stateMock.length === "number").toBeTruthy();
    expect(stateMock.length).toStrictEqual(length);
  });
});

describe("REMOVE_CLIENT mutation", () => {
  it("should correctly remove the client from the store", () => {
    const id = 1;

    mutations.SET_CLIENTS(stateMock, clients);
    mutations.REMOVE_CLIENT(stateMock, id);
    expect(stateMock.clients[id]).toBeUndefined();
  });
});

describe("getClients getter", () => {
  it("should correctly return the clients list when the store has clients", () => {
    mutations.SET_CLIENTS(stateMock, clients);
    mutations.SET_LENGTH(stateMock, clients.length);
    const clientsList = getters.getClients(stateMock);

    expect(Array.isArray(clients)).toBeTruthy();
    expect(clientsList).toHaveLength(clients.length);
    expect(clientsList).toStrictEqual(clients);
  });

  it("should correct return an empty list when no clients in store", () => {
    const clientsList = getters.getClients(stateMock);

    expect(Array.isArray(clientsList)).toBeTruthy();
    expect(clientsList).toStrictEqual([]);
  });
});

describe("getClientById getter", () => {
  it("should return the requested client correctly", () => {
    mutations.SET_CLIENTS(stateMock, clients);
    const client = getters.getClientById(stateMock)(1);
    const expected = { _id: 1, name: "client1", active: false };

    expect(client).toBeDefined();
    expect(client instanceof Object).toBeTruthy();
    expect(client).toStrictEqual(expected);
  });
});

describe("getClientsCount getter", () => {
  it("should return the correct clients count", () => {
    mutations.SET_CLIENTS(stateMock, clients);
    mutations.SET_LENGTH(stateMock, clients.length);
    const length = getters.getClientsCount(stateMock);
    const expected = clients.length;

    expect(typeof length === "number").toBeTruthy();
    expect(length).toStrictEqual(expected);
  });
});

describe("getActiveClients getter", () => {
  it("should return an empty array when no clients in store", () => {
    const activeClients = getters.getActiveClients(stateMock);

    expect(Array.isArray(activeClients)).toBeTruthy();
    expect(activeClients).toStrictEqual([]);
  });

  it("should return only active clients", () => {
    mutations.SET_CLIENTS(stateMock, clients);
    const result = getters.getActiveClients(stateMock);
    const expected = clients.filter(client => client.active);

    expect(Array.isArray(result)).toBeTruthy();
    expect(result).toHaveLength(expected.length);
    expect(result).toStrictEqual(expected);
    expect(result.find(c => !c.active)).toBeUndefined();
  });
});
