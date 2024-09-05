import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FC } from 'react';
import { TriangleAlert } from 'lucide-react';

type OperatorWarningProps = {
  message: string;
};

const OperatorWarning: FC<OperatorWarningProps> = ({ message }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <TriangleAlert className="h-4 w-4 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default OperatorWarning;
