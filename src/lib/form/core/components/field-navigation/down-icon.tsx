/**
 * External Dependencies
 */
import { css } from "emotion";

/**
 * Internal Dependencies
 */
import { useCurrentTheme } from "../../hooks";

const DownIcon = () => {
  const theme = useCurrentTheme();
  return (
    <svg
      stroke="currentColor"
      className={css`
        fill: ${theme.buttonsFontColor};
      `}
      strokeWidth="0"
      viewBox="0 0 20 20"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default DownIcon;
