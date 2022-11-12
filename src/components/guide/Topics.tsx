import React from 'react';
import { withTranslation } from 'react-i18next';
import { concat } from 'lodash';
import TopicModel from 'models/advisor/TopicModel';
import Topic from 'components/guide/Topic';

/**
 * Topics component.
 * @param {any} param0 Parameters for the topics.
 * @return {JSX.Element} Html.
 */
function Topics({ categoryName, children: topics }: any) {
  return (
    <React.Fragment>
      {concat([], topics).map((topic: TopicModel) => (
        <Topic
          id={`${categoryName}/${topic.name}`}
          key={`categories/${categoryName}/${topic.name}`}
        >
          {topic}
        </Topic>
      ))}
    </React.Fragment>
  );
}

export default withTranslation()(Topics);
