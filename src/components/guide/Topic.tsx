import React from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Table } from 'react-bootstrap';
import { HashLink } from 'react-router-hash-link';

const generateId = (name: string) =>
  name.toLowerCase().replaceAll(' ', '-').replaceAll("'", '');

const markdownOptions = {
  remarkPlugins: [remarkGfm],
  components: {
    table: ({ children }: any) => (
      <Table bordered striped>
        {children}
      </Table>
    ),
    code: ({ children }: any) => (
      <code className="bg-light px-1 rounded border d-inline-block">
        {children}
      </code>
    ),
    h2: ({ children }: any) => <h2 id={generateId(children[0])}>{children}</h2>,
    h3: ({ children }: any) => <h3 id={generateId(children[0])}>{children}</h3>,
    h4: ({ children }: any) => <h4 id={generateId(children[0])}>{children}</h4>,
    a: ({ children, href }: any) => (
      <HashLink to={`${href}`}>{children}</HashLink>
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
