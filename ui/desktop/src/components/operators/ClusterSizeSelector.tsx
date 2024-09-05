import React, { FC } from "react";
import { Button } from "@/components/ui/button";

type ClusterSizeSelectorProps = {
  clusterSize: number;
  onClusterSizeChange: (size: number) => void;
};
const ClusterSizeSelector: FC<ClusterSizeSelectorProps> = ({
  clusterSize,
  onClusterSizeChange,
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {[4, 7, 10, 13].map((size) => (
        <Button
          key={size}
          variant={size === clusterSize ? "default" : "outline"}
          className="px-6"
          onClick={() => onClusterSizeChange(size)}
        >
          {size}
        </Button>
      ))}
    </div>
  );
};

export default ClusterSizeSelector;
