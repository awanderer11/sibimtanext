import { Box, Text, Skeleton, Image } from "@chakra-ui/react";
import React, { FC } from "react";

interface ImagePicProps {
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
}

const FilePick: FC<ImagePicProps> = ({
  onChange,
}: ImagePicProps) => {
  return (
    <Box>
      <input
        type="file"
        accept="docx/*"
        id={"image"}
        // style={{ display: "none" }}
        multiple={false}
        onChange={onChange}
      />
      
    </Box>
  );
};

export default FilePick;
