const url = 'https://api.github.com/graphql';

const query = `
{
    viewer {
      login
      name
      avatarUrl
      url
      location
      bio
      repositories(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {
        nodes {
          ... on Repository {
            name
            description
            updatedAt
            licenseInfo {
              id
              name
            }
            languages(first: 100) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }  
`;

const svgs = {
  star: `<svg class="octicon octicon-star mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>`,
};

const options = {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer API_KEY`,
  },
  body: JSON.stringify({
    query,
  }),
};
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
function formatTimeDelta(date) {
  const SECOND = 1 * 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const MONTH = 30 * DAY;
  const YEAR = 365 * MONTH;
  const today = new Date();
  const lastUpdatedOn = new Date(date);
  const delta = today.getTime() - lastUpdatedOn.getTime();
  if (delta < SECOND) {
    return `Updated ${delta} milliseconds ago`;
  }
  if (delta < MINUTE) {
    const seconds = parseInt(Math.floor(delta / SECOND), 10);
    return `Updated ${seconds <= 1 ? `${seconds} second` : `${seconds} seconds`} ago`;
  }
  if (delta < HOUR) {
    const minutes = parseInt(Math.floor(delta / MINUTE), 10);
    return `Updated ${minutes <= 1 ? `${minutes} minute` : `${minutes} minutes`} ago`;
  }
  if (delta < DAY) {
    const hours = parseInt(Math.floor(delta / HOUR), 10);
    return `Updated ${hours <= 1 ? `${hours} hour` : `${hours} hours`} ago`;
  }
  if (delta < MONTH) {
    const days = parseInt(Math.round(delta / DAY), 10);
    return `Updated ${days <= 1 ? `${days} day` : `${days} days`} ago`;
  }
  if (delta < YEAR) {
    const dateUpdated = lastUpdatedOn.getDate();
    const month = lastUpdatedOn.getMonth();
    return `Updated on ${dateUpdated} ${months[month]}`;
  }
  const dateUpdated = lastUpdatedOn.getDate();
  const month = lastUpdatedOn.getMonth();
  const year = lastUpdatedOn.getFullYear();
  return `Updated on ${month} ${dateUpdated}, ${year}`;
}

function app(result) {
  const { data } = result;
  const { nodes } = data.viewer.repositories;
  const avatars = document.querySelectorAll('.avatar');
  avatars.forEach((__, index) => {
    avatars[index].setAttribute('src', data.viewer.avatarUrl);
    avatars[index].style.borderRadius = '50%';
  });
  const name = document.querySelector('.name');
  const userName = document.querySelector('.user-name');
  const repos = document.querySelector('.repos');
  name.innerText = data.viewer.name;
  userName.innerText = data.viewer.login;

  const wrapperOne = [
    { node: 'h2', propName: 'name', class: '' },
    { node: 'p', propName: '', class: '' },
    { node: 'p', propName: 'description', class: '' },
    { node: 'p', propName: 'updatedAt', class: '' },
  ];

  nodes.forEach((node) => {
    // Outer wrapper
    const wrapper = document.createElement('div');

    ['inner_wrapper_1', 'inner_wrapper_2'].forEach((__, index) => {
      const innerWrapper = document.createElement('div');
      if (index === 0) {
        wrapperOne.forEach((obj) => {
          const element = document.createElement(obj.node);
          if (obj.propName === 'updatedAt') {
            element.innerText = node[obj.propName] ? formatTimeDelta(node[obj.propName]) : '';
          } else {
            element.innerText = node[obj.propName] ? node[obj.propName] : '';
          }
          element.setAttribute('class', obj.class);
          innerWrapper.appendChild(element);
        });
      } else {
        const button = document.createElement('button');
        button.innerHTML = svgs.star;
        const span = document.createElement('span');
        span.innerText = 'Star';
        button.appendChild(span);
        innerWrapper.appendChild(button);
      }
      wrapper.appendChild(innerWrapper);
    });
    repos.appendChild(wrapper);
  });
}
fetch(url, options)
  .then((response) => response.json())
  .then(app);
