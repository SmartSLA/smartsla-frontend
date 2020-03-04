import { CONTRIBUTION_STATUS } from "@/constants";

export { getContributionStatus };

function getContributionStatus(status) {
  const { integrated, rejected, reversed, published } = status;

  if (rejected) {
    return CONTRIBUTION_STATUS.REJECTED;
  }

  if (integrated) {
    return CONTRIBUTION_STATUS.INTEGRATED;
  }

  if (published) {
    return CONTRIBUTION_STATUS.PUBLISHED;
  }

  if (reversed) {
    return CONTRIBUTION_STATUS.REVERSED;
  }

  return CONTRIBUTION_STATUS.DEVELOP;
}
