import { Box, Text, Skeleton, Image } from "@chakra-ui/react";
import React, { FC } from "react";

interface ImagePicProps {
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
}

const FilePick: FC<ImagePicProps> = ({
  onChange,
}: ImagePicProps) => {
  return (
    <Box mt={2}>
      <input
        type="file"
        accept="docx/*"
        id={"file"}
        // style={{ display: "none" }}
        multiple={true}
        onChange={onChange}
      />
      
    </Box>
  );
};

export default FilePick;
