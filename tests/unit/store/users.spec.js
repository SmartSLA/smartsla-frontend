import store from "@/store/modules/users";
import { cloneDeep, keyBy } from "lodash";

const { mutations, getters, state } = store;
const users = [
  { _id: 11, name: "user1", type: "expert", user: { _id: "1" } },
  { _id: 22, name: "user2", type: "expert", user: { _id: "2" } },
  { _id: 33, name: "user3", type: "beneficiary", user: { _id: "3" } },
  { _id: 44, name: "user3", type: "expert", user: { _id: "4" } },
  { _id: 55, name: "user4", type: "beneficiary", user: { _id: "5" } }
];
let stateMock;

beforeEach(() => {
  stateMock = cloneDeep(state);
});

describe("SET_USERS mutation", () => {
  it("should put the users correctly in the store", () => {
    const expected = keyBy(users, "user._id");

    mutations.SET_USERS(stateMock, users);
    expect(stateMock.users instanceof Object).toBeTruthy();
    expect(stateMock.users).toStrictEqual(expected);
  });
});

describe("UPDATE_USER mutation", () => {
  it("should update the user correctly in store", () => {
    const _id = 1;
    const name = "updated user 1";
    const user = { _id, name, type: "expert", user: "1" };

    mutations.UPDATE_USER(stateMock, user);
    expect(stateMock.users[_id]).toBeDefined();
    expect(stateMock.users[_id]).toStrictEqual(user);
    expect(stateMock.users[_id].name).toEqual(name);
  });

  it("should set the user in store if it doesn't exist", () => {
    const newUser = { _id: 999, name: "user 99", type: "expert", user: "99" };

    mutations.UPDATE_USER(stateMock, newUser);
    expect(stateMock.users[99]).toBeDefined();
    expect(stateMock.users[98]).toBeUndefined();
    expect(stateMock.users[99] instanceof Object).toBeTruthy();
    expect(stateMock.users[99]).toStrictEqual(newUser);
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

describe("REMOVE_USER mutation", () => {
  it("should correctly remove the user from the store", () => {
    const id = 1;

    mutations.SET_USERS(stateMock, users);
    mutations.REMOVE_USER(stateMock, id);
    expect(stateMock.users[id]).toBeUndefined();
  });
});

describe("getUsers getter", () => {
  it("should correctly return the users list when the store has users", () => {
    mutations.SET_USERS(stateMock, users);
    mutations.SET_LENGTH(stateMock, users.length);
    const usersList = getters.getUsers(stateMock);

    expect(Array.isArray(users)).toBeTruthy();
    expect(usersList).toHaveLength(users.length);
    expect(usersList).toStrictEqual(users);
  });

  it("should correct return an empty list when no users in store", () => {
    const usersList = getters.getUsers(stateMock);

    expect(Array.isArray(usersList)).toBeTruthy();
    expect(usersList).toStrictEqual([]);
  });
});

describe("getUsersByType getter", () => {
  it("should correctly return the correct users for the requested type", () => {
    mutations.SET_USERS(stateMock, users);
    const expertUsers = getters.getUsersByType(stateMock)("expert");
    const expected = users.filter(user => user.type === "expert");

    expect(Array.isArray(expertUsers)).toBeTruthy();
    expect(expertUsers).toStrictEqual(expected);
  });
});

describe("getUserById getter", () => {
  it("should return the requested user correctly", () => {
    mutations.SET_USERS(stateMock, users);
    const user = getters.getUserById(stateMock)(1);
    const expected = { _id: 11, name: "user1", type: "expert", user: { _id: "1" } };

    expect(user).toBeDefined();
    expect(user instanceof Object).toBeTruthy();
    expect(user).toStrictEqual(expected);
  });
});

describe("getUsersCount getter", () => {
  it("should return the correct users count", () => {
    mutations.SET_USERS(stateMock, users);
    mutations.SET_LENGTH(stateMock, users.length);
    const length = getters.getUsersCount(stateMock);
    const expected = users.length;

    expect(typeof length === "number").toBeTruthy();
    expect(length).toStrictEqual(expected);
  });
});
