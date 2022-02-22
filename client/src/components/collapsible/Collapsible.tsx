import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { FcCollapse, FcExpand } from 'react-icons/fc';
import { capitalize, uniqueId } from 'lodash';
import { Collapse, Button } from 'react-bootstrap';

function Collapsible({ t, title, children, collapsed = false }: any) {
  const id = uniqueId('collapsible-');
  const [open, setOpen] = useState(!(collapsed as boolean));

  return (
    <React.Fragment>
      <Button
        size="sm"
        variant="none"
        className="w-100 px-0 mb-1 d-flex justify-content-between"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <h6 className="mb-0">{capitalize(t(title || 'collapsible-title'))}</h6>
        <span>{open ? <FcCollapse /> : <FcExpand />}</span>
      </Button>
      <Collapse in={open}>
        <div>{children}</div>
      </Collapse>
    </React.Fragment>
  );
}

export default withTranslation()(Collapsible);
