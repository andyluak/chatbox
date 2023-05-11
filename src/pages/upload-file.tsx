/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { type ChangeEvent, type MouseEvent, useState } from "react";

const UploadFile = () => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
        const fileInput = e.target;

        if (!fileInput.files) {
            alert("No file was chosen");
            return;
        }

        if (!fileInput.files || fileInput.files.length === 0) {
            alert("Files list is empty");
            return;
        }

        const file = fileInput.files[0];
        /** File validation */
        if (!file?.type.startsWith("application/pdf")) {
            alert("Only PDF files are allowed");
            return;
        }

        /** Setting file state */
        setFile(file); // we will use the file state, to send it later to the server
        setPreviewUrl(file.name); // we will use this to show the preview of the image

        /** Reset file input */
        e.currentTarget.type = "text";
        e.currentTarget.type = "file";
    };

    const onCancelFile = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!previewUrl && !file) {
            return;
        }
        setFile(null);
        setPreviewUrl(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (file === null) return;
        const formData = new FormData();

        formData.append("file", file);
        const fileName = file?.name || "test.pdf";

        const headers = new Headers({ "X-File-Name": fileName });

        const response = await fetch("/api/upload-file", {
            method: "POST",
            body: formData,
            // send the file name as header
            headers: headers,
        });
    };

    return (
        <main className="flex h-96 items-center justify-center">
            <form
                className="w-full border border-dashed border-gray-500 p-3"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-col gap-1.5 text-off-white md:flex-row md:py-4">
                    <label className="flex h-full flex-grow cursor-pointer flex-col items-center justify-center py-3 transition-colors duration-150 hover:text-gray-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-14 w-14"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                            />
                        </svg>
                        <strong className="text-sm font-medium">
                            {previewUrl || "No file chosen"}
                        </strong>
                        <input
                            className="block h-0 w-0"
                            name="file"
                            type="file"
                            onChange={onFileUploadChange}
                        />
                    </label>
                    <div className="mt-4 flex justify-center gap-1.5 md:mt-0 md:flex-col">
                        <button
                            disabled={!previewUrl && !file}
                            onClick={onCancelFile}
                            className="w-1/2 rounded-sm bg-gray-700 px-4 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-gray-600 disabled:bg-gray-400 md:w-auto md:text-base"
                        >
                            Cancel file
                        </button>
                        <button
                            disabled={!previewUrl && !file}
                            type="submit"
                            className="w-1/2 rounded-sm bg-gray-700 px-4 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-gray-600 disabled:bg-gray-400 md:w-auto md:text-base"
                        >
                            Upload file
                        </button>
                    </div>
                </div>
            </form>
        </main>
    );
};

export default UploadFile;
