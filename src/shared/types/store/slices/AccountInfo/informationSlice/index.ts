import { Information } from "@/shared/types/information";
import { Net } from "../../shared";

export interface InformationState {
  information: Information;
}

export interface InformationActions {
  setInformation: (information: Information) => void;
}

export interface IInformationSlice
  extends InformationState,
    InformationActions {}

export default IInformationSlice;
