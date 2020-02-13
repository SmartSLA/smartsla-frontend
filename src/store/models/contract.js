export class Contract {
  constructor({ name = ``, clientId = null } = {}) {
    this.name = name;
    this.clientId = clientId;
  }
}

export function createContract(data) {
  return Object.freeze(new Contract(data));
}
