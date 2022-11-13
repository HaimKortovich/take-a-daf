import { Text, Group, TextInputProps, Anchor, TextInput } from "@mantine/core";

export function AddPaginaInputInput({
  className,
  style,
  ...others
}: TextInputProps) {
  return (
    <div className={className} style={style}>
      <Group position="apart" mb={5}>
        <Text component="label" htmlFor="your-name" size="sm" weight={500}>
          Nombre
        </Text>
      </Group>
      <TextInput placeholder="Your Name" id="your-name" {...others} />
    </div>
  );
}
