import AWS from "aws-sdk";
import formidable from "formidable";
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

async function uploadFile(file: { newFilename: string; filepath: string; mimetype: string }) {
    const params = {
        Bucket: "chat-with-docs-bucket",
        Key: file.newFilename,
        Body: file.filepath,
        ContentType: file.mimetype,
        ACL: "public-read",
    };
    return s3Client.upload(params).promise();
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
        const formData = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                resolve({ fields, files });
            });
        });

        // upload the file
        const uploadedFile = await uploadFile(formData.files.file);

        res.status(200).json({
            data: {
                url: "/uploaded-file-url",
            },
            error: null,
        });
    } catch (e) {
        if (e instanceof FormidableError) {
            res.status(e.httpCode || 400).json({
                data: null,
                error: e.message,
            });
        } else {
            console.error(e);
            res.status(500).json({
                data: null,
                error: "Internal Server Error",
            });
        }
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
