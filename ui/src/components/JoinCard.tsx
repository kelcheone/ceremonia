import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
const JoinCard = () => {
  const router = useRouter();
  const { isConnected } = useAccount();
  return (
    <div className="w-full lg:w-1/2">
      <Card>
        <CardHeader>
          <CardTitle>Run a Distributed Validator</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-lg">
            Distribute your validation duties among a set of distributed nodes
            to improve your validator resilience, safety, liveliness, and
            diversity.
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          {isConnected && (
            <Button
              className="font-bold text-lg"
              onClick={() => {
                router.push("/join/operators");
              }}
            >
              Generate New Key Shares{" "}
            </Button>
          )}
          {!isConnected && <ConnectKitButton />}
        </CardFooter>
      </Card>
    </div>
  );
};

export default JoinCard;
