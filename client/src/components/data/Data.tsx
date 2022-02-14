import React, { ReactElement } from 'react';

function Data({ title, children, className }: any, key?: string) {
  return (
    <article key={key} className={`${className} card mb-2`}>
      {[].concat(children).map((child: ReactElement, index: number) => (
        <section key={`data/${title}/child-${index}`} className="card-body">
          {child}
        </section>
      ))}
    </article>
  );
}

export default Data;
