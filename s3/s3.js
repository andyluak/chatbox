const fs = require("fs");
const S3rver = require("s3rver");

new S3rver({
    port: 5000,
    directory: "./s3",
    configureBuckets: [
        {
            name: "chat-with-docs-bucket",
        },
    ],
    address: "localhost",
}).run((err) => {
    if (err) {
        console.error(err);
    }
    console.log("S3rver running on port", 5000);
});


