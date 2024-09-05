import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaDownload, FaGlobe, FaShieldAlt, FaUsers } from "react-icons/fa";
import Link from "next/link";
import { Player } from "@lottiefiles/react-lottie-player";

export default function CeremoniaLandingPage() {
  interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
  }

  const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-background dark:from-primary/5">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Ceremonia
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empower your validators with distributed key generation for enhanced
            security and resilience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold mb-4">
              Run a Distributed Validator
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Distribute your validation duties among a set of distributed nodes
              to improve your validator resilience, safety, liveliness, and
              diversity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/download">
                <Button size="lg" className="flex items-center gap-2">
                  <FaDownload /> Download Desktop App
                </Button>
              </Link>
              <Link href="/join/operators">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <FaGlobe /> Try Web Version
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center justify-center"
          >
            <div className="w-full h-64 bg-foreground/5 rounded-lg flex items-center justify-center">
              <Player
                autoplay
                loop
                src="/distributed.json"
                style={{ height: "50%", width: "50%" }}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold text-center mb-8">
            Why Choose Ceremonia?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FaShieldAlt className="w-6 h-6 text-primary" />}
              title="Enhanced Security"
              description="Utilize distributed key generation with ssv-dkg for improved validator security and resilience."
            />
            <FeatureCard
              icon={<FaUsers className="w-6 h-6 text-primary" />}
              title="User-Friendly Interface"
              description="No need for complex docker or CLI commands. Our intuitive interface makes distributed key shares generation accessible to all."
            />
            <FeatureCard
              icon={<FaDownload className="w-6 h-6 text-primary" />}
              title="Desktop Application"
              description="For maximum security, download our desktop application and manage your validators with confidence. No third parties."
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">Get Started Today</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Experience the power of distributed validation with Ceremonia. Try
            our web version to get a feel for the platform, then download the
            desktop application for enhanced security and full functionality.
          </p>
          <Link href="/download">
            <Button size="lg" className="flex items-center gap-2 mx-auto">
              <FaDownload /> Download Ceremonia
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
