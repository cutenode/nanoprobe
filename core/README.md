# @nodevu/core

The core, online-only utility of nodevu.

## Usage

```js
const nodevu = require('@nodevu/core')

async function getData() {
    const data = await nodevu() // returns a lot of data!
    console.log(data)
}

getData()
```

## API

assuming you're requiring this module as `nodevu`:

- `nodevu(options)` - returns a promise that resolves to a giant JSON blob of data. This is the default export.
  - `options` (`Object`, optional): an `Object` of options to pass to the module.
    - `fetch` (`Object`, optional): your chosen fetch implementation. Default: [Undici](https://github.com/nodejs/undici)'s fetch impelmentation.
    - `now` (`String`, optional): a custom date `String` (ISO 8601) to do relative checks against. _Most likely_ only useful for internal testing. Default: `DateTime.now()` from [Luxon](https://moment.github.io/luxon/).
    - `urls` (`Object`, optional): an `Object` that enables you to set custom values for the Node.js `index.json` file and `schedule.json` file.
      - `index` (`String`, optional): a `String` that, if set, changes the URL that this module looks for the version index file at. This should be a _full_ URL that points to a JSON file. Default: `https://nodejs.org/dist/index.json`.
      - `schedule` (`String`, optional): a `String` that, if set, changes the URL that this module looks for the Node.js release schedule file at. This should be a _full_ URL that points to a JSON file. Default: `https://raw.githubusercontent.com/nodejs/Release/master/schedule.json` .

The data returned by this module follows a pretty specific structure. Here's a detailing of that structure:

- Everything is within a top level `Object`.
  - Every key in the`Object`is a semver major release line name with a 'v' prefix. Example: `v17`. Every value is an`Object`with the following properties:
    - `releases` (`Object`) - an`Object`that is filled with all releases under the release line:
      - Every key in the`Object`is a full Node.js release name. Example: `v17.6.0`. Every value is an`Object`with the following properties:
        - `semver` (`Object`) - a small`Object`that gives semver information:
          - `raw` (`String`) - the whole, raw version.
          - `major` (`String`) - the semver major number.
          - `minor` (`String`) - the semver minor number.
          - `patch` (`String`) - the semver patch number.
          - `line` (`String`) - the "name" of the release line.
        - `releaseDate` (`String`) - the version's release date.
        - `modules` (`Object`)
          - `version` (`String`) - the ABI (Application Binary Interface) version number of Node.js, used to determine which version of Node.js compiled C++ add-on binaries can be loaded in to without needing to be re-compiled.
        - `dependencies` (`Object`) - the bundled dependencies in this version of Node.js:
          - `npm` (`String`) - version of the bundled npm. 
          - `v8` (`String`) - version of the bundled v8.
          - `uv` (`String`) - version of the bundled libuv.
          - `zlib` (`String`) - version of the bundled zlib.
          - `openssl` (`String`) - version of the bundled openssl.
        - `files` (`Object`) - an`Object`that provides context on the files available for the given release:
          - `available` (`Array`) - the available files, as listed by the official [dist file](https://nodejs.org/dist/index.json). Every entry will be a String.
          - `links` (`Object`) - an`Object`of the different potential links:
            - `aix` (`Array`) - all AIX links (AIX is an IBM platform) links:
              - `id` (`String`) - the initial identifier from `available` that was passed in.
              - `files` (`Array`) - an `Array` of associated filenames for the ID.
              - `architecture` (`String`) - the name of the architecture for the files in `files`.
            - `headers` (`Array`) - all links to headers for the build:
              - `id` (`String`) - the initial identifier from `available` that was passed in.
              - `files` (`Array`) - an `Array` of associated filenames for the ID.
              - `architecture` (`String`) - the name of the architecture for the files in `files`.
            - `linux` (`Array`) - all the links to Linux distributions for the build:
              - `id` (`String`) - the initial identifier from `available` that was passed in.
              - `files` (`Array`) - an `Array` of associated filenames for the ID.
              - `architecture` (`String`) - the name of the architecture for the files in `files`.
            - `macos` (`Array`):
              - `id` (`String`) - the initial identifier from `available` that was passed in.
              - `files` (`Array`) - an `Array` of associated filenames for the ID.
              - `architecture` (`String`) - the name of the architecture for the files in `files`.
            - `source` (`Array`):
              - `id` (`String`) - the initial identifier from `available` that was passed in.
              - `files` (`Array`) - an `Array` of associated filenames for the ID.
              - `architecture` (`String`) - the name of the architecture for the files in `files`.
            - `windows` (`Array`): 
              - `id` (`String`) - the initial identifier from `available` that was passed in.
              - `files` (`Array`) - An `Array` of associated filenames for the ID.
              - `architecture` (`String`) - The name of the architecture for the files in `files`.
        - `lts` (`Object`):
          - `isLts`(Boolean) - `true` if the release is an LTS release, `false` if it's not.
        - `security` (`Object`):
          - `isSecurity` (Boolean) - `true` if the release is a security release, `false` if it's not.
    - `support` (`Object`) - An`Object`to provide information about the project's support of the given release line, including dates, status, LTS codename, and LTS version info:
      - `codename` (`String`) - **Only present if applicable to the given release.** A `String` of the LTS release line's codename. 
      - `lts` (`Object`) - **Only present if applicable to the given release.** An`Object`that provides LTS versioning information.
        - `newest` (`String`) - The newest release in the release line that is LTS. _Usually_, this will be the latest release in the line.
        - `oldest` (`String`) - **Only present if applicable to the given release.** The oldest (first) release in the release line that was flagged as LTS.
      - `phases` (`Object`) - Start dates for each phase of a release line's lifecycle:
        - `start` (`String`) - The start date of the release line (releases in this phase are `current`). Example: `2021-04-20`.
        - `lts` (`String`) - **Only present if the release line is an LTS release.** The start date of the LTS lifecycle (releases in this phase are `lts`). Example: `2021-10-26`. 
        - `maintenance` (`String`) - **Only present if the release line is an LTS release.** The start date of the maintenance phase of the lifecycle. Example: `2022-10-18`.
        - `end` (`String`) - the date the release line is no longer supported. Example: `2024-04-30`.
    - `security` (`Object`):
      - `all` (`Array`) - an `Array` of _all_ security releases in the release line.
      - `newest` (`String`) - the newest (most recent) security release. Example: `17.3.1`.

### Example output

You can find an example of the output [here](https://gist.github.com/bnb/df2cd4329e9f402bbf8dc9bf8364aa34). It's big. Like, really big. GitHub will struggle to render it. It's probably worth viewing [raw](https://gist.githubusercontent.com/bnb/df2cd4329e9f402bbf8dc9bf8364aa34/raw/2602ad0738bb9b8d0f41c3ad110e8f8a58f12197/data.json) or curl'ing the raw output.