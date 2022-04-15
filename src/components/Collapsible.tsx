import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { FcCollapse, FcExpand } from 'react-icons/fc';
import { FiInfo } from 'react-icons/fi';
import { capitalize, uniqueId } from 'lodash';
import { Collapse, Button } from 'react-bootstrap';
import { HashLink } from 'react-router-hash-link';

/**
 * Collapsible component.
 * It is used as a section in the side bar.
 * @param {any} param0 Parameters for the collapsible.
 * @return {JSX.Element} Html.
 */
function Collapsible({
  t,
  title,
  children,
  guideHash = '',
  collapsed = false,
  disabled = false,
}: any) {
  const id = uniqueId('collapsible-');
  const [open, setOpen] = useState(!(collapsed as boolean) && !disabled);

  return (
    <React.Fragment>
      <Button
        size="sm"
        variant="none"
        className="w-100 px-0 mb-1 d-flex justify-content-between"
        aria-expanded={open}
        aria-controls={id}
        disabled={disabled}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <h6 className="mb-0">
          {capitalize(t(title || 'collapsible-title'))}{' '}
          {guideHash?.length > 0 && (
            <HashLink to={`/guide#${guideHash}`}>
              <FiInfo />
            </HashLink>
          )}
        </h6>
        <span>{open ? <FcCollapse /> : <FcExpand />}</span>
      </Button>
      <Collapse in={open}>
        <div>{children}</div>
      </Collapse>
    </React.Fragment>
  );
}

export default withTranslation()(Collapsible);
