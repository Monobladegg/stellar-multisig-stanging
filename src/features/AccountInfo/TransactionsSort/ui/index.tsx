import React, { FC, useEffect, useRef, useState } from "react";
import "@/shared/styles/dropdown/index.scss";
import { collapseAccount } from "@/shared/helpers";
import { Filters, filterOptions } from "@/shared/lib";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";

interface Props {
  ID: string;
}

const TransactionsSort: FC<Props> = ({ ID }) => {
  const collapseID = collapseAccount(ID);

  const { theme } = useStore(useShallow((state) => state));

  const dropdownRefFilter = useRef<HTMLDivElement>(null);

  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<Filters[] | null>(null);

  const toggleDropdownFilter = () => setIsOpenFilter(!isOpenFilter);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpenFilter) return;

      if (
        dropdownRefFilter.current &&
        !dropdownRefFilter.current.contains(event.target as Node)
      )
        setIsOpenFilter(false);
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
  }, []);

  return (
    <div className="op-filters">
      Filters{" "}
      <span title={ID} aria-label={ID}>
        <span className="account-key">{collapseID}</span>
        <div className="dropdown" ref={dropdownRefFilter}>
          <div
            className={
              theme === "day" ? "dropdown-header-light" : "dropdown-header"
            }
            onClick={toggleDropdownFilter}
          >
            <div style={{ color: "var(--color-primary)" }}>
              <span className="nowrap">
                <span>Add filter</span>
              </span>
            </div>
          </div>
          {isOpenFilter && (
            <div
              className={
                theme === "day" ? "dropdown-menu-light" : "dropdown-menu"
              }
            >
              {filterOptions.map((filter) => (
                <div
                  key={filter}
                  className={`dropdown-item${
                    theme === "night" ? "" : "-light"
                  } ${currentFilter?.includes(filter) ? "selected" : ""}`}
                  onClick={() => setCurrentFilter([filter])}
                >
                  {filter}
                </div>
              ))}
            </div>
          )}
        </div>
      </span>
    </div>
  );
};

export default TransactionsSort;
