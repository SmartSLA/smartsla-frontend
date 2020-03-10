import { auth } from "@/services";

const defaultOpRole = {
  roles: {
    isApplicationAdmin: false,
    isPlatformAdmin: false,
    isDomainAdmin: false
  }
};

const adminUser = {
    name: "admin",
    roles: {
      isApplicationAdmin: true
    },
    ticketing: {
      role: "admin"
    }
  },
  expertUser = {
    name: "expert",
    ticketing: {
      role: "expert"
    },
    ...defaultOpRole
  },
  beneficiaryUser = {
    name: "client",
    ticketing: {
      role: "customer"
    },
    ...defaultOpRole
  };

beforeEach(() => {
  auth.watch = {
    authenticated: true
  };

  auth.options = {
    rolesVar: {
      entity: "ticketing",
      key: "role"
    }
  };
});

describe("auth check", () => {
  it("should check if the user is connected correctly", () => {
    const result = auth.check();
    expect(result).toBeTruthy();
  });

  it("should detect if the user is not connected", () => {
    auth.watch.authenticated = false;
    const result = auth.check();
    expect(result).toBeFalsy();
  });

  it("should check if the user is an admin correctly", () => {
    auth.watch.data = { ...adminUser };
    const adminCheck = auth.check("admin");
    const expertCheck = auth.check("expert");

    expect(adminCheck).toBeTruthy();
    expect(expertCheck).toBeFalsy();
  });

  it("should check if the user is an expert correctly", () => {
    auth.watch.data = { ...expertUser };
    const adminCheck = auth.check("admin");
    const expertCheck = auth.check("expert");
    const beneficiaryCheck = auth.check("beneficiary");

    expect(expertCheck).toBeTruthy();
    expect(beneficiaryCheck).toBeFalsy();
    expect(adminCheck).toBeFalsy();
  });

  it("should check if the user is a customer correctly", () => {
    auth.watch.data = { ...beneficiaryUser };
    const beneficiaryCheck = auth.check("customer");
    const expertCheck = auth.check("expert");
    const adminCheck = auth.check("admin");

    expect(expertCheck).toBeFalsy();
    expect(beneficiaryCheck).toBeTruthy();
    expect(adminCheck).toBeFalsy();
  });
});
