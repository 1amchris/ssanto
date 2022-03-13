import React from 'react';
import Collapsible from 'components/collapsible/Collapsible';
import TopicLinks from 'components/guide/TopicLinks';

function CategoryLink({ children: category, collapsed = true }: any) {
  return (
    <Collapsible collapsed={collapsed} title={category.label}>
      <TopicLinks categoryName={category.name}>{category.topics}</TopicLinks>
    </Collapsible>
  );
}

export default CategoryLink;
