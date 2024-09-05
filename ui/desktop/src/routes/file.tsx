import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MapFiles from '@/components/MapFiles';
import { useGetFiles } from '@/hooks/useFiles';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@/AppBar';
import NavBar from '@/components/NavBar';

export default function Page() {
  const navitage = useNavigate();
  useGetFiles();

  useEffect(() => {
    window.Main.removeLoading();
  }, []);
  return (
    <div className="flex flex-col">
      {window.Main && (
        <div className="flex-none">
          <AppBar />
        </div>
      )}
      <NavBar params={{ state: '', path: '/join/generate' }} />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Download Files</h1>
        <MapFiles />
      </div>
    </div>
  );
}
