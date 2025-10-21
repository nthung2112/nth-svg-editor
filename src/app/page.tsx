import { cookies } from "next/headers";
import { Editor } from "@/components/editor";

export default async function Home() {
  const cookie = await cookies();
  const layout = cookie.get("react-resizable-panels:layout");

  let defaultLayout = [30, 70];
  if (layout) {
    defaultLayout = JSON.parse(layout.value);
  }

  return <Editor defaultLayout={defaultLayout} />;
}
