/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-extra-arguments */
/* eslint-disable no-empty */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */

/**
 * External Dependencies
 */
import { css } from "@emotion/css";
import { useSelect } from "@wordpress/data";
import { useState, useEffect, useRef, useMemo } from "@wordpress/element";
import classnames from "clsx";
import { cloneDeep } from "lodash";
import tinyColor from "tinycolor2";

import { useMessages, useBlockTheme } from "../core";

/**
 * Internal Dependencies
 */
import ChoiceItem from "./choice-item";
import CloseIcon from "./close-icon";
import DropdownIcon from "./expand-icon";

const ENTER_CODE = 13;
const ESC_CODE = 27;
const ARROW_UP_CODE = 38;
const ARROW_DOWN_CODE = 40;

// @ts-ignore
let timer;
// @ts-ignore
let timer2;
// @ts-ignore
let timer3;
// @ts-ignore
const DropdownDisplay = (props) => {
  const {
    id,
    attributes,
    setIsValid,
    setIsAnswered,
    setValidationErr,
    val,
    setVal,
    next,
    showErrMsg,
    isActive,
    isTouchScreen,
    setFooterDisplay,
    inputRef,
    isPreview,
  } = props;
  const { choices, required } = attributes;
  const theme = useBlockTheme(attributes.themeId);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(-1);
  const [clicked, setClicked] = useState(false);
  const [showCloseIcon, setShowCloseIcon] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showFixedDropdownInDom, setShowFixedDropdownInDom] = useState(false);
  const [showFDrop, setShowFDrop] = useState(false);
  const wrapperRef = useRef();
  const choicesWrappeerRef = useRef();
  const messages = useMessages();
  const answersColor = tinyColor(theme.answersColor);
  const $choices = useMemo(() => {
    return (
      cloneDeep(choices)
        // @ts-ignore
        .map((choice, index) => {
          if (!choice.label) choice.label = `Choice ${index + 1}`;
          return choice;
        })
        // @ts-ignore
        .filter((choice) =>
          choice.label
            .toLowerCase()
            .includes(val && isTouchScreen ? "" : searchKeyword.toLowerCase())
        )
    );
  }, [choices, searchKeyword]);

  const checkFieldValidation = () => {
    if (required === true && (!val || val === "")) {
      setIsValid(false);
      setValidationErr(messages["label.errorAlert.selectionRequired"]);
    } else {
      setIsValid(true);
      setValidationErr(null);
    }
  };

  const { isReviewing } = useSelect((select) => {
    return {
      isReviewing: select("quillForms/renderer-core").isReviewing(),
    };
  });

  // Handle click outside the countries dropdown
  // @ts-ignore
  const handleClickOutside = (e) => {
    // @ts-ignore
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setShowDropdown(false);
      setSelectedChoiceIndex(-1);
    }
  };

  // Attaching the previous event with UseEffect hook
  useEffect(() => {
    if (showDropdown) {
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      if (document.querySelector(`#block-${id} .renderer-core-field-footer`)) {
        // @ts-ignore
        document
          .querySelector(`#block-${id} .renderer-core-field-footer`)
          .classList.add("is-hidden");
      }
    } else if (
      document.querySelector(`#block-${id} .renderer-core-field-footer`)
    ) {
      // @ts-ignore
      document
        .querySelector(`#block-${id} .renderer-core-field-footer`)
        .classList.remove("is-hidden");
    }
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    // if change in attributes and is in preview mode, check validation
    // Note, that this effect will also be called on mount, that's why we check if isReviewing = false
    // because we want to display errors coming from server.
    // @ts-ignore
    if (isPreview || !isReviewing) checkFieldValidation(val);
  }, [val, attributes]);

  useEffect(() => {
    if (showFDrop) {
      setShowFixedDropdownInDom(showFDrop);
    } else {
      timer3 = setTimeout(() => {
        setShowFixedDropdownInDom(showFDrop);
      }, 500);
    }

    // @ts-ignore
    return () => clearTimeout(timer3);
  }, [showFDrop]);

  // @ts-ignore
  const changeHandler = (e) => {
    // show close icon of there is any string
    setShowCloseIcon(e.target.value !== "");
    setInputValue(e.target.value);
    !isTouchScreen && setShowDropdown(true);
    if (val) {
      setVal(null);
      setSearchKeyword("");
      return;
    }
    setSearchKeyword(e.target.value);
  };

  useEffect(() => {
    if (!isActive) {
      // @ts-ignore
      clearTimeout(timer);
      // @ts-ignore
      timer2 && clearTimeout(timer2);
    }
  }, [isActive]);

  useEffect(() => {
    if (val) {
      // @ts-ignore
      const selectedChoice = $choices.find((choice) => choice.value === val);
      setSearchKeyword(selectedChoice ? selectedChoice.label : "");
    }
    return () => {
      // @ts-ignore
      clearTimeout(timer);
      // @ts-ignore
      timer2 && clearTimeout(timer2);
    };
  }, []);

  // @ts-ignore
  function checkInView(container, element) {
    // Get container properties
    const cTop = container.scrollTop;
    const cBottom = cTop + container.clientHeight;

    // Get element properties
    const eTop = element.offsetTop;
    const eBottom = eTop + element.clientHeight;

    // Check if in view
    return eTop >= cTop + 10 && eBottom <= cBottom - 50;
  }

  // @ts-ignore
  const handleChoiceKeyDown = (e) => {
    if (isTouchScreen) return;
    if (e.keyCode === ESC_CODE) {
      setShowDropdown(false);
      setShowCloseIcon(inputValue !== "");
      setSelectedChoiceIndex(-1);
      return;
    }

    if (e.keyCode === ARROW_UP_CODE || e.keyCode === ARROW_DOWN_CODE) {
      const block = document.querySelector(
        `#block-${id}  .qf-block-dropdown-display__choices`
      );
      if (
        !block ||
        (selectedChoiceIndex <= 0 && e.keyCode === ARROW_UP_CODE) ||
        (selectedChoiceIndex === $choices.length - 1 &&
          e.keyCode === ARROW_DOWN_CODE)
      ) {
        return;
      }
      setShowDropdown(true);
      const newChoiceIndex =
        e.keyCode === ARROW_UP_CODE
          ? selectedChoiceIndex - 1
          : selectedChoiceIndex + 1;
      setSelectedChoiceIndex(newChoiceIndex);
      const choiceEl = document.getElementById(
        `block-${id}-option-${newChoiceIndex}`
      );
      if (!checkInView(block, choiceEl)) {
        // @ts-ignore
        block.scrollTop = choiceEl.offsetTop - 30;
      }
      return;
    }

    if (e.keyCode === ENTER_CODE) {
      e.stopPropagation();
      if (selectedChoiceIndex === -1) {
        setShowDropdown(false);
        setSelectedChoiceIndex(-1);
        return;
      }
      setClicked(true);
      // selectedChoiceIndex > 4 &&
      // 	document
      // 		.querySelector( '.qf-block-dropdown-display__choices' )
      // 		.scrollTo( 0, ( selectedChoiceIndex - 3 ) * 49 );
    }
  };

  const clickHandler = (choice = $choices[selectedChoiceIndex]) => {
    // @ts-ignore
    const selectedIndex = $choices.findIndex((c) => c.value === choice.value);
    if (selectedIndex !== selectedChoiceIndex)
      setSelectedChoiceIndex(selectedIndex);
    setClicked(false);
    setShowCloseIcon(false);
    showErrMsg(false);
    // @ts-ignore
    clearTimeout(timer);
    // @ts-ignore
    timer2 && clearTimeout(timer2);
    if (val && val === choice.value) {
      setVal(null);
      setIsAnswered(false);
      setSearchKeyword("");
      return;
    }
    setIsAnswered(true);
    setVal(choice.value);
    timer = setTimeout(
      () => {
        setSearchKeyword(choice.label);
        setShowDropdown(false);
        setSelectedChoiceIndex(-1);
        if (isTouchScreen) {
          setShowFDrop(false);
          // timer2 for showing the input after choosing value
          timer2 = setTimeout(() => {
            next();
          }, 750);
        } else {
          next();
        }
      },
      isTouchScreen ? 500 : 700
    );
  };

  return (
    <div
      // @ts-ignore
      ref={wrapperRef}
      style={{ position: "relative" }}
    >
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

              @media (max-width: 480px) {
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
        id={`dropdown-${id}`}
        placeholder={messages["block.dropdown.placeholder"]}
        onChange={changeHandler}
        value={
          val && isTouchScreen
            ? searchKeyword
            : !isTouchScreen
            ? searchKeyword
            : ""
        }
        onClick={() => {
          if (isTouchScreen) {
            setShowFDrop(true);
            inputRef.current.blur();
          } else {
            setShowDropdown(true);
          }
        }}
        onFocus={() => {
          if (isTouchScreen) {
            setFooterDisplay(false);
          }
        }}
        onBlur={() => {
          if (isTouchScreen) {
            setFooterDisplay(true);
          }
        }}
        onKeyDown={handleChoiceKeyDown}
        autoComplete="off"
      />
      {(val && val.length > 0) || (showCloseIcon && !isTouchScreen) ? (
        <CloseIcon
          onClick={() => {
            // @ts-ignore
            clearTimeout(timer);
            // @ts-ignore
            timer2 && clearTimeout(timer2);
            setSearchKeyword("");
            setIsAnswered(false);
            setVal(undefined);
            setShowCloseIcon(false);
            if (!isTouchScreen) {
              inputRef.current.focus();
            }
          }}
        />
      ) : (
        <DropdownIcon
          style={{
            transform: `${showDropdown ? "rotate(180deg)" : "rotate(0deg)"}`,
          }}
          onClick={() => {
            showDropdown && setSelectedChoiceIndex(-1);
            isTouchScreen && setShowFDrop(!showFDrop);
            !isTouchScreen && setShowDropdown(!showDropdown);
            inputRef.current.focus();
          }}
          // @ts-ignore
          onKeyDown={(e) => {
            if (e.keyCode === ENTER_CODE) {
              e.stopPropagation();
              showDropdown && setSelectedChoiceIndex(-1);
              isTouchScreen && setShowFDrop(!showFDrop);
              !isTouchScreen && setShowDropdown(!showDropdown);
              !showDropdown && inputRef.current.focus();
            } else {
              // empty else
            }
          }}
        />
      )}

      {showDropdown && (
        <div
          className={classnames("qf-block-dropdown-display__choices", {
            visible: showDropdown,
          })}
          // @ts-ignore
          ref={choicesWrappeerRef}
          onWheel={(e) => {
            if (showDropdown) {
              e.stopPropagation();
            }
          }}
        >
          {$choices?.length > 0 ? (
            // @ts-ignore
            $choices.map((choice, index) => {
              return (
                <ChoiceItem
                  blockId={id}
                  choiceIndex={index}
                  hovered={index === selectedChoiceIndex}
                  clicked={index === selectedChoiceIndex && clicked}
                  // @ts-ignore
                  role="presentation"
                  key={`block-dropdown-${id}-choice-${choice.value}`}
                  clickHandler={() => clickHandler(choice)}
                  choice={choice}
                  val={val}
                  showDropdown={showDropdown}
                />
              );
            })
          ) : (
            <div
              className={css`
                background: ${theme.errorsBgColor};
                color: ${theme.errorsFontColor};
                display: inline-block;
                padding: 5px 10px;
                border-radius: 5px;
              `}
            >
              {messages["block.dropdown.noSuggestions"]}
            </div>
          )}
        </div>
      )}

      {showFixedDropdownInDom && (
        <div
          className={classnames("fixed-dropdown", {
            show: showFDrop,
            hide: !showFDrop,
          })}
        >
          <div
            className={classnames(
              css`
                display: flex;
                align-items: center;
              `
            )}
          >
            <svg
              onClick={() => {
                setShowFDrop(false);
              }}
              className="back-icon"
              focusable="false"
              viewBox="0 0 16 16"
              aria-hidden="true"
              role="presentation"
            >
              <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
            </svg>
            <input
              className={classnames(
                css`
                  & {
                    width: 100%;
                    border: none;
                    outline: none;
                    font-size: 30px;
                    padding-bottom: 8px;
                    background: transparent;
                    margin-bottom: 10px;
                    transition: box-shadow 0.1s 0s;
                    box-shadow: ease-out
                      ${answersColor.setAlpha(0.3).toString()} 0px 1px;
                    @media (max-width: 600px) {
                      font-size: 24px;
                    }

                    @media (max-width: 480px) {
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
              placeholder={messages["block.dropdown.placeholder"]}
              onChange={changeHandler}
              value={searchKeyword}
              onFocus={() => {
                setFooterDisplay(false);
              }}
              onBlur={() => {
                setFooterDisplay(true);
              }}
              onKeyDown={handleChoiceKeyDown}
              autoComplete="off"
            />
          </div>
          <div
            className="qf-block-dropdown-display__choices fixed-choices visible"
            // @ts-ignore
            ref={choicesWrappeerRef}
            onWheel={(e) => {
              if (showFixedDropdownInDom) {
                e.stopPropagation();
              }
            }}
          >
            {$choices?.length > 0 ? (
              // @ts-ignore
              $choices.map((choice, index) => {
                return (
                  <ChoiceItem
                    hovered={index === selectedChoiceIndex}
                    choiceIndex={index}
                    blockId={id}
                    clicked={index === selectedChoiceIndex && clicked}
                    // @ts-ignore
                    role="presentation"
                    key={`block-dropdown-${id}-choice-${choice.value}`}
                    clickHandler={() => clickHandler(choice)}
                    choice={choice}
                    val={val}
                    showDropdown={showDropdown}
                  />
                );
              })
            ) : (
              <div
                className={css`
                  background: ${theme.errorsBgColor};
                  color: ${theme.errorsFontColor};
                  display: inline-block;
                  padding: 5px 10px;
                  border-radius: 5px;
                `}
              >
                {messages["block.dropdown.noSuggestions"]}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default DropdownDisplay;
