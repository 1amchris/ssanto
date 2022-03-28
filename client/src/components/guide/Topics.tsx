import React from 'react';
import { withTranslation } from 'react-i18next';
import { concat } from 'lodash';
import TopicModel from 'models/guide/TopicModel';
import Topic from 'components/guide/Topic';

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
