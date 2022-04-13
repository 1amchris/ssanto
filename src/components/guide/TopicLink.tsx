import React from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize } from 'lodash';

function TopicLink({ t, categoryName, children: topic }: any) {
  return (
    <a
      href={`#${categoryName}/${topic.name}`}
      className="text-reset text-decoration-none"
    >
      {capitalize(t(topic.label))}
    </a>
  );
}

export default withTranslation()(TopicLink);
