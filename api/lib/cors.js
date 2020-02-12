const Config = require("./lib/config");
const Cors = require("cors");

exports.defaultCors = function () {
    // const whitelist = ['http://localhost:3000', 'http://meirim.org', 'https://meirim.org']
    return Cors({
        origin: (origin, callback) => callback(null, true),
        optionsSuccessStatus: 200,
        credentials: true,
        preflightContinue: false
    });
};

exports.publicCors = function() {
    const apiTokens = Config.get('apiTokens');
    const whitelist = Object.values(apiTokens).reduce(
        (acc, cur) => [...acc, cur.allowedOrigins],
        []
    );

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
