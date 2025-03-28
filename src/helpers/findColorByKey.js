export const findColorByKey = (id, arr) => {
    console.log('p', id);
  const status = arr.find((item) => {
    console.log(item.STATUS_ID === id);
    return item.STATUS_ID === id;
  });

  return status ? status.COLOR : "";
};
