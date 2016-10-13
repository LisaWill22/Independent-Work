# independent-work

## Developer setup

Clone the repo and then run the following commands:

1. `npm install` - this will trigger a `bower install` as well.

2. `gulp` - The default gulp task fires up the server via nodemon, compiles less, lints the javascripts, then watches for any changes to HTML, CSS, or JS and refreshes

## Gulp tasks

- `gulp` (default) - does exactly what it says above
- `gulp install` - will install dependencies found in `package.json` and `bower.json`
- `gulp clean` - deletes the compiled `style.css` file
- `gulp js` - Runs jslint and reports to console
- `gulp browser-sync` - Starts the browsersync server
- `gulp less` - Compiles less and dumps it in to `./client/stylesheets`
- `gulp reload` - Reloads the browser sync server - Note: This does nothing if no server is running.
- `gulp dev` - Runs `gulp less`, `gulp js`, `gulp browser-sync` in order. Used in the default task as a dependency so that it fires before starting servers and watching for changes.


## Deplodement

This repo is deployed to Heroku. Super simple deplodement:

1. Make sure you have the heroku toolbelt installed. If not, run: `wget -qO- https://toolbelt.heroku.com/install.sh | sh
`

2. Then, to verify the install, run `heroku --version` and you should see some information about the `heroku-toolbelt` and `heroku-cli` verions.

3. Log in to your heroku account via the command line by running `heroku login` and entering your heroku creds. If you don't have a heroku account, head here to sign up - https://signup.heroku.com/

4. Next, make sure you are in the `independent-work` directory root and run
`heroku git:remote -a launchpeer-iw` to add heroku to your git remotes.

5. Then, deploying is as simple as staging, committing, and pushing your changes to the remote. So:

```#bash
git add myfile.js myotherfile.html
git commit -m "Look mah, no hands!"
git push heroku master
```

After running the last command, you will see Heroku takeover...Wait for the build to finish and look out for a BUILD SUCCEED or BUILD FAILURE. If the deplodement succeeds (BUILD SUCCEED), run `heroku open` and your browser will open a tab to `https://launchpeer-iw.herokuapp.com/#/` where you can view the app.

Cheers! :beer:
