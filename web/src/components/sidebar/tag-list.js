import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';

export function SidebarTagList({ popularTags }) {
  const router = useRouter();

  if (popularTags.length === 0) return null;

  return (
    <div className="tag-list">
      {popularTags.map(tag => (
        <Link
          href={{ pathname: router.pathname, query: { tagName: tag.name } }}
          key={tag.id}
        >
          <a
            className={clsx('tag-pill tag-default', {
              'tag-outline': router.query.tagName !== tag.name
            })}
          >
            {tag.name}
          </a>
        </Link>
      ))}
    </div>
  );
}

SidebarTagList.fragments = {
  tag: gql`
    fragment SidebarTagListTagFragment on Tag {
      id
      name
    }
  `
};

SidebarTagList.defaultProps = {
  popularTags: []
};

SidebarTagList.propTypes = {
  popularTags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  )
};
