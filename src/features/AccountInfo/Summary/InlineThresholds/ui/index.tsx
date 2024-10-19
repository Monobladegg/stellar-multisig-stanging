import { TransactionIcon } from "@/entities";
import { useStore } from "@/shared/store";
import React, { FC } from "react";

interface InlineThresholdsProps {
  ID: string;
  isVisibleTx: boolean;
  signerWeights: number;
}
const InlineThresholds: FC<InlineThresholdsProps> = ({
  ID,
  isVisibleTx,
  signerWeights,
}) => {
  const { information } = useStore((state) => state);

  return (
    <>
      <TransactionIcon
        ID={ID}
        isVisible={isVisibleTx}
        typeIcon="Change"
        typeOp="set_options"
        operationThresholds={information?.thresholds}
      />
      <dt>Thresholds:</dt>
      <dd>
        <span title="Low threshold">
          Low{" "}
          {signerWeights > Number(information?.thresholds?.low_threshold) &&
          signerWeights !== 0 ? (
            <span title="Low threshold is unlocked, operations are permitted">
              🟢
            </span>
          ) : (
            <span title="Low threshold is locked, operations are prohibited">
              🔴
            </span>
          )}
          <span
            title={
              signerWeights > Number(information?.thresholds?.low_threshold) &&
              signerWeights !== 0
                ? "Low threshold is unlocked, operations are permitted"
                : "Low threshold is locked, operations are prohibited"
            }
          >
            {information?.thresholds?.low_threshold}
          </span>
        </span>{" "}
        /{" "}
        <span title="Medium threshold">
          Med{" "}
          {signerWeights > Number(information?.thresholds?.med_threshold) &&
          signerWeights !== 0 ? (
            <span title="Medium threshold is unlocked, operations are permitted">
              🟢
            </span>
          ) : (
            <span title="Medium threshold is locked, operations are prohibited">
              🔴
            </span>
          )}
          <span
            title={
              signerWeights > Number(information?.thresholds?.med_threshold) &&
              signerWeights !== 0
                ? "Medium threshold is unlocked, operations are permitted"
                : "Medium threshold is locked, operations are prohibited"
            }
          >
            {information?.thresholds?.med_threshold}
          </span>
        </span>{" "}
        /{" "}
        <span title="High threshold">
          High{" "}
          {signerWeights > Number(information?.thresholds?.high_threshold) &&
          signerWeights !== 0 ? (
            <span title="High threshold is unlocked, operations are permitted">
              🟢
            </span>
          ) : (
            <span title="High threshold is locked, operations are prohibited">
              🔴
            </span>
          )}
          <span
            title={
              signerWeights > Number(information?.thresholds?.high_threshold) &&
              signerWeights !== 0
                ? "High threshold is unlocked, operations are permitted"
                : "High threshold is locked, operations are prohibited"
            }
          >
            {information?.thresholds?.high_threshold}
          </span>
        </span>
        <i className="trigger icon info-tooltip small icon-help">
          <div
            className="tooltip-wrapper"
            style={{
              maxWidth: "20em",
              left: "-193px",
              top: "-86px",
            }}
          >
            <div className="tooltip top">
              <div className="tooltip-content">
                This field specifies thresholds for low-, medium-, and
                high-access level operations.
                <a
                  href="https://developers.stellar.org/docs/learn/encyclopedia/security/signatures-multisig#thresholds"
                  className="info-tooltip-link"
                  target="_blank"
                >
                  Read more…
                </a>
              </div>
            </div>
          </div>{" "}
        </i>
      </dd>
    </>
  );
};

export default InlineThresholds;
