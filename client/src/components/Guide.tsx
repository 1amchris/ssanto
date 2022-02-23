import React from 'react';
import MenuBar from './menu-bar/MenuBar';
import FormsBar from './forms-bar/FormsBar';
import { withTranslation } from 'react-i18next';
import { FcPrevious } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { capitalize } from 'lodash';

function Guide({ t }: any) {
  return (
    <div className="App">
      <header className="App-header">
        <MenuBar />
      </header>
      <div className="d-grid" style={{ gridTemplateColumns: '270px auto' }}>
        <aside>
          <FormsBar>
            <Link to="/" className="text-decoration-none text-muted small">
              <FcPrevious className="me-1" />
              <span>{capitalize(t('return'))}</span>
            </Link>
            <h5>Documentation</h5>
            <ul className="list-unstyled ms-3">
              {[
                'home',
                'getting started',
                'managing results',
                'building a model',
                'getting analytics',
                'personalization',
                'monte carlo analysis',
              ].map((category: string, index: number) => (
                <li key={`guide/category-${index}`}>
                  {capitalize(t(category))}
                </li>
              ))}
            </ul>
          </FormsBar>
        </aside>
        <main className="shadow container mt-3" style={{ zIndex: 1 }}>
          This is a guide :)
        </main>
      </div>
    </div>
  );
}

export default withTranslation()(Guide);
