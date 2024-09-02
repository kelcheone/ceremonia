import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { mainnet, holesky } from "wagmi/chains";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useModal } from "connectkit";
import { ChevronDown, Box } from "lucide-react";
import { FaEthereum } from "react-icons/fa";
import useFetchInit from "@/hooks/useFetchInit";

export default function NetworkSwitcher() {
  const { chain } = useAccount();
  const { isConnected } = useAccount();
  const { toast } = useToast();
  const { openSwitchNetworks } = useModal();

  const { fetchInitOperators } = useFetchInit();

  const handleNetworkSwitch = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    openSwitchNetworks();
  };

  useEffect(() => {
    fetchInitOperators();
  }, [chain]);

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleNetworkSwitch}
        disabled={!isConnected}
        className="flex items-center font-semibold"
      >
        {chain?.id === mainnet.id ? (
          <FaEthereum className="h-4 w-4 mr-1" />
        ) : (
          <Box className="h-4 w-4 mr-1" />
        )}
        {chain?.name}
        <ChevronDown className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
