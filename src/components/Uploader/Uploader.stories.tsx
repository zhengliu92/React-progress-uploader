import { Uploader } from "./Uploader";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Uploader> = {
  title: "Components/Uploader",
  component: Uploader,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Uploader>;

export const Default: Story = {
  args: {
    onFileSelect: (file: File) => alert("Selected file:" + file.name),
  },
};
