import React from "react";
import FileCard from "./FileCard";
import { getKeysData } from "@/hooks/useGenerateKeys";

function MapFiles() {
  const data = getKeysData();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((file) => (
        <FileCard
          key={file.sessionId}
          sessionId={file.sessionId}
          file={file.file}
          expiry={file.expiration}
          selectedOperators={file.selectedOperators}
        />
      ))}
      {data.length === 0 && (
        <div className="text-lg text-muted-foreground">
          No files available for download
        </div>
      )}
    </div>
  );
}

export default MapFiles;
