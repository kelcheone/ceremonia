import React, { useEffect, useState } from 'react';
import AppBar from './AppBar';

import SwitchDarkMode from './SwitchDarkMode';
import { Button } from './components/ui/button';
import JoinCard from './components/JoinCard';
import NavBar from './components/NavBar';

function App() {
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
      <div className="flex-auto">
        <NavBar />
        <div className="flex flex-col justify-center items-center h-full pt-32 space-y-4">
          <JoinCard />
        </div>
      </div>
    </div>
  );
}

export default App;
