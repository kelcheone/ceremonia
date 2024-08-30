"use client";

import JoinCard from "@/components/JoinCard";
import NavBar from "@/components/NavBar";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-col justify-center items-center mx-auto py-12 px-4">
        <JoinCard />
      </div>
    </div>
  );
};

export default Page;
