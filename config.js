require('dotenv').config();

const url = 'https://api.github.com/graphql';

const query = `
{
  viewer {
    login
    name
    avatarUrl
    url
    repositories(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {
      nodes {
        ... on Repository {
          name
          description
          updatedAt
          forks {
            totalCount
          }
          licenseInfo {
            name
          }
          primaryLanguage {
            name
          }
        }
      }
    }
  }
}
`;

const options = {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.GITHUB_API_KEY}`,
  },
  body: JSON.stringify({
    query,
  }),
};

module.exports = { url, options };
