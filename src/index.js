import GITHUB_API_KEY from './config';

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

const svgs = {
  star: `<svg class="svg-icon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>`,
  license: '<svg class="svg-icon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"></path></svg>',
  new: '<svg class="svg-icon" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path></svg>',
  githubIcon: `<svg class="svg-icon" height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"> <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>`,
  bellIcon: `<svg class="svg-icon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M8 16a2 2 0 001.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 008 16z" ></path><path fill-rule="evenodd" d="M8 1.5A3.5 3.5 0 004.5 5v2.947c0 .346-.102.683-.294.97l-1.703 2.556a.018.018 0 00-.003.01l.001.006c0 .002.002.004.004.006a.017.017 0 00.006.004l.007.001h10.964l.007-.001a.016.016 0 00.006-.004.016.016 0 00.004-.006l.001-.007a.017.017 0 00-.003-.01l-1.703-2.554a1.75 1.75 0 01-.294-.97V5A3.5 3.5 0 008 1.5zM3 5a5 5 0 0110 0v2.947c0 .05.015.098.042.139l1.703 2.555A1.518 1.518 0 0113.482 13H2.518a1.518 1.518 0 01-1.263-2.36l1.703-2.554A.25.25 0 003 7.947V5z"></path></svg>`,
  plusIcon: ` <svg class="svg-icon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z"></path></svg><span class="link--down-caret">&#x25BC;</span>`,
  linkOverview: `<svg class="svg-icon svg-icon--pad" height="16" viewBox="0 0 16 16" version="1.1"  width="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 1.75A.75.75 0 01.75 1h4.253c1.227 0 2.317.59 3 1.501A3.744 3.744 0 0111.006 1h4.245a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-4.507a2.25 2.25 0 00-1.591.659l-.622.621a.75.75 0 01-1.06 0l-.622-.621A2.25 2.25 0 005.258 13H.75a.75.75 0 01-.75-.75V1.75zm8.755 3a2.25 2.25 0 012.25-2.25H14.5v9h-3.757c-.71 0-1.4.201-1.992.572l.004-7.322zm-1.504 7.324l.004-5.073-.002-2.253A2.25 2.25 0 005.003 2.5H1.5v9h3.757a3.75 3.75 0 011.994.574z"></path></svg><span class="tab--padded-span"> Overview </span>`,
  linkRepos: ` <svg class="svg-icon svg-icon--pad" height="16" viewBox="0 0 16 16"  version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd"  d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path></svg><span class="tab--padded-span"> Repositories 74 </span>`,
  linkProjects: ` <svg class="svg-icon svg-icon--pad" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.75 0A1.75 1.75 0 000 1.75v12.5C0 15.216.784 16 1.75 16h12.5A1.75 1.75 0 0016 14.25V1.75A1.75 1.75 0 0014.25 0H1.75zM1.5 1.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25v12.5a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25V1.75zM11.75 3a.75.75 0 00-.75.75v7.5a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75zm-8.25.75a.75.75 0 011.5 0v5.5a.75.75 0 01-1.5 0v-5.5zM8 3a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 008 3z"></path></svg><span class="tab--padded-span"> Projects </span>`,
  linkPackages: ` <svg class="svg-icon" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.878.392a1.75 1.75 0 00-1.756 0l-5.25 3.045A1.75 1.75 0 001 4.951v6.098c0 .624.332 1.2.872 1.514l5.25 3.045a1.75 1.75 0 001.756 0l5.25-3.045c.54-.313.872-.89.872-1.514V4.951c0-.624-.332-1.2-.872-1.514L8.878.392zM7.875 1.69a.25.25 0 01.25 0l4.63 2.685L8 7.133 3.245 4.375l4.63-2.685zM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432L2.5 5.677zm6.25 8.271l4.625-2.683a.25.25 0 00.125-.216V5.677L8.75 8.432v5.516z"></path></svg><span class="tab--padded-span"> Packages </span>`,
};

const options = {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${GITHUB_API_KEY}`,
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

const languageColors = {
  HTML: '#e34c26',
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Ruby: '#701516',
  PHP: '#4f5d95',
  Python: '#3572a5',

};
function getLanguageStyles(language, colors = languageColors) {
  return `
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: ${colors[language]};
    border-radius: 50%;
    margin-right: 5px;
  `;
}
function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}
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
    let seconds;
    if (today.getMinutes() === lastUpdatedOn.getMinutes()) {
      seconds = today.getSeconds() - lastUpdatedOn.getSeconds();
    } else {
      seconds = 60 - lastUpdatedOn.getSeconds() + today.getSeconds();
    }
    return `Updated ${
      seconds <= 1 ? `${seconds} second` : `${seconds} seconds`
    } ago`;
  }
  if (delta < HOUR) {
    let minutes;
    if (today.getHours() === lastUpdatedOn.getHours()) {
      minutes = today.getMinutes() - lastUpdatedOn.getMinutes();
    } else {
      minutes = 60 - lastUpdatedOn.getMinutes() + today.getMinutes();
    }
    return `Updated ${
      minutes <= 1 ? `${minutes} minute` : `${minutes} minutes`
    } ago`;
  }
  if (delta < DAY) {
    let hours;
    if (today.getDate() === lastUpdatedOn.getDate()) {
      hours = today.getHours() - lastUpdatedOn.getHours();
    } else {
      hours = 24 - lastUpdatedOn.getHours() + today.getHours();
    }
    return `Updated ${hours <= 1 ? `${hours} hour` : `${hours} hours`} ago`;
  }
  if (delta < MONTH) {
    let days;
    if (today.getMonth() === lastUpdatedOn.getMonth()) {
      days = today.getDate() - lastUpdatedOn.getDate();
    } else {
      const daysLastMonth = daysInMonth(
        lastUpdatedOn.getFullYear(),
        lastUpdatedOn.getMonth() + 1,
      );
      days = daysLastMonth - lastUpdatedOn.getDate() + today.getDate();
    }

    return `Updated ${days <= 1 ? `${days} day` : `${days} days`} ago`;
  }
  if (delta < YEAR) {
    const dateUpdated = lastUpdatedOn.getDate();
    const month = months[lastUpdatedOn.getMonth()];
    return `Updated on ${dateUpdated} ${month}`;
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
    { node: 'h2', propName: 'name', class: 'blue-header' },
    { node: 'p', propName: 'description', class: 'description description--fontsize-14' },
    { node: 'p', propName: 'details', class: 'details details--fontsize-12' },
  ];

  nodes.forEach((node) => {
    // Outer wrapper
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'outer-wrapper');

    ['inner_wrapper_1', 'inner_wrapper_2'].forEach((__, index) => {
      const innerWrapper = document.createElement('div');

      if (index === 0) {
        innerWrapper.setAttribute('class', 'inner-wrapper-1');
        wrapperOne.forEach((obj) => {
          const element = document.createElement(obj.node);
          element.setAttribute('class', obj.class);
          if (obj.propName === 'details') {
            const mainLanguageSpan = document.createElement('span');
            const licenseSpan = document.createElement('span');
            const updateSpan = document.createElement('span');

            mainLanguageSpan.setAttribute('class', 'details__main-language details--pad-right');
            licenseSpan.setAttribute('class', 'details__license details--pad-right');
            updateSpan.setAttribute('class', 'details__update details--pad-right');

            mainLanguageSpan.innerText = node.primaryLanguage ? node.primaryLanguage.name : '';
            licenseSpan.innerHTML = node.licenseInfo ? `${svgs.license} ${node.licenseInfo.name}` : '';
            updateSpan.innerText = node.updatedAt ? formatTimeDelta(node.updatedAt) : '';

            if (node.primaryLanguage) {
              const colorSpan = document.createElement('span');
              colorSpan.setAttribute('style', getLanguageStyles(node.primaryLanguage.name));
              element.appendChild(colorSpan);
              element.appendChild(mainLanguageSpan);
            }
            element.appendChild(licenseSpan);
            element.appendChild(updateSpan);
          }

          if (obj.propName !== 'details') {
            element.innerText = node[obj.propName] ? node[obj.propName] : '';
          }
          innerWrapper.appendChild(element);
        });
      }

      if (index !== 0) {
        innerWrapper.setAttribute('class', 'inner-wrapper-2');
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

const githubLink = document.querySelector('.github-link');
const bellIcon = document.querySelector('.link--bell-icon');
const plusIcon = document.querySelector('.link--plus-icon');
const linkOverview = document.querySelector('.link--overview');
const linkRepos = document.querySelector('.link--repos');
const linkProjects = document.querySelector('.link--projects');
const linkPackages = document.querySelector('.link--packages');

githubLink.innerHTML = svgs.githubIcon;
bellIcon.innerHTML = svgs.bellIcon;
plusIcon.innerHTML = svgs.plusIcon;
linkOverview.innerHTML = svgs.linkOverview;
linkRepos.innerHTML = svgs.linkRepos;
linkProjects.innerHTML = svgs.linkProjects;
linkPackages.innerHTML = svgs.linkPackages;

fetch(url, options)
  .then((response) => response.json())
  .then(app);
