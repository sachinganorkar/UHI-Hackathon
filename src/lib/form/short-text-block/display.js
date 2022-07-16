/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable import/order */
/**
 * QuillForms Dependencies
 */
import { css } from "@emotion/css";

import { useEffect } from "@wordpress/element";

/**
 * External Dependencies
 */
import classnames from "clsx";
import tinyColor from "tinycolor2";

import { useMessages, useBlockTheme } from "../core";

// @ts-ignore
const ShortTextOutput = (props) => {
  const {
    id,
    attributes,
    setIsValid,
    setIsAnswered,
    setValidationErr,
    showNextBtn,
    blockWithError,
    val,
    setVal,
    showErrMsg,
    inputRef,
    isTouchScreen,
    setFooterDisplay,
  } = props;
  const messages = useMessages();
  const theme = useBlockTheme(attributes.themeId);
  const answersColor = tinyColor(theme.answersColor);

  const { maxCharacters, setMaxCharacters, required } = attributes;

  // @ts-ignore
  const checkfieldValidation = (value) => {
    if (required === true && (!value || value === "")) {
      setIsValid(false);
      setValidationErr(messages["label.errorAlert.required"]);
    } else if (
      setMaxCharacters &&
      maxCharacters > 0 &&
      value?.length > maxCharacters
    ) {
      setIsValid(false);
      setValidationErr(messages["label.errorAlert.maxCharacters"]);
    } else {
      setIsValid(true);
      setValidationErr(null);
    }
  };

  useEffect(() => {
    checkfieldValidation(val);
  }, [attributes]);

  // @ts-ignore
  const changeHandler = (e) => {
    const { value } = e.target;
    if (setMaxCharacters && maxCharacters > 0 && value.length > maxCharacters) {
      blockWithError(messages["label.errorAlert.maxCharacters"]);
    } else {
      setVal(value);
      showErrMsg(false);
      checkfieldValidation(value);
    }
    if (value && value !== "") {
      setIsAnswered(true);
      showNextBtn(true);
    } else {
      setIsAnswered(false);
      showNextBtn(false);
    }
  };

  return (
    <input
      ref={inputRef}
      className={classnames(
        css`
          & {
            width: 100%;
            border: none;
            outline: none;
            font-size: 30px;
            padding-bottom: 8px;
            background: transparent;
            transition: box-shadow 0.1s 0s;
            box-shadow: ease-out ${answersColor.setAlpha(0.3).toString()} 0px
              1px;
            @media (max-width: 600px) {
              font-size: 24px;
            }
            @media (max-width: 400px) {
              font-size: 20px;
            }
          }

          &::placeholder {
            opacity: 0.3;
            /* Chrome, Firefox, Opera, Safari 10.1+ */
            color: ${theme.answersColor};
          }

          &:-ms-input-placeholder {
            opacity: 0.3;
            /* Internet Explorer 10-11 */
            color: ${theme.answersColor};
          }

          &::-ms-input-placeholder {
            opacity: 0.3;
            /* Microsoft Edge */
            color: ${theme.answersColor};
          }

          &:focus {
            box-shadow: ${answersColor.setAlpha(1).toString()} 0px 2px;
          }

          color: ${theme.answersColor};
        `
      )}
      id={`short-text-${id}`}
      placeholder={messages["block.shortText.placeholder"]}
      onChange={changeHandler}
      value={val ? val.toString() : ""}
      onFocus={() => {
        if (isTouchScreen) {
          // @ts-ignore
          setFooterDisplay(false);
        }
      }}
      onBlur={() => {
        if (isTouchScreen) {
          // @ts-ignore
          setFooterDisplay(true);
        }
      }}
      autoComplete="off"
    />
  );
};
export default ShortTextOutput;
