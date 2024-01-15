/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import upload from "../../../public/assets/icons/file-upload.svg";
import { Button } from "../ui/button";

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
};
const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".svg", ".jpg"],
    },
  });
  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl px-4 py-6 cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex flex-1 w-full justify-center p-5 lg:p-10s">
            <img src={fileUrl} alt="image" className="file_uploader-img" />
          </div>
          <p className="file_uploader-label">Click or drag photo for replace</p>
        </>
      ) : (
        <div>
          <img
            src={upload}
            alt="drag-image"
            width={96}
            height={77}
            className="mx-auto"
          />
          <p className="mt-6 text-center text-xl mb-1 font-semibold">
            Drag Photos Here
          </p>
          <p className="text-center text-sm text-light-3 uppercase">
            png, jpg, svg, jpeg
          </p>
          <Button type="button" className="shad-button_dark_4 mt-6">
            Select From Computer
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
