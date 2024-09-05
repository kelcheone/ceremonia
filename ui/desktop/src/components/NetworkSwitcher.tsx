import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, Box } from 'lucide-react';
import { FaEthereum } from 'react-icons/fa';
import useFetchInit from '@/hooks/useFetchInit';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Chain } from '@/types/types';

const chains: Chain[] = [
  { name: 'Ethereum', id: 1 },
  { name: 'Holesky', id: 17000 }
];

export default function NetworkSwitcher() {
  const { toast } = useToast();
  const [chain, setChain] = useState<Chain>();
  const { fetchInitOperators } = useFetchInit();

  useEffect(() => {
    const storedChainId = localStorage.getItem('selectedChainId');
    const initialChain = chains.find((c) => c.id.toString() === storedChainId) || chains[0];
    setChain(initialChain);
  }, []);

  useEffect(() => {
    if (chain) {
      localStorage.setItem('selectedChainId', chain.id.toString());
      fetchInitOperators();
    }
  }, [chain]);

  const handleNetworkSwitch = (selectedChain: Chain) => {
    setChain(selectedChain);
    toast({
      title: 'Network Changed',
      description: `Switched to ${selectedChain.name}`
    });

    fetchInitOperators();
  };

  if (!chain) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center font-semibold">
          {chain.id === 1 ? <FaEthereum className="h-4 w-4 mr-1" /> : <Box className="h-4 w-4 mr-1" />}
          {chain.name}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {chains.map((c) => (
          <DropdownMenuItem key={c.id} onSelect={() => handleNetworkSwitch(c)}>
            {c.id === 1 ? <FaEthereum className="h-4 w-4 mr-2" /> : <Box className="h-4 w-4 mr-2" />}
            {c.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
