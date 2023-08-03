"use client";
import { FC } from "react";
import { Button } from "../ui/Button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled: boolean;
  onChange: (value: string) => void;
  onRemove: () => void;
  values: string[];
}

const ImageUpload: FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  values,
}) => {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-5">
        {values.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md">
            <div className="z-10 absolute top-2 right-2">
              <Button
                variant="destructive"
                size="icon"
                type="button"
                onClick={onRemove}
              >
                <Trash className="h-5 w-5" />
              </Button>
            </div>

            <Image fill className="object-cover" alt="image" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="gkb30bx4">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
