export const formatUserNameById = (id, arr) => {
    const user = arr.find((user) => user.ID === id);
    return `${user.NAME} ${user.LAST_NAME}`
}