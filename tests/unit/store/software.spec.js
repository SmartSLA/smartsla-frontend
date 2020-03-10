import store from "@/store/modules/software";
import { keyBy, cloneDeep } from "lodash";

const { mutations, getters, state } = store;

const software = [
  { _id: 1, name: "OpenPaaS" },
  { _id: 2, name: "Linshare" },
  { _id: 3, name: "LinId" },
  { _id: 4, name: "Obm" }
];

describe("SET_SOFTWARE mutation", () => {
  it("should populate the state correctly", () => {
    const stateMock = cloneDeep(state);
    const expectedState = keyBy(software, "_id");

    mutations.SET_SOFTWARE(stateMock, software);
    expect(stateMock.software instanceof Object).toBeTruthy();
    expect(stateMock.software).toStrictEqual(expectedState);
  });
});

describe("UPDATE_SOFTWARE mutation", () => {
  const stateMock = cloneDeep(state);
  stateMock.software = keyBy(software, "_id");
  it("should update software in state correctly", () => {
    const _id = 3;
    const name = "Thunderbird";
    const updatedSoftware = { _id, name };

    mutations.UPDATE_SOFTWARE(stateMock, updatedSoftware);
    expect(stateMock.software[_id]).toBeDefined();
    expect(stateMock.software[_id]).toStrictEqual(updatedSoftware);
    expect(stateMock.software[_id].name).toStrictEqual(name);
  });

  it("should insert a new software if it doesn't exist in store", () => {
    const newSoftware = { _id: 7, name: "Outlook" };

    mutations.UPDATE_SOFTWARE(stateMock, newSoftware);
    expect(stateMock.software[7]).toBeDefined();
    expect(stateMock.software[7] instanceof Object).toBeTruthy();
    expect(stateMock.software[7]).toStrictEqual(newSoftware);
  });
});

describe("SET_LENGTH mutation", () => {
  it("should set the length correctly", () => {
    const stateMock = cloneDeep(state);
    const size = 100;

    mutations.SET_LENGTH(stateMock, size);
    expect(typeof stateMock.length === "number").toBeTruthy();
    expect(stateMock.length).toStrictEqual(size);
  });
});

describe("REMOVE_SOFTWARE mutation", () => {
  it("should remove the software correctly from the store", () => {
    const stateMock = cloneDeep(state);
    stateMock.software = keyBy(software, "_id");

    mutations.REMOVE_SOFTWARE(stateMock, 1);
    expect(stateMock.software[1]).toBeUndefined();
  });
});

describe("getSoftwareList getter", () => {
  it("should return the software list correctly from the store", () => {
    const stateMock = cloneDeep(state);
    stateMock.software = keyBy(software, "_id");
    const softwareList = getters.getSoftwareList(stateMock);

    expect(Array.isArray(softwareList)).toBeTruthy();
    expect(softwareList).toStrictEqual(software);
    expect(softwareList).toHaveLength(software.length);
  });

  it("should return an empty array when no software in store", () => {
    const stateMock = cloneDeep(state);
    const softwareList = getters.getSoftwareList(stateMock);

    expect(Array.isArray(softwareList)).toBeTruthy();
    expect(softwareList).toStrictEqual([]);
  });
});

describe("getSoftwareById getter", () => {
  it("should return the correct software from the store", () => {
    const stateMock = cloneDeep(state);
    stateMock.software = keyBy(software, "_id");
    const id = 1;
    const fetchedSoftware = getters.getSoftwareById(stateMock)(id);
    const expectedSoftware = { _id: 1, name: "OpenPaaS" };

    expect(fetchedSoftware).toBeDefined();
    expect(fetchedSoftware._id).toEqual(id);
    expect(fetchedSoftware.name).toEqual("OpenPaaS");
    expect(fetchedSoftware).toStrictEqual(expectedSoftware);
  });
});

describe("getSoftwareCount getter", () => {
  it("should return the software count correctly", () => {
    const stateMock = cloneDeep(state);
    const length = 50;
    mutations.SET_LENGTH(stateMock, length);
    const count = getters.getSoftwareCount(stateMock);

    expect(typeof count === "number").toBeTruthy();
    expect(count).toStrictEqual(length);
  });
});
