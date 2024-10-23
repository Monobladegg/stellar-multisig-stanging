"use client";

import { FC, useState, useEffect } from "react";
import "./index.scss";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";
import { ModalLayout } from "@/features";
import InputField from "@/entities/Layout/Modals/FirebaseSettingsModal/InputField";
import { initializeFirebase } from "@/shared/api/firebase/app";
import React from "react";

type FirebaseType = "Default" | "Custom";

interface FormValues {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

const FirebaseSettingsModal: FC = () => {
  const { theme, isOpenFirebaseSettingsModal, setIsOpenFirebaseSettingsModal } =
    useStore(useShallow((state) => state));

  const [currentFirebase, setCurrentFirebase] =
    useState<FirebaseType>("Default");

  const [formValues, setFormValues] = useState<FormValues>({
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "",
  });

  useEffect(() => {
    initializeFirebase(formValues).then((q) => {
      console.log("Firebase initialized", q);
    }).catch((error) => {
      console.error(error);
    })
  }, [formValues, currentFirebase]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentFirebaseLocalStorage = window.localStorage.getItem(
        "Firebase-currentFirebase"
      );

      if (currentFirebaseLocalStorage) {
        setCurrentFirebase(currentFirebaseLocalStorage as FirebaseType);
      }

      const apiKey = window.localStorage.getItem("Firebase-apiKey");
      const authDomain = window.localStorage.getItem("Firebase-authDomain");
      const projectId = window.localStorage.getItem("Firebase-projectId");
      const storageBucket = window.localStorage.getItem("Firebase-storageBucket");
      const messagingSenderId = window.localStorage.getItem(
        "Firebase-messagingSenderId"
      );
      const appId = window.localStorage.getItem("Firebase-appId");
      const measurementId = window.localStorage.getItem("Firebase-measurementId");

      if (
        currentFirebase === "Custom" &&
        apiKey &&
        authDomain &&
        projectId &&
        storageBucket &&
        messagingSenderId &&
        appId &&
        measurementId
      ) {
        setFormValues({
          apiKey,
          authDomain,
          projectId,
          storageBucket,
          messagingSenderId,
          appId,
          measurementId,
        });
      }
    }
  }, [window]);

  const changeFormValue = (key: keyof FormValues, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    window.localStorage.setItem("Firebase-" + key, value);
  };

  useEffect(() => {
    window.localStorage.setItem("Firebase-currentFirebase", currentFirebase);
  }, [currentFirebase]);

  useEffect(() => {
    if (currentFirebase === "Custom" && typeof window !== "undefined") {
      const apiKey = window.localStorage.getItem("Firebase-apiKey") || "";
      const authDomain = window.localStorage.getItem("Firebase-authDomain") || "";
      const projectId = window.localStorage.getItem("Firebase-projectId") || "";
      const storageBucket = window.localStorage.getItem("Firebase-storageBucket") || "";
      const messagingSenderId = window.localStorage.getItem(
        "Firebase-messagingSenderId"
      ) || "";
      const appId = window.localStorage.getItem("Firebase-appId") || "";
      const measurementId = window.localStorage.getItem("Firebase-measurementId") || "";

      setFormValues({
        apiKey,
        authDomain,
        projectId,
        storageBucket,
        messagingSenderId,
        appId,
        measurementId,
      });
    } else {
      setFormValues({
        apiKey: process.env.NEXT_PUBLIC_API_KEY || "",
        authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN || "",
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
        storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET || "",
        messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID || "",
        appId: process.env.NEXT_PUBLIC_APP_ID || "",
        measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID || "",
      });
    }
  }, [currentFirebase, window]);

  return (
    <ModalLayout
      isOpenModal={isOpenFirebaseSettingsModal}
      setIsOpenModal={setIsOpenFirebaseSettingsModal}
    >
      <center>
        <h3>Change Firebase</h3>
      </center>
      <form>
        <div
          className={
            theme === "night"
              ? "modal-container-content-title"
              : "modal-container-content-title-light"
          }
        >
          <div className="tabs">
            <div className="tabs-header">
              {["Default", "Custom"].map((type) => (
                <React.Fragment key={type}>
                  <Link
                    onClick={() => setCurrentFirebase(type as FirebaseType)}
                    href="#"
                    className={
                      `tabs-item condensed ` +
                      (currentFirebase === type ? "selected " : "")
                    }
                    style={{ marginInline: "10px" }}
                  >
                    <span
                      className="tabs-item-text"
                      style={{ paddingInline: "4px" }}
                    >
                      {type}
                    </span>
                  </Link>
                  {type === "Default" &&
                    formValues.authDomain ===
                      process.env.NEXT_PUBLIC_AUTH_DOMAIN && (
                      <i
                        title={`Use only for ${process.env.NEXT_PUBLIC_AUTH_DOMAIN}`}
                        className="fa-solid fa-triangle-exclamation"
                        style={{ color: "#08b5e5" }}
                      ></i>
                    )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="flex modal-container-content-form">
          {currentFirebase === "Custom" &&
            (Object.keys(formValues) as (keyof FormValues)[]).map((key) => (
              <InputField
                key={key}
                title={key}
                placeholder={key}
                value={formValues[key]}
                setValue={(value) => changeFormValue(key, value)}
              />
            ))}
        </div>
      </form>
    </ModalLayout>
  );
};

export default FirebaseSettingsModal;
