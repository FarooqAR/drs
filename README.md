# Doctor Rating System

## Requirements

- MS SQL Server 2017

## Getting Started:

- Clone the repository (make sure you have installed git)

  `git clone https://github.com/FarooqAR/drs.git`

  `cd drs`

- Install the packages:

  `npm install`

- Setup `.env` file. It should look like the file named `sample.env` given in the root folder.

- Create an empty database.   

- Initialize the DB

  `npm run dbinit`
  
  If the above command shows any errors, make sure again that your SQL Server is running and you have added correct info in `.env` file.

- Run!

  `npm run dev`

- Open [http://localhost:3000](http://localhost:3000)

## Start Working:

- Open [issues/tasks](https://github.com/farooqar/drs/issues)
- See which tasks are assigned to you.
- Open `cmd` in project directory
- Change your branch to `staging` with the following command (this may not work if you have uncommitted/ongoing work):

  `git checkout staging`
- Make sure your local `staging` branch is up-to-date with the remote branch:

  `git pull --rebase origin staging`
- Create your branch for whatever task you chose previously:

  `git checkout -b issue/<issue-number>`

  `<issue-number>` here is replaced by the task number you want to work on.
- When you are done working and feel like it's time other team members should see your glorious work, run the following commands (you may have to squash your commits into one if you have multiple commits in your specific branch):

   `git add -A`

   `git commit -m "<a nice one short sentence describing what you did in this branch>"`

   `git push origin issue/<issue-number>` 

You're done! It's time to create a pull request! Once you've created a PR (Pull Request), wait for the moderator to see your code, suggest changes and merge it with the `staging` branch.

> Caution!: Never ever push your work/commit to `staging` or `master` branch. Only push your branch which will look like `issue/<issue-number>`


## Resources

- [Bootstrap Docs](https://getbootstrap.com/docs/4.1/components/alerts/)

- [pugjs Docs](https://pugjs.org/language/attributes.html)

- [expressjs Docs](https://expressjs.com/en/guide/routing.html)
