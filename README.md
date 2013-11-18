# SmartWFM - Smart Web File Manager

SmartWFm is a web-based file manager which is build using the ExtJS Framework 4.x. It is easily expendable because of the plugin structure of the front- and backend.

# Features

 * L10n
 * as plugins:
   * base actions (copy, move, delete, rename) for files and folders
   * AFS management (manage groups & users, modify acl of folders)
   * archive manager (create, view, extract)
   * bookmarks
   * CKEditor for source code and text files
   * feedback (send a message to the admins)
   * show further file info
   * help overlay
   * image viewer
   * create files from templates
   * search
   * settings for the user interface (click behaviour, language, ...)
   * source code editor (codemirror)
   * folder tree view

 * expendable with plugins
 * easily enable/disable unused parts of the backend API

# Requirements

 * PHP >= 5.3.3 is tested

# Installation

## Backend

Move content of the `src` folder of https://github.com/SmartWFM/backend-php into a http(s) accessible folder on your web server for example into `/var/www/smartwfm-backend`.

## Frontend

Following commands will clone the repo and builds the frontend. (You will need `ant` as build tool)

```
git clone https://github.com/SmartWFM/swfm.git
cd swfm
ant prod
```

Then you can copy the content of the `build` folder into a http(s) accessible folder on your web server.

# Configuration

The backend config is located in `backend-php/src/config/local.php`. A example configuration can be found in [`backend-php/src/config/local.php.dist`](https://github.com/SmartWFM/backend-php/blob/master/src/config/local.php.dist). In the same directory is also the config for the "new file templates" and a folder which contains these templates. For more information see sample config files.

THe frontend config is in [`app/config/Config.json.php`](https://github.com/SmartWFM/swfm/blob/master/app/config/Config.json.php) and is by default empty. For the default values you can have a look at the `config` property of the class `SmartWFM.lib.Config` in [`app/lib/Config.js`](https://github.com/SmartWFM/swfm/blob/master/app/lib/Config.js).

# Further documentation

 * [frontend documentation](https://github.com/SmartWFM)
 * [backend API](https://github.com/SmartWFM)

# License

SmartWFM is licensed under GPLv3.

# Contributors

 * Morris Jobke
 * phse
