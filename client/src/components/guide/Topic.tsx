import React from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import ReactMarkdown from 'react-markdown';

const markdownOptions = {
  components: {
    code: ({ children }: any) => (
      <code className="bg-light px-1 rounded border d-inline-block">
        {children}
      </code>
    ),
  },
};

function Topic({ t, id, children: topic }: any) {
  return (
    <section id={id}>
      <h2>{capitalize(t(topic.label))}</h2>
      <ReactMarkdown {...markdownOptions}>{topic.content}</ReactMarkdown>
    </section>
  );
}

export default withTranslation()(Topic);
