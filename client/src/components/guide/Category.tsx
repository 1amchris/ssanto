import React from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import Topics from 'components/guide/Topics';

function Category({ t, children: category }: any) {
  return (
    <article id={category.name}>
      <h1>{capitalize(t(category.label))}</h1>
      <Topics categoryName={category.name}>{category.topics}</Topics>
    </article>
  );
}

export default withTranslation()(Category);
