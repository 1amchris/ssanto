import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { FcCollapse, FcExpand } from 'react-icons/fc';
import { capitalize, uniqueId } from 'lodash';

function Collapsible({ t, title, children, collapsed }: any) {
  const id = uniqueId('collapsible-');
  const [open, setOpen] = useState(!(collapsed as boolean));

  return (
    <React.Fragment>
      <div
        className="w-100 d-flex justify-content-between"
        data-bs-toggle="collapse"
        data-bs-target={`#${id}`}
        role="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <h6>{capitalize(t(title || 'collapsible-title'))}</h6>
        <span>{open ? <FcCollapse /> : <FcExpand />}</span>
      </div>
      <div className={`collapse ${open && 'show'}`} id={id}>
        {children}
      </div>
    </React.Fragment>
  );
}

export default withTranslation()(Collapsible);
