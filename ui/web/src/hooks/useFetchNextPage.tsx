import useOperatorsStore from "@/stores/operatorsStore";
import { Operator } from "@/types/types";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function useFetchNextPage() {
  const [isFetching, setIsFetching] = useState(false);
  const { chain } = useAccount();
  const searchTerm = useOperatorsStore((state) => state.searchTerm);
  const filters = useOperatorsStore((state) => state.filters);
  const operators = useOperatorsStore((state) => state.operators);
  const setOperators = useOperatorsStore((state) => state.setOperators);
  let network = "mainnet";
  if (chain?.name === "Holesky") {
    network = "holesky";
  } else if (chain?.name === "Ethereum") {
    network = "mainnet";
  }

  const concatSerchTerm = (searchTerm: string) => {
    return searchTerm.replace(/ /g, "%20");
  };

  let url = `https://api.ssv.network/api/v4/${network}/operators?perPage=20&search=${concatSerchTerm(
    searchTerm
  )}`;

  if (filters.verified) {
    url += "&type=verified_operator";
  }
  if (filters.dkgEnabled) {
    url += "&has_dkg_address=true";
  }

  const fetchNextPage = async (page: number) => {
    setIsFetching(true);
    try {
      const response = await fetch(`${url}&page=${page}`);
      const data = await response.json();
      const newOperators = data.operators as Operator[];
      // if ip is http remove the operator
      newOperators.forEach((operator) => {
        if (operator.dkg_address.startsWith("http://")) {
          newOperators.splice(newOperators.indexOf(operator), 1);
        }
      });
      // filter repeated operators
      const filteredOperators = newOperators.filter(
        (operator) => !operators.some((op) => op.id === operator.id)
      );

      //dived the fee by 1e12 to get the yearly fee
      filteredOperators.forEach((operator) => {
        operator.fee = (parseFloat(operator.fee) / 1e12).toFixed(2);
      });

      setOperators([...operators, ...filteredOperators]);
      setIsFetching(false);
      return newOperators;
    } catch (error) {
      throw new Error("Error fetching operators: " + error);
    }
  };

  return { fetchNextPage, isFetching };
}
