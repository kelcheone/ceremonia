"use client";

import NavBar from "@/components/NavBar";
import OperatorSelection from "@/components/operators/OperatorSelection";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-col justify-center p-2">
        <div className="w-full lg:w-1/2 flex justify-start">
          <Button onClick={() => router.back()} variant="secondary">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </div>
        <OperatorSelection />
      </div>
    </div>
  );
};

export default Page;
