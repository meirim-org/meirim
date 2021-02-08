import { useSelector } from "react-redux";

const Selectors = () => {
    const comments = useSelector((state) => state.comments.data);
    const commentsCount = useSelector((state) => state.comments.commentsCount);

    return {
        comments,
        commentsCount,
    };
};

export default Selectors;
