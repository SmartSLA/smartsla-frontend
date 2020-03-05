const Mixin = {
  methods: {
    sortSoftware(software) {
      return (software || []).sort((a, b) => {
        const valA = a.software && a.software.name;
        const valB = b.software && b.software.name;
        return valA.toLowerCase().localeCompare(valB.toLowerCase());
      });
    }
  }
};

export default Mixin;
