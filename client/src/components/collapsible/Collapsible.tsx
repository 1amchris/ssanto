import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { FcCollapse, FcExpand } from 'react-icons/fc';
import { uniqueId } from 'lodash';

function Collapsible({ t, title, children }: any) {
  const id = uniqueId('collapsible-');
  const [open, setOpen] = useState(true);

  return (
    <React.Fragment>
      <div
        className="w-100 d-flex justify-content-between"
        data-bs-toggle="collapse"
        data-bs-target={`#${id}`}
        role="button"
        aria-expanded="true"
        aria-controls={id}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <h5>{t(title || 'collapsible-title')}</h5>
        <span>{open ? <FcCollapse /> : <FcExpand />}</span>
      </div>
      <div className="collapse show" id={id}>
        {children}
      </div>
    </React.Fragment>
  );
}

export default withTranslation()(Collapsible);
