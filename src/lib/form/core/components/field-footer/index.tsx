/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable import/no-cycle */
/* eslint-disable import/order */
/**
 * WordPress Dependencies
 */
import { useSelect } from "@wordpress/data";

/**
 * Internal Dependencies
 */
// @ts-expect-error types
import { css } from "emotion";
// @ts-expect-error types
import Loader from "react-loader-spinner";

import { useBlockTheme } from "../../hooks";
import { __experimentalUseFieldRenderContext } from "../field-render";

import EditableBlockFooter from "./editable";
import NonEditableBlockFooter from "./non-editable";

/**
 * External Dependencies
 */

export interface BlockFooterProps {
  shakingErr: string | null;
  isPending: boolean;
}
const BlockFooter: React.FC<BlockFooterProps> = ({
  shakingErr,
  isPending,
}: BlockFooterProps) => {
  const { id, blockName, attributes } = __experimentalUseFieldRenderContext();
  const blockTheme = useBlockTheme(attributes?.themeId);
  if (!blockName) return null;
  const { isEditable } = useSelect((select) => {
    return {
      isEditable: select("quillForms/blocks").hasBlockSupport(
        blockName,
        "editable"
      ),
    };
  });
  return (
    <div className="renderer-core-field-footer">
      {isPending ? (
        <Loader
          className={css`
            margin: 10px;
          `}
          type="TailSpin"
          color={blockTheme.answersColor}
          height={30}
          width={30}
        />
      ) : (
        <>
          {!isEditable ? (
            <NonEditableBlockFooter />
          ) : (
            <EditableBlockFooter id={id} shakingErr={shakingErr} />
          )}
        </>
      )}
    </div>
  );
};
export default BlockFooter;
