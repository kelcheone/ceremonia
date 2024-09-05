"use client";

import JoinCard from "@/components/JoinCard";
import CeremoniaLandingPage from "@/components/LandingPage";
import NavBar from "@/components/NavBar";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div>
        <CeremoniaLandingPage />
      </div>
    </div>
  );
};

export default Page;
