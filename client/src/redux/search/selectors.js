import { useSelector } from 'react-redux';

const Selectors = () => {
    const search = useSelector((state) => state.search);

    return {
        search,
    };
};

export default Selectors;
