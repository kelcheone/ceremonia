"use client";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import MapFiles from "@/components/MapFiles";
import Head from "next/head";
import { useGetFiles } from "@/hooks/useFiles";

export default function Page() {
  const router = useRouter();

  useGetFiles();

  return (
    <>
      <Head>
        <title>Ceremonia | Files</title>
      </Head>
      <NavBar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Download Files</h1>
        <div className="w-full lg:w-1/2 flex justify-start mb-2">
          <Button onClick={() => router.back()} variant="secondary">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </div>
        <MapFiles />
      </div>
    </>
  );
}
