import Link from "next/link";

import { MainChat } from "~/components/chat";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#4e022d] to-[#2c1615]">
        <div className="flex h-screen w-[80%]">
          <MainChat />
        </div>
      </main>
    </HydrateClient>
  );
}
