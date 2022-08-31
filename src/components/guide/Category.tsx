import React from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import Topics from 'components/guide/Topics';

/**
 * Category component.
 * @param {any} param0 Parameters for the category.
 * @return {JSX.Element} Html.
 */
function Category({ t, children: category }: any) {
  return (
    <article id={category.name}>
      <h1>{capitalize(t(category.label))}</h1>
      <Topics categoryName={category.name}>{category.topics}</Topics>
    </article>
  );
}

export default withTranslation()(Category);
