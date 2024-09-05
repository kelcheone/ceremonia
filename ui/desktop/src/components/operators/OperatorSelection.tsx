import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ClusterSizeSelector from './ClusterSizeSelector';
import SearchAndFilter from './SearchAndFilter';
import OperatorTable from './OperatorTable';
import SelectedOperators from './SelectedOperators';
import { Operator } from '@/types/types';
import useOperatorsStore from '@/stores/operatorsStore';
import useFetchInit from '@/hooks/useFetchInit';

export default function OperatorSelection() {
  const selectedOperators = useOperatorsStore((state) => state.selectedOperators);
  const setSelectedOperators = useOperatorsStore((state) => state.setSelectedOperators);

  const clusterSize = useOperatorsStore((state) => state.clusterSize);
  const setClusterSize = useOperatorsStore((state) => state.setClusterSize);

  const { fetchInitOperators, isLoading } = useFetchInit();
  const filters = useOperatorsStore((state) => state.filters);

  const handleClusterSizeChange = (size: number) => {
    setClusterSize(size);
    setSelectedOperators(selectedOperators.slice(0, size));
  };

  useEffect(() => {
    fetchInitOperators(filters);
  }, [filters]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      <Card className="flex-grow">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Pick the cluster of network operators to run your validator</h2>
          <ClusterSizeSelector clusterSize={clusterSize} onClusterSizeChange={handleClusterSizeChange} />
          <SearchAndFilter />
          <OperatorTable selectedOperators={selectedOperators} isLoading={isLoading} />
        </CardContent>
      </Card>
      <SelectedOperators clusterSize={clusterSize} />
    </div>
  );
}
