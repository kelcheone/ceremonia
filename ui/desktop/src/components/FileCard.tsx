import React, { useState, useEffect } from 'react';
import { FolderArchive, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Operator } from '@/types/types';
import ShowSelectedOperators from './ShowSelectedOperators';
import { Trash } from 'lucide-react';
import useFileStore from '@/stores/fileStore';

interface FileCardProps {
  sessionId: string;
  file: {
    name: string;
    url: string;
  };
  expiry: string;
  selectedOperators: Operator[];
}

const FileCard: React.FC<FileCardProps> = ({ sessionId, file, expiry, selectedOperators }) => {
  const VITE_DKG_HOST = 'http://localhost:9126';
  const downloadUrl = `${VITE_DKG_HOST}/api/get-file/${sessionId}`;
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });

  const removeFile = useFileStore((state) => state.removeFile);
  const deleteFile = () => {
    const key = `dkg-${sessionId}`;
    localStorage.removeItem(key);
    removeFile({
      sessionId,
      file,
      selectedOperators,
      expiration: expiry,
      date: '',
      message: ''
    });
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = Date.parse(expiry) - now;

      if (distance > 0) {
        return {
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
          total: distance
        };
      } else {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
      }
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiry]);

  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-col items-center justify-between p-6 h-full">
        <div className="flex justify-end w-full">
          <Trash className="h-6 w-6 text-muted-foreground cursor-pointer hover:text-destructive" onClick={deleteFile} />
        </div>
        <div className="flex items-center mb-4 w-full">
          <FolderArchive className="h-12 w-12 text-primary mr-4 flex-shrink-0" />
          <span className="text-lg font-medium truncate">{file.name}</span>
        </div>
        <Button className="w-full mt-auto mb-4">
          {/* <Download className="mr-2 h-4 w-4" /> Download */}
          <a href={downloadUrl} className="flex items-center justify-center w-full">
            <Download className="mr-2 h-4 w-4" /> Download
          </a>
        </Button>
        {timeLeft.total > 0 ? (
          <div className="w-full">
            <div className="text-sm text-muted-foreground mb-2">Time left:</div>
            <div className="flex justify-between gap-2">
              <Badge variant="outline" className="flex-1 text-center">
                <span className="font-bold">{timeLeft.days}</span>
                <span className="text-xs ml-1">days</span>
              </Badge>
              <Badge variant="outline" className="flex-1 text-center">
                <span className="font-bold">{timeLeft.hours}</span>
                <span className="text-xs ml-1">hrs</span>
              </Badge>
              <Badge variant="outline" className="flex-1 text-center">
                <span className="font-bold">{timeLeft.minutes}</span>
                <span className="text-xs ml-1">min</span>
              </Badge>
              <Badge variant="outline" className="flex-1 text-center">
                <span className="font-bold">{timeLeft.seconds}</span>
                <span className="text-xs ml-1">sec</span>
              </Badge>
            </div>
          </div>
        ) : (
          <Badge variant="destructive" className="w-full text-center">
            Expired
          </Badge>
        )}
        <ShowSelectedOperators selectedOperators={selectedOperators} />
      </CardContent>
    </Card>
  );
};

export default FileCard;
