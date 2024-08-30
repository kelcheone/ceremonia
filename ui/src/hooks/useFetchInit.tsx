import useOperatorsStore from "@/stores/operatorsStore";
import { Operator } from "@/types/types";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function useFetchInit() {
  const { chain } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const setOperators = useOperatorsStore((state) => state.setOperators);
  let network = "mainnet";
  if (chain?.name === "Holesky") {
    network = "holesky";
  } else if (chain?.name === "Ethereum") {
    network = "mainnet";
  }
  const fetchInitOperators = async (
    filters: { verified: boolean; dkgEnabled: boolean } = {
      verified: false,
      dkgEnabled: false,
    },
  ) => {
    setIsLoading(true);
    let url = `https://api.ssv.network/api/v4/${network}/operators?perPage=20`;
    if (filters.verified) {
      url += "&type=verified_operator";
    }
    if (filters.dkgEnabled) {
      url += "&has_dkg_address=true";
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      const operators = data.operators as Operator[];
      operators.forEach((operator) => {
        operator.fee = (parseFloat(operator.fee) / 1e12).toFixed(2);
      });
      // if ip is http remove the operator
      operators.forEach((operator) => {
        if (operator.dkg_address.startsWith("http://")) {
          operators.splice(operators.indexOf(operator), 1);
        }
      });

      setOperators(operators);
      setIsLoading(false);
      return operators;
    } catch (error) {
      throw new Error("Error fetching operators");
    }
  };
  return { fetchInitOperators, isLoading };
}
