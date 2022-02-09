import React from 'react';
import Counter from './Counter';
import MenuBar from './menu-bar/MenuBar';
import NavigationBar from './navigation-bar/NavigationBar';
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
          <NavigationBar>
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
          </NavigationBar>
        </aside>
        <main className="shadow container mt-3" style={{ zIndex: 1 }}>
          <Counter />
        </main>
      </div>
    </div>
  );
}

export default withTranslation()(Guide);
