import React, { FC } from "react";
import s from "@/widgets/OperationTypes/index.module.scss";

export interface IFlag {
  id: number;
  name: string;
  points: number;
}

interface FlagSelectorProps {
  title: string;
  flags: IFlag[];
  selectedFlags: number[];
  onToggle: (flagId: number) => void;
}

const FlagSelector: FC<FlagSelectorProps> = ({
  title,
  flags,
  selectedFlags,
  onToggle,
}) => {
  const isSelected = (flagId: number) => selectedFlags.includes(flagId);

  const totalPoints = selectedFlags.reduce((sum, id) => {
    const flag = flags.find((flag) => flag.id === id);
    return sum + (flag ? flag.points : 0);
  }, 0);

  return (
    <div className={s.section}>
      <h4 className={s.sectionTitle}>
        {title} <span className={s.optional}>(optional)</span>
      </h4>
      <div className="tabs">
        <div className="tabs-header">
          <div className={s.flagsContainer}>
            <div className={s.flags}>
              {flags.map((flag) => (
                <a
                  key={flag.id}
                  onClick={(e) => {
                    e.preventDefault();
                    onToggle(flag.id);
                  }}
                  className={`tabs-item ww condensed border: none;  ${
                    isSelected(flag.id) && "selected"
                  }`}
                  style={{ cursor: "pointer", width: "140px", height: "90%"  }}
                  href="#"
                >
                  <span
                    className="tabs-item-text  "
                    style={{ fontSize: "100%" }}
                  >
                    {flag.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
        {selectedFlags.length > 0 && (
          <p>
            {selectedFlags.map((id, index) => {
              const flag = flags.find((flag) => flag.id === id);
              return flag ? (
                <React.Fragment key={id}>
                  {index > 0 && " + "}
                  <span>
                    {flag.name} ({flag.points})
                  </span>
                </React.Fragment>
              ) : null;
            })}
            {" = "}
            {totalPoints}
          </p>
        )}
        <p>
          Selected{" "}
          <a
            href="https://en.wikipedia.org/wiki/Bit_field"
            target="_blank"
            rel="noopener noreferrer"
          >
            flags
          </a>{" "}
          mean to {title.includes("Set") ? "add" : "remove"} selected flags{" "}
          {title.includes("Set") ? "in addition to" : "from"} flags already
          present on the account.
        </p>
      </div>
    </div>
  );
};

export default FlagSelector;
