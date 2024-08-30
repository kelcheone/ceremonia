import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Operator } from "@/types/types";
import { useAccount } from "wagmi";

interface SelectedOperatorsProps {
  selectedOperators: Operator[];
}

export default function ShowSelectedOperators({
  selectedOperators,
}: SelectedOperatorsProps) {
  const { chain } = useAccount();

  const onOperatorClick = (operator: Operator) => {
    let url = "explorer.ssv.network/operators/";
    if (chain?.name == "Holesky") {
      url = "https://holesky." + url + operator.id;
    } else {
      url = "https://" + url + operator.id;
    }

    window.open(url, "_blank");
  };

  return (
    <div className="flex justify-center gap-4 mt-4 flex-wrap">
      <TooltipProvider>
        {selectedOperators &&
          selectedOperators.map((operator) => (
            <Tooltip key={operator.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-0 h-8 w-8"
                  onClick={() => onOperatorClick(operator)}
                >
                  <Image
                    src={operator.logo || "/images/placeholder.png"}
                    width={32}
                    height={32}
                    alt={operator.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="sr-only">{operator.name}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{operator.name}</p>
                <p className="text-sm text-muted-foreground">
                  Validators: {operator.validators_count}
                </p>
                <p className="text-sm text-muted-foreground">
                  30d Performance: {operator.performance["30d"].toFixed(2)}%
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
      </TooltipProvider>
    </div>
  );
}
