# faul-response-v2

A small, unfinished and uncleanly programmed tool to make my work as a corrector easier.
Grown over time and developed for personal use only.

## Installation

### Via source code

**Requirements:**

- Node.js
- npm

1. clone repository
2. execute `npm install`
3. execute `npm run dev`

This will start a local server that can be reached at `http://localhost:5173/`.[dist.zip](dist.zip)

### Via release

**Requirements:**

- Any web server (e.g. Apache, php)

1. download release
2. unpack
3. start web server

With php:

```bash
cd /path/to/unpacked/release
php -S localhost:5173 -t
```

With Apache:

- Copy files to the web server folder
- Start server

## Usage

The templates for generating responses are defined in `responses.json`.
The file can be customized for your own purposes.

The following structure is absolutely necessary:

```json
{
  "tasks": [
    "Vokabeln",
    "Ship"
  ],
  "quality": {
    "options": {}
  },
  "taskErrors": {
    "intro": "",
    "options": {}
  },
  "syntaxErrors": {
    "intro": "",
    "options": {}
  },
  "extra": {
    "intro": "",
    "options": {}
  }
}
```

The `tasks` field contains tasks for the tasksErrors section to filter the displayed options.

The other fields contain the templates for the different sections:

The `intro` field contains text that precedes the section in the generated response. This parameter is optional and can
be omitted.

The `options` field then contains the options that are used to generate the response:

```json
{
  "options": {
    "good1": {
      "label": "Good",
      "text": "Everything is correct!"
    },
    "good2": {
      "label": "Good (Simple)",
      "text": [
        "Everything correct!",
        "Very good!"
      ],
      "task": "Vokabeln"
    }
  }
}
```

The key of the options (here: `good1` and `good2`) can be freely selected, but must be unique.
The `label` is the text that is displayed in the UI (i.e. next to the checkboxes/radio buttons).
`text` is used to generate the response text. This can be a string or an array of strings. In the latter case, a random
string is selected from the array.
The `task` key is only used for `options` in `taskErrors`. It is used to specify the task for which the response is.
If the task is not specified, the response is used for all tasks. The special value `"__all__"` can be used to specify
that the response is used for all tasks.

The file can be found in the following folder:

- *Use via source code:* `public/responses.json`
- *Use via release:* `responses.json`

The `templates` folder contains more templates. To use them, copy the contents of the file into the `responses.json`
file.