const Config = require("./lib/config");
const Cors = require("cors");

module.exports = function({ type = "default" }) {
    const whitelist = Config.defaultAllowedOrigins;

    if (type === "public") {
        const apiTokensAllowedOrigins = Object.values(Config.apiTokens).reduce(
            (acc, cur) => [...acc, cur.allowedOrigins],
            []
        );

        whitelist.push(...apiTokensAllowedOrigins);
    }

    return Cors({
        origin: (origin, callback) => {
            // allow requests with no origin
            // (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            if (!whitelist.includes(origin)) {
                var msg =
                    "The CORS policy for this site does not allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }

            return callback(null, true);
        },
        optionsSuccessStatus: 200,
        credentials: true,
        preflightContinue: false
    });
};
