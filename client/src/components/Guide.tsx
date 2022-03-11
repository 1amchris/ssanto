import React from 'react';
import { withTranslation } from 'react-i18next';
import { FcPrevious } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { capitalize, concat } from 'lodash';
import MenuBar from 'components/menu-bar/MenuBar';
import ReactMarkdown from 'react-markdown';
import Collapsible from './collapsible/Collapsible';
import categories, { CategoryModel, TopicModel } from 'data/categories';

function Code({ children }: any) {
  return (
    <code className="bg-light px-1 rounded border d-inline-block">
      {children}
    </code>
  );
}

const markdownOptions = {
  components: {
    code: Code,
  },
};

const TopicLink = withTranslation()(
  ({ t, categoryName, children: topic }: any) => {
    return (
      <a
        href={`#${categoryName}/${topic.name}`}
        className="text-reset text-decoration-none"
      >
        {capitalize(t(topic.label))}
      </a>
    );
  }
);

function TopicLinks({ categoryName, children: topics }: any) {
  return (
    <ul className="list-unstyled ps-2">
      {concat([], topics).map((topic: TopicModel) => (
        <li key={`guide/links/categories/${categoryName}/${topic.name}`}>
          <TopicLink categoryName={categoryName}>{topic}</TopicLink>
        </li>
      ))}
    </ul>
  );
}

function CategoryLink({ children: category }: any) {
  return (
    <Collapsible collapsed title={category.label}>
      <TopicLinks categoryName={category.name}>{category.topics}</TopicLinks>
    </Collapsible>
  );
}

function CategoryLinks({ children: categories }: any) {
  return (
    <ul className="list-unstyled px-3 pt-2 overflow-scroll bottom-0">
      {categories.map((category: CategoryModel) => (
        <li key={`guide/links/categories/${category.name}`} className="pb-2">
          <CategoryLink>{category}</CategoryLink>
        </li>
      ))}
    </ul>
  );
}

const Topic = withTranslation()(({ t, id, children: topic }: any) => {
  return (
    <section id={id}>
      <h2>{capitalize(t(topic.label))}</h2>
      <ReactMarkdown {...markdownOptions}>{topic.content}</ReactMarkdown>
    </section>
  );
});

const Categories = withTranslation()(({ t, children: categories }: any) => {
  return (
    <React.Fragment>
      {concat([], categories)
        .filter(category => category)
        .map((category: CategoryModel, index: number) => (
          <article id={category.name} key={`categories/${category.name}`}>
            <h1>{capitalize(t(category.label || `category ${index}`))}</h1>
            {concat([], category.topics).map((topic: TopicModel) => (
              <Topic
                id={`${category.name}/${topic.name}`}
                key={`categories/${category.name}/${topic.name}`}
              >
                {topic}
              </Topic>
            ))}
          </article>
        ))}
      <p className="text-secondary text-center border-top pt-2">
        {capitalize(t("you've reached the end of the documentation."))}
        <br />
        <a href={`#${categories[0].name}`} className="text-reset">
          {capitalize(t('Go back to the top'))}
        </a>
      </p>
    </React.Fragment>
  );
});

function Guide({ t }: any) {
  return (
    <div className="Guide">
      <header className="Guide-header">
        <MenuBar />
      </header>
      <div
        className="d-grid position-relative"
        style={{
          gridTemplateColumns: '270px auto',
          height: 'calc(100vh - 24px)',
        }}
      >
        <aside className="h-100 bg-light border-end">
          <nav>
            <ul className="list-unstyled py-3 mb-0">
              {[
                <Link to="/" className="text-decoration-none text-muted small">
                  <FcPrevious className="me-1" />
                  <span>{capitalize(t('return'))}</span>
                </Link>,
                categories.length > 0 && (
                  <CategoryLinks>{categories}</CategoryLinks>
                ),
              ]
                .filter(children => children)
                .map((child, index: number) => (
                  <li
                    key={`navigation/item-${index}`}
                    className="ps-3 pb-2 border-bottom"
                  >
                    {child}
                  </li>
                ))}
            </ul>
          </nav>
        </aside>
        <main
          className="shadow container overflow-scroll p-3"
          style={{
            zIndex: 1,
            height: 'calc(100vh - 24px)',
            scrollBehavior: 'smooth',
          }}
        >
          {categories.length > 0 ? (
            <Categories>{categories}</Categories>
          ) : (
            <p className="text-secondary text-center pt-4">
              {capitalize(
                t("There's currently nothing here. Check back later")
              )}
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

export default withTranslation()(Guide);
