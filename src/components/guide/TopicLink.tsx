import React from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import { HashLink } from 'react-router-hash-link';

/**
 * Topic link component.
 * @param {any} param0 Parameters for the topic link.
 * @return {JSX.Element} Html.
 */
function TopicLink({ t, categoryName, children: topic }: any) {
  return (
    <HashLink
      to={`#${categoryName}/${topic.name}`}
      className="text-reset text-decoration-none"
    >
      {capitalize(t(topic.label))}
    </HashLink>
  );
}

export default withTranslation()(TopicLink);
