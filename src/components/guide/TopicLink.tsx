import { withTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import { HashLink } from 'react-router-hash-link';

function TopicLink({ t, categoryName, children: topic }: any) {
  return (
    <HashLink to={`#${categoryName}/${topic.name}`}
      className="text-reset text-decoration-none"
    >
      {capitalize(t(topic.label))}
    </HashLink>
  );
}

export default withTranslation()(TopicLink);
