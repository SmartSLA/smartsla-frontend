import moment from "moment-timezone";

const IntervalType = {
  LAST_WEEK: "LAST_WEEK",
  LAST_TWO_WEEK: "LAST_TWO_WEEK",
  LAST_MONTH: "LAST_MONTH",
  LAST_YEAR: "LAST_YEAR"
};

function formatDate(date) {
  return moment(date).format("YYYY-MM-DD");
}

function buildQueryParam(filterParams) {
  let { queryId, group, interval } = filterParams;
  let end = moment();
  let start;

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

  start = formatDate(start);
  end = formatDate(end);

  return { queryId, start, end, group };
}

export { buildQueryParam };
