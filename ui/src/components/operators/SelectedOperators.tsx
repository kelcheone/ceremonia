import React, { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Operator } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import useOperatorsStore from "@/stores/operatorsStore";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type SelectedOperatorsProps = {
  clusterSize: number;
};

const SelectedOperators: FC<SelectedOperatorsProps> = ({ clusterSize }) => {
  const router = useRouter();
  const selectedOperators = useOperatorsStore(
    (state) => state.selectedOperators
  );
  const setSelectedOperators = useOperatorsStore(
    (state) => state.setSelectedOperators
  );
  const onOperatorSelect = (operator: Operator) => {
    if (selectedOperators.find((op) => op.id === operator.id)) {
      setSelectedOperators(
        selectedOperators.filter((op) => op.id !== operator.id)
      );
    } else if (selectedOperators.length < clusterSize) {
      setSelectedOperators([...selectedOperators, operator]);
    }
  };
  const totalYearlyFee = selectedOperators
    .reduce((sum, operator) => sum + parseFloat(operator.fee), 0)
    .toFixed(2);
  return (
    <Card className="flex-shrink-0 w-full lg:w-1/4">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Selected Operators</h3>
          <Badge>
            {selectedOperators.length}/{clusterSize}
          </Badge>
        </div>
        <div className="space-y-4">
          {selectedOperators.map((operator) => (
            <div
              key={operator.id}
              className={`flex justify-between items-center
                         ${
                           operator.dkg_address === "" ||
                           operator.dkg_address.startsWith("http://")
                             ? "bg-red-400/50 "
                             : ""
                         } bg-muted/50
                          rounded-lg p-3`}
            >
              <div className="flex items-center gap-2">
                {operator.logo && (
                  <Image
                    src={operator.logo}
                    alt={`logo for ${operator.name}`}
                    width={100}
                    height={100}
                    loading="lazy"
                    className="rounded-full w-8 h-8"
                  />
                )}
                {operator.logo === undefined ||
                  (operator.logo === "" && (
                    <div className="w-8 h-8 bg-muted rounded-full"></div>
                  ))}
                <div>
                  <h3 className="font-medium">{operator.name}</h3>
                  <p
                    className={`text-xs ${
                      operator.dkg_address === "" ? "" : ""
                    } text-muted-foreground`}
                  >
                    Fee: {(parseFloat(operator.fee) / 1e9).toFixed(2)} SSV
                  </p>
                  {operator.dkg_address === "" && (
                    <p className="text-sm font-bold">does not support dkg</p>
                  )}
                </div>
              </div>
              <button
                className="text-xs text-muted-foreground hover:text-primary"
                onClick={() => onOperatorSelect(operator)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="text-sm font-semibold">
            Total Yearly Fee: {totalYearlyFee} SSV
          </div>
          {selectedOperators.some(
            (op) => !(op.type === "verified_operator") || operatorUsesHTTP(op)
          ) && (
            <div className="mt-4 bg-yellow-100 border border-yellow-300 rounded p-3 text-sm dark:text-gray-900 ">
              You have selected one or more operators that are not verified.
            </div>
          )}
          {selectedOperators.some((op) => operatorUsesHTTP(op)) && (
            <div className="mt-4 bg-red-100 border border-red-300 rounded p-3 text-sm dark:text-gray-900 ">
              You have selected one or more operators that use HTTP. This is not
              secure.
            </div>
          )}
        </div>
        <div className="flex w-full justify-center items-center p-2">
          <Button
            disabled={
              selectedOperators.length !== clusterSize ||
              selectedOperators.some((op) => op.dkg_address === "")
            }
            onClick={() => router.push("/join/generate")}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectedOperators;

function operatorUsesHTTP(operator: Operator) {
  // check if an operator uses HTTP not HTTPS
  return operator.dkg_address.startsWith("http://");
}
