/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
// @ts-nocheck
import AWS from "aws-sdk";
import formidable from "formidable";
import fs from "fs";
import { type NextApiRequest, type NextApiResponse } from "next";

const s3Client = new AWS.S3({
    region: "us-east-1",
    endpoint: "http://localhost:5000",
    s3ForcePathStyle: true,
    credentials: {
        accessKeyId: "S3RVER",
        secretAccessKey: "S3RVER",
    },
    accessKeyId: "S3RVER",
    secretAccessKey: "S3RVER",
});

type FileType = {
    newFilename: string;
    filepath: fs.ReadStream;
    mimetype: string;
};

async function uploadFile(file: FileType) {
    const params = {
        Bucket: "chat-with-docs-bucket",
        Key: file.newFilename,
        Body: file.filepath,
        ContentType: file.mimetype,
        ACL: "public-read",
    };
    return s3Client.upload(params).promise();
}

interface FormData {
    files: {
        file: FileType;
    };
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        res.status(405).json({
            data: null,
            error: "Method Not Allowed",
        });
        return;
    }

    try {
        // get the form data
        const form = new formidable.IncomingForm();
        form.parse(req);
        const formData: FormData = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                const file = files.file as unknown as FileType;
                const fData = {
                    files: {
                        file,
                    },
                };
                resolve(fData);
            });
        });
        const file = formData.files.file;
        const fileStream = fs.createReadStream(file.filepath);
        fileStream.on("error", function (err) {
            console.log("File Error", err);
        });

        const file = await uploadFile({
            newFilename: file.newFilename,
            filepath: fileStream,
            mimetype: file.mimetype,
        });
        res.status(200).json({ data: res });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            data: null,
            error: "Internal Server Error",
        });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
