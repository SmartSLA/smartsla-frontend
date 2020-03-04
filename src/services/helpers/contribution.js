import { CONTRIBUTION_STATUS_LIST } from "@/constants";

export { getContributionStatus };

function getContributionStatus(status) {
  const { integrated, rejected, reversed, published } = status;

  if (rejected) {
    return CONTRIBUTION_STATUS_LIST.REJECTED;
  }

  if (integrated) {
    return CONTRIBUTION_STATUS_LIST.INTEGRATED;
  }

  if (published) {
    return CONTRIBUTION_STATUS_LIST.PUBLISHED;
  }

  if (reversed) {
    return CONTRIBUTION_STATUS_LIST.REVERSED;
  }

  return CONTRIBUTION_STATUS_LIST.DEVELOP;
}
