const getFromArr = (arr, index) => {
    return index === undefined || index === -1 ? undefined : arr[index];
};

module.exports = {
    getFromArr
}