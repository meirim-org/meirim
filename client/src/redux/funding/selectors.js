import { useSelector } from "react-redux";

const Selectors = () => {
    const statsData = useSelector((state) => state.funding.statsData);

    return {
        statsData,
    };
};

export default Selectors;
