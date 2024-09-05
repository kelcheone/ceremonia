import useOperatorsStore from "@/stores/operatorsStore";
import { Operator } from "@/types/types";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function useFetchInit() {
  const { chain } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const setOperators = useOperatorsStore((state) => state.setOperators);
  const searchTerm = useOperatorsStore((state) => state.searchTerm);
  let network = "mainnet";
  if (chain?.name === "Holesky") {
    network = "holesky";
  } else if (chain?.name === "Ethereum") {
    network = "mainnet";
  }

  const concatSerchTerm = (searchTerm: string) => {
    return searchTerm.replace(/ /g, "%20");
  };
  const fetchInitOperators = async (
    filters: { verified: boolean; dkgEnabled: boolean } = {
      verified: false,
      dkgEnabled: false,
    }
  ) => {
    setIsLoading(true);
    let url = `https://api.ssv.network/api/v4/${network}/operators?perPage=20&search=${concatSerchTerm(
      searchTerm
    )}`;
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
      // if ip is http:// not https:// remove the operator
      const filteredOperators = operators.filter(
        (operator) => !operator.dkg_address.startsWith("http://")
      );

      setOperators(filteredOperators);
      setIsLoading(false);
      return filteredOperators;
    } catch (error) {
      throw new Error("Error fetching operators");
    }
  };
  return { fetchInitOperators, isLoading };
}
