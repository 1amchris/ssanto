import React, { ReactElement } from 'react';

function InformationCard({ title, children, className }: any, key?: string) {
  return (
    <article key={key} className={`card mb-2 ${className ? className : ''}`}>
      {[].concat(children).map((child: ReactElement, index: number) => (
        <section key={`data/${title}/child-${index}`} className="card-body">
          {child}
        </section>
      ))}
    </article>
  );
}

export default InformationCard;
