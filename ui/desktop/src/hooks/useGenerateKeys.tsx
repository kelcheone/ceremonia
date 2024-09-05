import { Chain, chains, GenerateKeysForm, GenerateKeysResponse, OperatorInfo, RequestValues } from '@/types/types';
import useOperatorsStore from '@/stores/operatorsStore';
import { useState } from 'react';
import useGlobalStore from '@/stores/globalStore';
import { useNavigate } from 'react-router-dom';
export function useGenerateKeys() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const selectedOperators = useOperatorsStore((state) => state.selectedOperators);
  const { setError, setSuccess } = useGlobalStore();
  const storedChainId = localStorage.getItem('selectedChainId');
  const chain = chains.find((c) => c.id.toString() === storedChainId) || chains[0];

  let operatorIds = selectedOperators.map((operator) => operator.id);

  operatorIds = operatorIds.sort((a, b) => a - b);

  let operatorsInfo = selectedOperators.map((operator) => {
    return {
      id: operator.id,
      ip: operator.dkg_address,
      public_key: operator.public_key
    } as OperatorInfo;
  });

  // sort the operatorsInfo array by id
  operatorsInfo = operatorsInfo.sort((a, b) => a.id - b.id);

  const generateKeys = async (values: GenerateKeysForm) => {
    setIsLoading(true);
    let network = 'mainnet';
    if (chain && chain.name === 'Ethereum') {
      network = 'mainnet';
    } else {
      network = 'holesky';
    }

    const request: RequestValues = {
      validators: values.validators,
      operatorIds,
      operatorsInfo,
      ownerAddr: values.ownerAddress,
      nonce: values.validators,
      withdrawAddr: values.withdrawalAddress,
      network,
      expiry: values.expiryTime
    };

    // if any filed of the request is empty, return
    if (
      request.validators === 0 ||
      request.operatorIds.length === 0 ||
      request.operatorsInfo.length === 0 ||
      request.ownerAddr === '' ||
      request.withdrawAddr === '' ||
      request.network === ''
    ) {
      // print what field is empty
      if (request.validators === 0) {
        setError('Validators field is empty');
      }
      if (request.operatorsInfo.length === 0) {
        setError('OperatorsI not selected');
      }
      if (request.ownerAddr === '') {
        setError('connect wallet field is empty');
      }
      if (request.withdrawAddr === '') {
        setError('WithdrawAddr field is empty');
      }
      if (request.network === '') {
        setError('connect wallet');
      }

      setIsLoading(false);
      return;
    }

    const VITE_DKG_HOST = 'http://localhost:9126';
    const url = `${VITE_DKG_HOST}/api/run-dkg`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errMessage = await response.text();
        // check if the error message has the string "incorrect offset"
        if (errMessage && errMessage.includes('incorrect offset')) {
          const nMessage =
            'One of the operators you selected runs an old version of the DKG client. Please select another operator.';
          setError(nMessage);
          throw new Error(nMessage);
        } else {
          throw new Error(`HTTP error! Status: ${response.status} ${errMessage}`);
        }
      }
      const data = (await response.json()) as GenerateKeysResponse;
      const date = new Date();
      data.date = date.toISOString();
      data.selectedOperators = selectedOperators;
      const key = 'dkg-' + data.sessionId;

      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        setError('Error saving data to local storage');
      }
      setSuccess(data.message);
      // redirect to the page that shows the generated keys
      // router.push('/files');
      navigate('/files', { replace: true });
      setIsLoading(false);
    } catch (error) {
      type Error = {
        message: string;
      };
      const nError = error as Error;
      const nMessage = `Error: ${nError.message}`;
      setError(nMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { generateKeys, isLoading };
}
