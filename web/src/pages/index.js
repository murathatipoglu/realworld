import React from 'react';
import gql from 'graphql-tag';
import withApollo from '../lib/with-apollo';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Sidebar } from '../components/sidebar';
import { Pagination } from '../components/pagination';
import { NetworkStatus } from 'apollo-client';
import { Layout } from '../components/layout';
import { HomePageBanner } from '../components/home-page-banner';
import { ViewerFeedToggle } from '../components/viewer-feed-toggle';
import { ArticlePreview } from '../components/article-preview';

function IndexPage() {
  const router = useRouter();
  const variables =
    typeof router.query.before !== 'undefined' ||
    typeof router.query.after !== 'undefined'
      ? {
          last: router.query.last ? parseInt(router.query.last) : null,
          first: router.query.first ? parseInt(router.query.first) : null,
          before: router.query.before ? router.query.before : null,
          after: router.query.after ? router.query.after : null,
          tagName: router.query.tagName
        }
      : { first: 10, tagName: router.query.tagName };

  const index = useQuery(IndexPageArticlesQuery, {
    variables,
    notifyOnNetworkStatusChange: true
  });

  const [favoriteArticle] = useMutation(IndexPageFavoriteArticleMutation);
  const [unfavoriteArticle] = useMutation(IndexPageUnfavoriteArticleMutation);

  if (index.networkStatus == NetworkStatus.loading) return null;

  return (
    <Layout {...index.data.viewer}>
      <div className="home-page">
        <HomePageBanner />
        <div className="container page">
          <div className="row">
            <div className="col-xs-12 col-md-9">
              <ViewerFeedToggle {...index.data.viewer} />
              {index.data.articlesConnection.edges.map(edge => (
                <ArticlePreview
                  key={edge.node.slug}
                  onFavorite={favoriteArticle}
                  onUnfavorite={unfavoriteArticle}
                  {...edge.node}
                />
              ))}
              <Pagination {...index.data.articlesConnection.pageInfo} />
            </div>
            <div className="col-xs-12 col-md-3">
              <Sidebar {...index.data} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const IndexPageArticleFragment = gql`
  fragment IndexPageArticleFragment on Article {
    author {
      ...ArticlePreviewAuthorFragment
    }
    ...ArticlePreviewArticleFragment
  }
  ${ArticlePreview.fragments.article}
  ${ArticlePreview.fragments.author}
`;

const IndexPageArticlesQuery = gql`
  query IndexPageArticlesQuery(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $tagName: String
  ) {
    viewer {
      ...LayoutViewerFragment
      ...ViewerFeedToggle
    }
    articlesConnection(
      after: $after
      before: $before
      first: $first
      last: $last
      tagName: $tagName
    ) {
      pageInfo {
        ...PaginationPageInfoFragment
      }
      edges {
        node {
          ...IndexPageArticleFragment
        }
      }
    }
    ...SidebarQueryFragment
  }
  ${IndexPageArticleFragment}
  ${Layout.fragments.viewer}
  ${Pagination.fragments.pageInfo}
  ${Sidebar.fragments.query}
  ${ViewerFeedToggle.fragments.viewer}
`;

const IndexPageFavoriteArticleMutation = gql`
  mutation IndexPageFavoriteArticleMutation($slug: ID!) {
    favoriteArticle(slug: $slug) {
      article {
        ...IndexPageArticleFragment
      }
    }
  }
  ${IndexPageArticleFragment}
`;

const IndexPageUnfavoriteArticleMutation = gql`
  mutation IndexPageUnfavoriteArticleMutation($slug: ID!) {
    unfavoriteArticle(slug: $slug) {
      article {
        ...IndexPageArticleFragment
      }
    }
  }
  ${IndexPageArticleFragment}
`;

export default withApollo(IndexPage);
