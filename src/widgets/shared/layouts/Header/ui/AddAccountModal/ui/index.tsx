"use client";

import { FC, useEffect, useState, useRef, FormEvent } from "react";
import "./index.scss";
import { useStore } from "@/features/store";
import { useShallow } from "zustand/react/shallow";
import StellarSdk from "stellar-sdk";
import { IAccount } from "@/shared/types";

type AccountType = "Personal" | "Corporate";

const AddAccountModal: FC = () => {
  const [accountType, setAccountType] = useState<AccountType>("Personal");
  const [accountIdInput, setAccountIdInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);

  const { setIsOpenAddAccountModal, net, accounts, setAccounts, isAuth, setIsAuth } = useStore(
    useShallow(state => state)
  );

  const handleAccountTypeChange = (type: AccountType) => {
    setAccountType(type);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (StellarSdk.StrKey.isValidEd25519PublicKey(accountIdInput)) {
      if (accounts.length > 0)
        accounts.filter((account) => account.isCurrent)[0].isCurrent = false; // Удаляем текущость в текущем аккаунте
      const newAccount: IAccount = {
        id: (accounts.length+1).toString(),
        accountID: accountIdInput,
        net: net,
        isMultiSig: accountType === "Corporate",
        isCurrent: true,
      }; // Создаем новый аккаунт
      setAccounts([...accounts, newAccount]); // Добавляем новый аккаунт
      setError(""); 
      setIsOpenAddAccountModal(false); // Закрываем модалку
      setIsAuth(true); // Переводим пользователя в авторизованное состояние
    } else {
      setError("Invalid account ID");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpenAddAccountModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpenAddAccountModal]);

  return (
    <div className="add-account-container">
      <div className="add-account-container-content" ref={modalRef}>
        <form onSubmit={handleSubmit}>
          <span
            onClick={() => setIsOpenAddAccountModal(false)}
            className="add-account-container-content-close"
            aria-label="Close"
          >
            <i
              className="fa-regular fa-circle-xmark"
              style={{ fontSize: "2rem", color: "#08b5e5" }}
            />
          </span>
          <div className="add-account-container-content-buttons">
            {["Personal", "Corporate"].map((type) => (
              <button
                key={type}
                type="button"
                className={accountType === type ? "button disabled" : "button"}
                onClick={() => handleAccountTypeChange(type as AccountType)}
              >
                {type}
              </button>
            ))}
          </div>
          <div>
            <input
              type="text"
              placeholder="Account ID"
              value={accountIdInput}
              onChange={(e) => setAccountIdInput(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-center">
            <button className="button" type="submit">
              Add
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddAccountModal;
