import bot from "../icons/bot.png";
import user from "../icons/user.png";

export default function Bubble({
  role,
  content,
  ...prop
}: {
  role: "user" | "assistant";
  content: string;
}) {
  if (role === "user") {
    return (
      <div className="mb-4 flex justify-end">
        <div className="max-w-[80%] whitespace-pre-line rounded-lg bg-blue-500 p-3 text-white">
          {content}
        </div>
      </div>
    );
  } else {
    return (
      <div className="mb-4 flex justify-start">
        <div className="max-w-[80%] whitespace-pre-line rounded-lg bg-gray-200 p-3">
          {content}
        </div>
      </div>
    );
  }
}
