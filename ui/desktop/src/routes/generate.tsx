import React, { useEffect, useState } from 'react';
import AppBar from '../AppBar';
import SwitchDarkMode from '../SwitchDarkMode';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import OperatorSelection from '@/components/operators/OperatorSelection';
import { useLocation, useNavigate } from 'react-router-dom';
import useOperatorsStore from '@/stores/operatorsStore';
import { Operator } from '@/types/types';
import { GenerateKeysForm } from '@/components/GenerateKeys/Form';
import NavBar from '@/components/NavBar';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    window.Main.removeLoading();
  }, []);
  const selectedOperators: Operator[] = location.state;
  const setSelectedOperators = useOperatorsStore((state) => state.setSelectedOperators);
  if (selectedOperators && selectedOperators.length > 0) {
    setSelectedOperators(selectedOperators);
  }

  return (
    <div className="flex flex-col">
      {window.Main && (
        <div className="flex-none">
          <AppBar />
        </div>
      )}
      <NavBar params={{ state: selectedOperators, path: '/join/operators' }} />
      <div className="flex h-full flex-col justify-center items-center">
        <GenerateKeysForm />
      </div>
    </div>
  );
}

export default App;
