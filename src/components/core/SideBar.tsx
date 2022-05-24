import WebView from 'components/common/WebView';
import React from 'react';
import { IconBaseProps, IconType } from 'react-icons';
import * as codicons from 'react-icons/vsc';

/**
 * Side bar component.
 * @return {JSX.Element} Html.
 */
function SideBar({ style }: any) {
  const label = 'Views and more actions...';
  const iconName = 'VscEllipsis';
  const iconBaseProps: IconBaseProps = {
    size: 12,
    color: '#000',
    title: label,
  };

  return (
    <nav
      className="d-flex flex-column justify-content-between"
      style={{ userSelect: 'none', ...style }}
    >
      <div
        className="d-flex flex-row justify-content-between"
        style={{ padding: '12px 16px 12px 20px' }}
      >
        <div className="text-uppercase" style={{ fontSize: 12 }}>
          explorer
        </div>
        <div style={{ marginBottom: -6, marginTop: -6 }}>
          {(codicons as { [iconName: string]: IconType })[iconName](
            iconBaseProps
          )}
        </div>
      </div>
      <WebView src="https://www.example.com/" title="example webview" />
      {/* <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem
        dignissimos autem architecto expedita illum sequi aut rerum, facilis
        enim fugit eligendi? Nesciunt unde soluta dolorem deleniti
        reprehenderit, temporibus dolore itaque.
      </p> */}
    </nav>
  );
}

export default SideBar;
