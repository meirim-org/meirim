export const daysPassed = (date) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const today = Date.now();

    return ` ${Math.round(Math.abs((today - date) / oneDay))} `;
}