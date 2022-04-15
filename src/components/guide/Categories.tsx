import React from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize, concat } from 'lodash';
import CategoryModel from 'models/guide/CategoryModel';
import Category from 'components/guide/Category';
import { HashLink } from 'react-router-hash-link';

/**
 * Categories component.
 * @param {any} param0 Parameters for the categories.
 * @return {JSX.Element} Html.
 */
function Categories({ t, children: categories }: any) {
  return (
    <React.Fragment>
      {concat([], categories)
        .filter(category => category)
        .map((category: CategoryModel) => (
          <Category key={`categories/${category.name}`}>{category}</Category>
        ))}
      <p className="text-secondary text-center border-top pt-2">
        {capitalize(t("you've reached the end of the documentation."))}
        <br />
        <HashLink to={`#${categories[0].name}`} className="text-reset">
            {capitalize(t('Go back to the top'))}
        </HashLink>
      </p>
    </React.Fragment>
  );
}

export default withTranslation()(Categories);
