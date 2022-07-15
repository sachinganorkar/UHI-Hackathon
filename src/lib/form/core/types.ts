import type { FormBlocks, FormMessages, FormTheme, FormLogic } from "../types";

type Theme = {
  id: number;
  properties: Partial<FormTheme>;
};
export type FormObj = {
  blocks: FormBlocks;
  themesList?: Theme[];
  theme?: Partial<FormTheme>;
  messages?: Partial<FormMessages>;
  logic?: FormLogic;
  settings?: {
    disableProgressBar?: boolean;
    disableWheelSwiping?: boolean;
    disableNavigationArrows?: boolean;
    animationDirection?: "vertical" | "horizontal";
  };
  // eslint-disable-next-line @typescript-eslint/ban-types
  hiddenFields: Object;
};

export type SubmissionDispatchers = {
  setIsSubmitting: (flag: boolean) => void;
  setIsReviewing: (flag: boolean) => void;
  goToBlock: (id: string) => void;
  setIsFieldValid: (id: string, flag: boolean) => void;
  setFieldValidationErr: (id: string, err: string) => void;
  completeForm: () => void;
  setSubmissionErr: (value: string) => void;
};
