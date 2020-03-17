import { shallowMount } from "@vue/test-utils";
import StatusName from "@/components/StatusName";
let wrapper;
const name = "CLIENT1";

beforeEach(() => {
  wrapper = shallowMount(StatusName, {
    propsData: {
      name,
      active: false
    }
  });
});

describe("StatusName component", () => {
  it("should display the name correctly when entity is not active", () => {
    wrapper.setProps({ active: false });
    expect(wrapper.contains("span")).toBeTruthy();
    expect(wrapper.find(".inactive").exists()).toBeTruthy();
    expect(wrapper.html()).toContain(name);
  });

  it("should display the name correctly when entity is active", () => {
    wrapper.setProps({ active: true });
    expect(wrapper.contains("span")).toBeTruthy();
    expect(wrapper.find(".inactive").exists()).toBeFalsy();
    expect(wrapper.html()).toContain(name);
  });
});
