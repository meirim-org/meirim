import * as React from "react";

function SuccessIcon(props) {
    return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <svg width={40} height={40} fill="none" viewBox="0 0 40 40" {...props}>
            <path
                fill="#00CA82"
                d="M20 0C8.96 0 0 8.96 0 20s8.96 20 20 20 20-8.96 20-20S31.04 0 20 0zm-4 30L6 20l2.82-2.82L16 24.34 31.18 9.16 34 12 16 30z"
            />
        </svg>
    );
}

export default SuccessIcon;
