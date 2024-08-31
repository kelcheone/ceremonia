import React from "react";
import FileCard from "./FileCard";
import useFileStore from "@/stores/fileStore";

function MapFiles() {
  const files = useFileStore((state) => state.files);
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {files.map((file) => (
        <FileCard
          key={file.sessionId}
          sessionId={file.sessionId}
          file={file.file}
          expiry={file.expiration}
          selectedOperators={file.selectedOperators}
        />
      ))}
      {files.length === 0 && (
        <div className="text-lg text-muted-foreground">
          No files available for download
        </div>
      )}
    </div>
  );
}

export default MapFiles;
