import React, { ReactElement } from 'react';

/**
 * Information card component.
 * @param {any} param0 Parameters for the information card.
 * @param {string} [key] Key name.
 * @return {JSX.Element} Html.
 */
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
