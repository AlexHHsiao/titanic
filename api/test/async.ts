export const test = (fn) => {
    return (done) => {
        fn.call().then(done).catch(done);
    };
};