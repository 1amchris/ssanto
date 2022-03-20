import React from 'react';
import { concat } from 'lodash';
import TopicModel from 'models/guide-models/TopicModel';
import TopicLink from 'components/guide/TopicLink';

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

export default TopicLinks;
