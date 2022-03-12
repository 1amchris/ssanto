import React from 'react';
import CategoryModel from 'models/guide/CategoryModel';
import CategoryLink from './CategoryLink';

function CategoryLinks({ children: categories, style }: any) {
  return (
    <ul
      className="list-unstyled px-3 pt-2 overflow-scroll bottom-0"
      style={style}
    >
      {categories.map((category: CategoryModel) => (
        <li key={`guide/links/categories/${category.name}`} className="pb-2">
          <CategoryLink>{category}</CategoryLink>
        </li>
      ))}
    </ul>
  );
}

export default CategoryLinks;
