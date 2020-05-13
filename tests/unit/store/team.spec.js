import store from "@/store/modules/team.js";
import { keyBy } from "lodash";

const { getters, mutations } = store;

const teams = [
  { _id: 1, name: "team1" },
  { _id: 2, name: "team2" },
  { _id: 3, name: "team3" },
  { _id: 4, name: "team4" },
  { _id: 5, name: "team5" }
];

describe("UPDATE_TEAM mutation", () => {
  const state = { teams: keyBy(teams, "_id") };

  it("should correctly update a team", () => {
    const name = "updated team 3";
    const _id = 3;
    const team = {
      _id,
      name
    };

    mutations.UPDATE_TEAM(state, team);

    expect(state.teams[_id]).toStrictEqual(team);
    expect(state.teams[_id].name).toEqual(name);
  });

  it("should insert a new team if team doesn't exist", () => {
    const _id = 7;
    const team = {
      _id,
      name: "team7"
    };

    mutations.UPDATE_TEAM(state, team);

    expect(state.teams[_id]).toBeDefined();
    expect(state.teams[_id]).toStrictEqual(team);
  });
});

describe("REMOVE_TEAM mutation", () => {
  it("should correctly remove a team", () => {
    const state = { teams: keyBy(teams, "_id") };
    const id = 1;

    mutations.REMOVE_TEAM(state, id);

    expect(state.teams[id]).toBeUndefined();
  });
});

describe("SET_LENGTH mutation", () => {
  it("should set the team length correctly", () => {
    const state = { count: 0 };
    const size = 100;

    mutations.SET_LENGTH(state, size);

    expect(state.count).toEqual(size);
  });
});

describe("SET_TEAMS mutation", () => {
  it("should set teams correctly", () => {
    const state = { teams: {} };

    mutations.SET_TEAMS(state, teams);

    expect(state.teams instanceof Object).toBeTruthy();
    expect(Object.keys(state.teams).length).toEqual(teams.length);
    expect(state.teams).toStrictEqual(keyBy(teams, "_id"));
    expect(state.teams[1]).toBeDefined();
    expect(state.teams[1].name).toEqual("team1");
  });
});

describe("getTeams getter", () => {
  it("should correctly return the team list when teams in the store", () => {
    const state = { teams: keyBy(teams, "_id") };

    expect(getters.getTeams(state)).toBeDefined();
    expect(Array.isArray(getters.getTeams(state))).toBeTruthy();
    expect(getters.getTeams(state)).toStrictEqual(teams);
  });

  it("should correctly return the team list when no teams in the store", () => {
    const state = { teams: {} };

    expect(getters.getTeams(state)).toBeDefined();
    expect(Array.isArray(getters.getTeams(state))).toBeTruthy();
    expect(getters.getTeams(state)).toStrictEqual([]);
  });
});

describe("getTeamById getter", () => {
  it("should correctly return the requested team", () => {
    const state = { teams: keyBy(teams, "_id") };
    const id = 2;

    expect(getters.getTeamById(state)(id)).toBeDefined();
    expect(getters.getTeamById(state)(id)).toEqual(teams[1]);
    expect(getters.getTeamById(state)(id).name).toStrictEqual("team2");
  });
});

describe("getTeamsCount getter", () => {
  it("should return the length correctly", () => {
    const state = { count: 1 };

    expect(getters.getTeamsCount(state)).toBeDefined();
    expect(getters.getTeamsCount(state)).toStrictEqual(1);
  });
});
