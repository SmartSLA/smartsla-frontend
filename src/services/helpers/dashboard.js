import moment from "moment-timezone";

const IntervalType = {
  LAST_WEEK: "LAST_WEEK",
  LAST_TWO_WEEK: "LAST_TWO_WEEK",
  LAST_MONTH: "LAST_MONTH",
  LAST_YEAR: "LAST_YEAR",
  NONE: "NONE"
};

function formatDate(date) {
  return moment(date).format("YYYY-MM-DD");
}

function getDateInterval(intervalType, start, end) {
  let interval = {};

  if (IntervalType.NONE !== intervalType) {
    interval.start = formatDate(start);
    interval.end = formatDate(end);
  }

  return interval;
}

function buildQueryParam(filterParams) {
  let { queryId, group, interval } = filterParams;
  let end = moment();
  let start;
  let queryParams = {};

  switch (interval) {
    case IntervalType.LAST_WEEK:
      start = moment(end).add(-1, "weeks");
      group = group || "day";
      break;
    case IntervalType.LAST_TWO_WEEK:
      start = moment(end).add(-2, "weeks");
      group = group || "day";
      break;
    case IntervalType.LAST_MONTH:
      start = moment(end).add(-1, "months");
      group = group || "day";
      break;
    case IntervalType.LAST_YEAR:
      start = moment(end).add(-1, "years");
      group = group || "month";
      break;
  }

  const intervalPeriod = getDateInterval(interval, start, end);

  if (intervalPeriod.start) {
    queryParams.start = intervalPeriod.start;
  }

  if (intervalPeriod.end) {
    queryParams.end = intervalPeriod.end;
  }

  queryParams.queryId = queryId;
  queryParams.group = group;

  return queryParams;
}

export { buildQueryParam };
