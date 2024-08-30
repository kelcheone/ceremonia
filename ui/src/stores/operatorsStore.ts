import { Operator } from "@/types/types";
import { create } from "zustand";

type OperatorsStore = {
  currentPage: number;
  operators: Operator[];
  setCurrentPage: (currentPage: number) => void;
  selectedOperators: Operator[];
  clusterSize: number;
  filters: {
    dkgEnabled: boolean;
    verified: boolean;
  };
  isLoading: boolean;

  setOperators: (operators: Operator[]) => void;
  setSelectedOperators: (operators: Operator[]) => void;
  setClusterSize: (size: number) => void;
  setFilters: (filters: { dkgEnabled: boolean; verified: boolean }) => void;
};

const useOperatorsStore = create<OperatorsStore>((set, get) => ({
  currentPage: 1,
  operators: [],
  selectedOperators: [],
  clusterSize: 4,
  filters: {
    dkgEnabled: false,
    verified: false,
  },
  isLoading: false,

  setCurrentPage: (currentPage) => set({ currentPage }),
  // current operators + new operators
  setOperators: (operators) => set({ operators }),
  setSelectedOperators: (selectedOperators) => set({ selectedOperators }),
  setClusterSize: (clusterSize) => set({ clusterSize }),
  setFilters: (filters) => set({ filters }),
}));

export default useOperatorsStore;
