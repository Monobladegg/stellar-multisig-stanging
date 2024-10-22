// src/widgets/Layout/Modals/FirebaseSettingsModal/ui/index.tsx
"use client";

import { FC, useState, useEffect, useMemo, useCallback } from "react";
import "./index.scss";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";
import { ModalLayout } from "@/features";
import InputField from "@/entities/Layout/Modals/FirebaseSettingsModal/InputField";
import { initializeFirebase } from "@/shared/api/firebase/app";
import React from "react";
import { FirebaseApp, FirebaseOptions } from "firebase/app"; // Import FirebaseApp and FirebaseOptions types

type FirebaseType = "Default" | "Custom";

interface FormValues {
  [key: string]: string;
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

const FirebaseSettingsModal: FC = () => {
  // Initialize state with default values
  const [currentFirebase, setCurrentFirebase] = useState<FirebaseType>("Default");
  const [formValues, setFormValues] = useState<FormValues>({
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "",
  });

  // Retrieve necessary state from the store
  const { theme, isOpenFirebaseSettingsModal, setIsOpenFirebaseSettingsModal } =
    useStore(useShallow((state) => state));

  // Populate state from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const apiKey = localStorage.getItem("Firebase-apiKey");
      if (apiKey) {
        setCurrentFirebase("Custom");
        setFormValues({
          apiKey: apiKey,
          authDomain: localStorage.getItem("Firebase-authDomain") || "",
          projectId: localStorage.getItem("Firebase-projectId") || "",
          storageBucket: localStorage.getItem("Firebase-storageBucket") || "",
          messagingSenderId: localStorage.getItem("Firebase-messagingSenderId") || "",
          appId: localStorage.getItem("Firebase-appId") || "",
          measurementId: localStorage.getItem("Firebase-measurementId") || "",
        });
      }
    }
  }, []);

  // Function to update form values and save them to localStorage
  const changeFormValue = useCallback((key: keyof FormValues, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    window.localStorage.setItem("Firebase-" + key, value);
  }, []);

  // Define firebaseConfig using useMemo to memoize the configuration object
  const firebaseConfig: FirebaseOptions = useMemo(() => {
    return currentFirebase === "Custom"
      ? {
          apiKey: formValues.apiKey || process.env.NEXT_PUBLIC_API_KEY || "",
          authDomain: formValues.authDomain || process.env.NEXT_PUBLIC_AUTH_DOMAIN || "",
          projectId: formValues.projectId || process.env.NEXT_PUBLIC_PROJECT_ID || "",
          storageBucket: formValues.storageBucket || process.env.NEXT_PUBLIC_STORAGE_BUCKET || "",
          messagingSenderId:
            formValues.messagingSenderId || process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID || "",
          appId: formValues.appId || process.env.NEXT_PUBLIC_APP_ID || "",
          measurementId: formValues.measurementId || process.env.NEXT_PUBLIC_MEASUREMENT_ID || "",
        }
      : {
          // Use only environment variables for "Default"
          apiKey: process.env.NEXT_PUBLIC_API_KEY || "",
          authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN || "",
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
          storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET || "",
          messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID || "",
          appId: process.env.NEXT_PUBLIC_APP_ID || "",
          measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID || "",
        };
  }, [currentFirebase, formValues]);

  // useEffect with debounce to update Firebase configuration on form changes
  useEffect(() => {
    // Set a debounce timer to prevent rapid re-initializations
    const debounceTimer = setTimeout(() => {
      // Initialize Firebase with the new configuration
      initializeFirebase(firebaseConfig)
        .then((app: FirebaseApp) => {
          console.log(
            `Firebase re-initialized with ${
              currentFirebase === "Custom" ? "custom" : "default"
            } configuration:`,
            app.name
          );
        })
        .catch((error: Error) => {
          console.error("Failed to re-initialize Firebase:", error);
        });
    }, 500); // 500ms debounce delay

    // Clear the timer if dependencies change before the timeout completes
    return () => clearTimeout(debounceTimer);
  }, [firebaseConfig, currentFirebase]);

  // Clear localStorage when switching to "Default"
  useEffect(() => {
    if (currentFirebase === "Default") {
      // Clear custom Firebase settings from localStorage
      Object.keys(formValues).forEach((key) => {
        window.localStorage.removeItem("Firebase-" + key);
      });
      // Reset formValues to default
      setFormValues({
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
        measurementId: "",
      });
    }
  }, [currentFirebase]);

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
                  {/* Warning about authDomain when Default is selected */}
                  {type === "Default" &&
                    firebaseConfig.authDomain === process.env.NEXT_PUBLIC_AUTH_DOMAIN && (
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
            Object.keys(formValues).map((key) => (
              <InputField
                key={key}
                title={key}
                placeholder={key}
                value={formValues[key]}
                setValue={(value) =>
                  changeFormValue(key as keyof FormValues, value)
                }
              />
            ))}
        </div>
      </form>
    </ModalLayout>
  );
};

export default FirebaseSettingsModal;
