import React from 'react';
import { withTranslation } from 'react-i18next';
import { FcPrevious } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { capitalize } from 'lodash';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectGuide, updateCategories } from 'store/reducers/guide';
import MenuBar from 'components/menu-bar/MenuBar';
import Categories from 'components/guide/Categories';
import CategoryLinks from 'components/guide/CategoryLinks';
import { call } from 'store/reducers/server';
import { useEffectOnce } from 'hooks';
import CallModel from 'models/server-coms/CallModel';
import ServerCallTarget from 'enums/ServerCallTarget';

/**
 * Guide component.
 * @param {any} param0 Parameters for the guide.
 * @return {JSX.Element} Html.
 */
function Guide({ t }: any) {
  const categories = useAppSelector(selectGuide).categories;
  const dispatch = useAppDispatch();

  useEffectOnce(() => {
    dispatch(
      call({
        target: ServerCallTarget.GuideGet,
        onSuccessAction: updateCategories,
      } as CallModel)
    );
  });

  return (
    <div className="Guide">
      <header className="Guide-header">
        <MenuBar />
      </header>
      <div
        className="d-grid position-relative"
        style={{
          gridTemplateColumns: '270px auto',
          height: 'calc(100vh - 24px)',
        }}
      >
        <aside className="h-100 bg-light border-end">
          <nav>
            <ul className="list-unstyled py-3 mb-0">
              {[
                <Link
                  key="link"
                  to="/"
                  className="text-decoration-none text-muted small"
                >
                  <FcPrevious className="me-1" />
                  <span>{capitalize(t('return'))}</span>
                </Link>,
                categories.length > 0 && (
                  <CategoryLinks
                    style={{
                      overflow: 'auto',
                      height: 'calc(100vh - 24px - 40px - 33px)',
                    }}
                  >
                    {categories}
                  </CategoryLinks>
                ),
              ]
                .filter(children => children)
                .map((child, index: number) => (
                  <li
                    key={`navigation/item-${index}`}
                    className="ps-3 pb-2 border-bottom"
                  >
                    {child}
                  </li>
                ))}
            </ul>
          </nav>
        </aside>
        <main
          className="shadow container overflow-scroll p-3"
          style={{
            zIndex: 1,
            height: 'calc(100vh - 24px)',
            scrollBehavior: 'smooth',
          }}
        >
          {categories.length > 0 ? (
            <Categories>{categories}</Categories>
          ) : (
            <p className="text-secondary text-center pt-4">
              {capitalize(
                t("There's currently nothing here. Check back later")
              )}
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

export default withTranslation()(Guide);
