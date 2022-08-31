import React from 'react';
import Collapsible from 'components/Collapsible';
import TopicLinks from 'components/guide/TopicLinks';

/**
 * Category link component.
 * @param {any} param0 Parameters for the category link.
 * @return {JSX.Element} Html.
 */
function CategoryLink({ children: category, collapsed = true }: any) {
  return (
    <Collapsible collapsed={collapsed} title={category.label}>
      <TopicLinks categoryName={category.name}>{category.topics}</TopicLinks>
    </Collapsible>
  );
}

export default CategoryLink;
