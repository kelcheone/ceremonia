import {
  GenerateKeysForm,
  GenerateKeysResponse,
  OperatorInfo,
  RequestValues,
} from "@/types/types";
import { useAccount } from "wagmi";
import useOperatorsStore from "@/stores/operatorsStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useGlobalStore from "@/stores/globalStore";
export function useGenerateKeys() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { address, chain } = useAccount();
  const selectedOperators = useOperatorsStore(
    (state) => state.selectedOperators
  );
  const { setError, setSuccess } = useGlobalStore();

  const operatorIds = selectedOperators.map((operator) => operator.id);

  let operatorsInfo = selectedOperators.map((operator) => {
    return {
      id: operator.id,
      ip: operator.dkg_address,
      public_key: operator.public_key,
    } as OperatorInfo;
  });

  const generateKeys = async (values: GenerateKeysForm) => {
    setIsLoading(true);
    let network = "mainnet";
    if (chain && chain.name === "Ethereum") {
      network = "mainnet";
    } else {
      network = "holesky";
    }

    const request: RequestValues = {
      validators: values.validators,
      operatorIds,
      operatorsInfo,
      ownerAddr: address?.toString() || "",
      nonce: values.validators,
      withdrawAddr: values.withdrawalAddress,
      network,
      expiry: values.expiryTime,
    };

    // if any filed of the request is empty, return
    if (
      request.validators === 0 ||
      request.operatorIds.length === 0 ||
      request.operatorsInfo.length === 0 ||
      request.ownerAddr === "" ||
      request.withdrawAddr === "" ||
      request.network === ""
    ) {
      // print what field is empty
      if (request.validators === 0) {
        setError("Validators field is empty");
      }
      if (request.operatorsInfo.length === 0) {
        setError("OperatorsI not selected");
      }
      if (request.ownerAddr === "") {
        setError("connect wallet field is empty");
      }
      if (request.withdrawAddr === "") {
        setError("WithdrawAddr field is empty");
      }
      if (request.network === "") {
        setError("connect wallet");
      }

      setIsLoading(false);
      return;
    }

    const DKG_HOST = process.env.NEXT_PUBLIC_DKG_HOST;
    const url = `${DKG_HOST}/api/run-dkg`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        // Handle HTTP errors
        setError("HTTP error");
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = (await response.json()) as GenerateKeysResponse;
      const date = new Date();
      data.date = date.toISOString();
      data.selectedOperators = selectedOperators;
      const key = "dkg-" + data.sessionId;

      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        setError("Error saving data to local storage");
      }
      setSuccess("Keys generated successfully");
      // redirect to the page that shows the generated keys
      router.push("/files");
    } catch (error) {
      setError("Error generating keys");
    } finally {
      setIsLoading(false);
    }
  };

  return { generateKeys, isLoading };
}
