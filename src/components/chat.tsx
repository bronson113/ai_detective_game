"use client";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Bubble from "./bubble";
import { ScrollArea } from "./ui/scroll-area";
import { Send } from "lucide-react";
import { Spinner } from "./ui/spinner";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const printable = /^[ -~]+$/;

export function MainChat() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const initialMessage = {
    role: "assistant",
    content:
      "Welcome to murder mystery. In a spooky night, a sudden attack appeared",
  } as Message;
  const [messages, setMessages] = useState<Array<Message>>([initialMessage]);

  const queryAI = api.chat.chat.useMutation({
    onSuccess: (data) => {
      if (data.length == 0) {
        setError("The detective doesn't understand your question");
        setInput("");
        return;
      }
      const resultingMessage = {
        role: "assistant",
        content: data,
      } as Message;

      setMessages([...messages, resultingMessage]);
      setError("");
      setInput("");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!printable.test(input)) {
      setError("Please ask your question in English");
      return;
    }
    if (input.length > 1000) {
      setError("Your question are too long");
      return;
    }
    const prompt = {
      role: "user",
      content: input,
    } as Message;
    const updatedMessages = [...messages, prompt];
    setMessages(updatedMessages);
    queryAI.mutate({ prompts: updatedMessages });
  };

  const reset = () => {
    setMessages([initialMessage]);
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between rounded bg-[#8458] p-4">
        <h1 className="text-xl font-semibold text-rose-600">Murder Mystery</h1>
        <div className="">
          <Button onClick={reset} className="bg-[#8458] text-xl text-rose-600">
            Reset
          </Button>
        </div>
      </header>
      <ScrollArea className="flex-1 p-4">
        {messages.map((el, i) => {
          return <Bubble key={i} role={el.role} content={el.content} />;
        })}
      </ScrollArea>
      <div className="text-rose-600">{error ? error : ""}</div>
      <form onSubmit={handleSubmit} className="mb-4 flex space-x-2 text-white">
        <Input
          type="text"
          placeholder="Ask me something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border-rose-200"
        />
        <Button
          type="submit"
          className="bg-rose-800"
          disabled={queryAI.isPending}
        >
          <Send className="h-4 w-4" />
        </Button>
        <Spinner show={queryAI.isPending} className="text-rose-200" />
      </form>
    </div>
  );
}
