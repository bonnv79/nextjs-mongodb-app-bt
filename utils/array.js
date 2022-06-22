export const arrayToObject = (value) => {
  return value?.reduce((a, v) => ({ ...a, [v]: v }), {});
}

export const arrayEquals = (value1, value2) => {
  return value1?.sort().toString() === value2?.sort().toString();
}