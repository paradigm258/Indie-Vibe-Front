import React from 'react';
import { NavLink } from 'react-router-dom';

function NavigationTab(props) {
  const { type, items } = props;

  return (
    <div className='tab-menu-wrapper'>
      <ul className='tab-menu'>
        {items.map((item, index) => {
          let linkClasses = 'font-short-big font-weight-bold';
          if (item.isSpecial) {
            linkClasses += ' special link-blue-main font-blue-main';
          } else {
            linkClasses += ' link-bright-gray font-gray-light';
          }
          if (item.isDisabled) {
            linkClasses += ' disabled';
          }

          return item.isDisabled ? (
            <li key={index}>
              <span className={linkClasses}>{item.label}</span>
            </li>
          ) : (
            <li key={index}>
              {Array.isArray(item.href) ? (
                <NavLink
                  to={item.href[1]}
                  className={linkClasses}
                  isActive={(match, location) => {
                    return item.href.includes(location.pathname);
                  }}
                >
                  {item.label}
                </NavLink>
              ) : (
                <NavLink
                  to={item.href}
                  className={linkClasses}
                  isActive={(match, location) => {
                    if (type !== 'search')
                      return item.href === location.pathname;
                    if (match) return location.pathname === match.url;
                    return false;
                  }}
                >
                  {item.label}
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default NavigationTab;
