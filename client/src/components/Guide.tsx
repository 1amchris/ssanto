import React from 'react';
import { withTranslation } from 'react-i18next';
import { FcPrevious } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { capitalize } from 'lodash';
import MenuBar from 'components/menu-bar/MenuBar';
import ReactMarkdown from 'react-markdown';

function Guide({ t }: any) {
  const markdown = `A paragraph with *emphasis* and **strong importance**.

  > A block quote with \`a little bit of code\` and a URL: https://reactjs.org.
  
  * Lists
  * [ ] todo
  * [x] done
  
  A table:
  
  | a | b |
  | - | - |
  `;

  const categories = [
    'home',
    'getting started',
    'managing results',
    'building a model',
    'getting analytics',
    'personalization',
    'monte carlo analysis',
  ];

  const children = [
    <Link to="/" className="text-decoration-none text-muted small">
      <FcPrevious className="me-1" />
      <span>{capitalize(t('return'))}</span>
    </Link>,
    <h5>Documentation</h5>,
    <ul className="list-unstyled ms-3">
      {categories.map((category: string, index: number) => (
        <li key={`guide/category-${index}`}>
          <a href={`#${category}`} className="text-reset text-decoration-none">
            {capitalize(t(category))}
          </a>
        </li>
      ))}
    </ul>,
  ];

  return (
    <div className="Guide">
      <header className="Guide-header">
        <MenuBar />
      </header>
      <div
        className="d-grid"
        style={{
          gridTemplateColumns: '270px auto',
          height: 'calc(100vh - 24px)',
        }}
      >
        <aside className="h-100">
          <nav className={`border-end bg-light overflow-scroll h-100`}>
            <ul className="list-unstyled m-3">
              {children.map((child, index: number) => (
                <li
                  key={`navigation/item-${index}`}
                  className="pb-2 border-bottom mb-2"
                >
                  {child}
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main
          className="shadow container overflow-scroll"
          style={{ zIndex: 1, height: 'calc(100vh - 24px)' }}
        >
          {categories.map((category: any) => (
            <article id={category} key={`category/${category}`}>
              <h1>{category}</h1>
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </article>
          ))}
        </main>
      </div>
    </div>
  );
}

export default withTranslation()(Guide);
