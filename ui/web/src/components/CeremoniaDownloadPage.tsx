import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaLinux, FaWindows, FaApple, FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";

export default function CeremoniaDownloadPage() {
  const downloadAppImage = () => {
    window.open(
      "https://github.com/kelcheone/ceremonia/releases/download/main/Ceremonia-main.AppImage",
      "_blank"
    );
  };

  const downloadDmg = () => {
    window.open(
      "https://github.com/kelcheone/ceremonia/releases/download/main-mac/Ceremonia-Desktop-main-mac.dmg",
      "_blank"
    );
  };

  const downloadWindows = () => {
    window.open(
      "https://github.com/kelcheone/ceremonia/releases/download/main/Ceremonia.Setup.1.0.0.exe",
      "_blank"
    );
  };

  interface DownloadCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    buttonText: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }

  const DownloadCard = ({
    icon,
    title,
    description,
    buttonText,
    onClick,
    disabled = false,
  }: DownloadCardProps) => (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={onClick} disabled={disabled}>
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-background dark:from-primary/5">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
            Download Ceremonia
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            Experience the power of decentralized ceremonies on your desktop
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <DownloadCard
            icon={<FaLinux className="w-6 h-6" />}
            title="Linux"
            description="Download the AppImage for Linux"
            buttonText={
              <span className="flex items-center justify-center gap-2">
                <FaDownload /> Download AppImage
              </span>
            }
            onClick={downloadAppImage}
          />{" "}
          <DownloadCard
            icon={<FaApple className="w-7 h-6" />}
            title="macOS"
            description=" Download the DMG for macOS Apple Silicon(M1++)"
            buttonText={
              <span className="flex items-center justify-center gap-2">
                <FaDownload /> Download DMG
              </span>
            }
            onClick={downloadDmg}
            disabled={false}
          />
          <DownloadCard
            icon={<FaWindows className="w-6 h-6" />}
            title="Windows"
            description="Windows Installer"
            buttonText={
              <span className="flex items-center justify-center gap-2">
                <FaDownload /> Download Windows
              </span>
            }
            onClick={downloadWindows}
            disabled={false}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">Why Choose Ceremonia?</h2>
          <ul className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <li className="mb-2">✨ Seamless decentralized ceremonies</li>
            <li className="mb-2">🔒 Enhanced security and privacy</li>
            <li className="mb-2">🚀 Optimized for performance</li>
            <li>🌐 Cross-platform compatibility</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
