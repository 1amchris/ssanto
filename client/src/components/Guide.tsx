import React from 'react';
import Counter from './Counter';
import MenuBar from './menu-bar/MenuBar';
import { withTranslation } from 'react-i18next';
import NavigationBar from './navigation-bar/NavigationBar';
import Collapsible from './collapsible/Collapsible';

function Guide({ t }: any) {
  return (
    <div className="App">
      <header className="App-header">
        <MenuBar />
      </header>
      <div className="d-grid" style={{ gridTemplateColumns: '270px auto' }}>
        <aside>
          <NavigationBar>
            <Collapsible title={'Guide'}>
              <p style={{ textAlign: 'justify', textIndent: '2rem' }}>
                Anim pariatur cliche reprehenderit, enim eiusmod high life
                accusamus terry richardson ad squid. 3 wolf moon officia aute,
                non cupidatat skateboard dolor brunch. Food truck quinoa
                nesciunt laborum eiusmod.
              </p>
            </Collapsible>
            <Collapsible title={'Study area'}>
              <p style={{ textAlign: 'justify', textIndent: '2rem' }}>
                Anim pariatur cliche reprehenderit, enim eiusmod high life
                accusamus terry richardson ad squid. 3 wolf moon officia aute,
                non cupidatat skateboard dolor brunch. Food truck quinoa
                nesciunt laborum eiusmod.
              </p>
            </Collapsible>
            <Collapsible title={'NBS system type'}>
              <p style={{ textAlign: 'justify', textIndent: '2rem' }}>
                Anim pariatur cliche reprehenderit, enim eiusmod high life
                accusamus terry richardson ad squid. 3 wolf moon officia aute,
                nesciunt laborum eiusmod.
              </p>
            </Collapsible>
            <Collapsible title={'Objective hierarchy'}>
              <p style={{ textAlign: 'justify', textIndent: '2rem' }}>
                Anim pariatur cliche reprehenderit, enim eiusmod high life
                accusamus terry richardson ad squid. 3 wolf moon officia aute,
                non cupidatat skateboard dolor brunch. Food truck quinoa
                nesciunt laborum eiusmod.
              </p>
              <p style={{ textAlign: 'justify', textIndent: '2rem' }}>
                Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid
                single-origin coffee nulla assumenda shoreditch et. Nihil anim
                synth nesciunt you probably haven't heard of them accusamus
                labore sustainable VHS.
              </p>
            </Collapsible>
          </NavigationBar>
        </aside>
        <main className="container mt-3">
          <Counter />
        </main>
      </div>
    </div>
  );
}

export default withTranslation()(Guide);
