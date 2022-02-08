import { Input, VStack, Text, InputProps } from "@chakra-ui/react";
import { FC } from "react";

interface InputPropsText extends InputProps {
  title: string;
}

export const InputWihtText: FC<InputPropsText> = (props: InputPropsText) => {
  return (
    <VStack align={"start"} width={"400px"} pt={3}>
      <Text textTransform={"uppercase"}>{props.title}</Text>
      <Input {...props} borderColor={"black"} />
    </VStack>
  );
};
