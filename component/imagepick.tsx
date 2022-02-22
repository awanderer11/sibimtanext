import { Box, Text, Skeleton, Image } from "@chakra-ui/react";
import React, { FC } from "react";

interface ImagePicProps {
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  imageUrl: string;
}

const ImagePick: FC<ImagePicProps> = ({
  imageUrl,
  onChange,
}: ImagePicProps) => {
  return (
    <Box>
      <input
        type="file"
        accept="image/*"
        id={"image"}
        style={{ display: "none" }}
        multiple={true}
        onChange={onChange}
      />
      <label htmlFor={"image"}>
        <Image
          boxSize="200px"
          objectFit="cover"
          src={imageUrl}
          alt="Dan Abramov"
          rounded="md"
        />
      </label>
    </Box>
  );
};

export default ImagePick;
