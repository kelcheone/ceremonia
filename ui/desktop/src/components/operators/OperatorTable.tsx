import React, { FC, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Info, Check } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Operator } from '@/types/types';
import useOperatorsStore from '@/stores/operatorsStore';
import useFetchNextPage from '@/hooks/useFetchNextPage';
import LoadingSpinner from '../LoadingSpinner';
import OperatorWarning from './OperatorWarning';

type OperatorTableProps = {
  selectedOperators: Operator[];
  isLoading: boolean;
};

const OperatorTable: FC<OperatorTableProps> = ({ selectedOperators, isLoading }) => {
  const operators = useOperatorsStore((state) => state.operators);
  const setCurrentPage = useOperatorsStore((state) => state.setCurrentPage);
  const currentPage = useOperatorsStore((state) => state.currentPage);
  const clusterSize = useOperatorsStore((state) => state.clusterSize);
  const { inView, ref } = useInView();
  const { fetchNextPage, isFetching } = useFetchNextPage();
  useEffect(() => {
    if (inView) {
      setCurrentPage(currentPage + 1);
      fetchNextPage(currentPage + 1);
    }
  }, [inView]);

  const setSelectedOperators = useOperatorsStore((state) => state.setSelectedOperators);
  const onOperatorSelect = (operator: Operator) => {
    //check if is private first
    if (operator.is_private) {
      return;
    }
    if (selectedOperators.find((op) => op.id === operator.id)) {
      setSelectedOperators(selectedOperators.filter((op) => op.id !== operator.id));
    } else if (selectedOperators.length < clusterSize) {
      setSelectedOperators([...selectedOperators, operator]);
    }
  };
  if (isLoading) {
    return <LoadingSpinner size={32} className="my-8" />;
  }

  return (
    <div className="relative overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
      <table className="w-full table-auto border-collapse">
        <thead className="sticky top-0 bg-background z-10">
          <tr className="text-sm text-muted-foreground">
            <th className="text-left font-normal py-2 px-4">Name</th>
            <th className="text-left font-normal py-2 px-4">Validators</th>
            <th className="text-left font-normal py-2 px-4">30d Performance</th>
            <th className="text-left font-normal py-2 px-4">Yearly Fee</th>
            <th className="text-left font-normal py-2 px-4">MEV</th>
            <th className="text-left font-normal py-2 px-4">Verified</th>
            <th className="text-left font-normal py-2 px-4">DKG</th>
            <th className="px-4"></th>
          </tr>
        </thead>
        <tbody>
          {operators.map((operator) => (
            <tr
              key={operator.id}
              className={`${
                selectedOperators.find((op) => op.id === operator.id)
                  ? 'bg-primary/10'
                  : operator.is_private
                  ? 'bg-red-200/50'
                  : 'hover:bg-muted/50'
              }`}
            >
              <td className="py-2 px-4 flex items-center gap-2">
                <Checkbox
                  checked={selectedOperators.some((op) => op.id === operator.id)}
                  onCheckedChange={() => onOperatorSelect(operator)}
                />
                {operator.logo && (
                  <img
                    src={operator.logo}
                    alt={`logo for ${operator.name}`}
                    width={100}
                    height={100}
                    loading="lazy"
                    className="rounded-full w-8 h-8"
                  />
                )}
                {operator.logo === undefined ||
                  (operator.logo === '' && <div className="w-8 h-8 bg-muted rounded-full"></div>)}

                {operator.name}
              </td>
              <td className="px-4">{operator.validators_count}</td>
              <td className="px-4">{operator.performance['30d'].toFixed(2)}%</td>
              <td className="px-4">{operator.fee} SSV</td>
              <td className="px-4">0</td>
              <td className="px-4">
                {operator.type == 'verified_operator' ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <OperatorWarning message="not verified " />
                )}
              </td>
              <td className="px-4">
                {operator.dkg_address ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <OperatorWarning message="does not support dkg" />
                )}
              </td>
              <td className="text-right px-4">
                {operator.is_private ? (
                  <span className="text-xs text-muted-foreground">Private</span>
                ) : (
                  <button
                    className="text-xs text-muted-foreground hover:text-primary"
                    onClick={() => onOperatorSelect(operator)}
                  >
                    {selectedOperators.find((op) => op.id === operator.id) ? 'Remove' : 'Select'}
                  </button>
                )}
              </td>
            </tr>
          ))}
          <tr ref={ref}>
            <td colSpan={8} className="py-4">
              <LoadingSpinner size={32} className="my-8" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OperatorTable;
