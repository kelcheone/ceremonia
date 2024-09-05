"use client";
import { GenerateKeysForm } from "@/components/GenerateKeys/Form";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import MessagePopup from "@/components/ui/MessagePopup";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-col min-h-screen mx-auto">
      <NavBar />
      <div className="flex flex-col justify-center items-center  py-12 px-4">
        <div className="w-full lg:w-1/2 flex justify-start">
          <Button onClick={() => router.back()} variant="secondary">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </div>
        <GenerateKeysForm />
      </div>
      <MessagePopup />
    </main>
  );
}
