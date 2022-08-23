import moment from "moment";

export const formatAsSelectData = (items, key) => {
  return items.map((item, i) => ({
    value: item.id.toString(),
    label: item.attributes[key]
  }));
}

export const formatDateTime = (date, time) => {
  return `${moment(`${date}`).format('YYYY-MM-DD')} ${time}`
}