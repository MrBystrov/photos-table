export const correctEntityName = (id, arr) => {
  const status = arr.find((item) => {
    return item.STATUS_ID === (id);
  } );

  return status ? status.NAME : '';
};
