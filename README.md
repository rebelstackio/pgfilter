[![CI](https://github.com/rebelstackio/pgfilter/actions/workflows/build.yml/badge.svg)](https://github.com/rebelstackio/pgfilter/actions/workflows/build.yml)
[![view on npm](https://img.shields.io/npm/l/@rebelstack-io/pgfilter)](https://www.npmjs.com/package/@rebelstack-io/pgfilter)

# pgfilter

CLI to filter or transform data during the restoration process for Postgres databases.
It uses a JSON file to define which tables and columns should be anonymized or
filtered with various methods, protecting your sensitive data and making a
skinny version of your database for third-party resources involved in your
development/QA process.

## Installation
```bash
npm i @rebelstack-io/pgfilter -g
```

### Docker Support
```bash
docker build -t pgfilter .
```

## Pre-conditions

- Backups must be on plain format.
### Usage

```
pgfilter [backup_file]

Filter/Transform rows during restore process for Postgres databases. For more
detailed information check: https://github.com/rebelstackio/pgfilter

Positionals:
  backup_file  Path to the Postgres Backup file.
                         [string] [default: null. pgfilter Use STDIN by default]

Options:
      --help           Show help                                       [boolean]
      --version        Show version number                             [boolean]
  -f, --file           Path to the filtering/transformation JSON file. env:
                       PGFILTER_FILE                         [string] [required]
  -b, --buffer-length  Set internal stream transformation buffer size. There is
                       no limit by default. If set, process will throw an error
                       as soon the buffer exceed the limit. Use --skip to avoid
                       exit the whole process. env: PGFILTER_BUFFER_LENGTH
                                                                        [number]
  -s, --skip-overflow  If set, the line that exceed the internal buffer will be
                       ignored and the process will not exit. env:
                       PGFILTER_SKIP_OVERFLOW         [boolean] [default: false]
  -v, --verbose        Show debug messages in STDERR                   [boolean]
```

__NOTE__ For more information about `--buffer-length` and `--skip-overflow`
check [Considerations section](#considerations)
## pgfilter-file

A JSON file that you must define based on the tables and rows that you want to filter
or transform.Keys represent table names and the subdocument represent the
target columns on the table, each column must have
a [filtering/transformation function](./docs/Functions.md) as value.
The function determine what kind of filtering or transformation
will be applied to the column.

```json
{
	"<table_name1>" : {
		"<column1_name>": "<function_name>",
		"<column2_name>": "<function_name>",
		"<column3_name>": "<function_name>"
	},
	"<table_name2>" : {
		"<column1_name>": "<function_name>"
	}
}
```

For example, lets say we have the following database

```sql
CREATE TABLE public.users (
		id         SERIAL,
		name       VARCHAR(40),
		lastname   VARCHAR(40),
		addr1      TEXT
		addr2      TEXT
		email      VARCHAR(40),
		phone      VARCHAR(25),
);

CREATE TABLE public.requests (
		id         SERIAL,
		user_id    BIGINT,
		created    TIMESTAMP WITH TIMEZONE
);
```

To transform or anonymize the columns `name`,`lastname`,`addr1`, `email`
on table `users` and filter the table `requests` to keep only requests in
the last 60 days, the pgfilter-file will be the following:

```javascript
// myconfig.json
{
	"public.users" : { // Table users
		"name"    : "faker.name.firstName", // Apply function firstName to column name
		"lastname": "faker.name.lastName", // Apply function lastName to column lastname
		"addr1"   : "faker.address.streetAddress", // Apply function streetAddress to column addr1
		"email"   : "faker.internet.email" // Apply function email to column email
	},
	"public.requests": { // Table requests
		"created": "pgfilter.filter.fnow-P60D" // Apply function fnow to column created for filtering rows
	}
}
```

```sh
pgfilter -f myconfig.json mybackup.dump > mybackup.transformed.dump
```
## Filtering/Transformation builtin functions

Go to section [Filtering/Transformation builtin functions](./docs/Functions.md)
for more information.
## Common Usage

- Anonymized a backup file

	```bash
	pgfilter -f myconfig.json mybackup.dump > mybackup.transformed.dump
	```

- Create an anonymized version of your database based on a backup

	```bash
	pgfilter -f mypgfilter_custom_file.json mybackup.dump |
	psql -p 5432 --dbname=mydb
	```

- Restore an anonymized version of your database dirrectly from a remote archive

	```bash
	aws s3 cp s3://mybucket/mybackup.enc - |
	openssl enc -d -aes-256-cbc -pass pass:"$MY_SECRET_PASS" | # Optional Decrypt backup.
	pg_restore -f - --clean --if-exists --no-publications --no-subscriptions --no-comments |
	pgfilter -f mypgfilter_custom_file.json |
	psql -p 5432 --dbname=mydb
	```

- Get an anonymized version of your database

	```bash
	psql -p 5432 --dbname=mydb |
	pgfilter -f mypgfilter_custom_file.json |
	psql -p 5432 --dbname=mydb_transformed
	```

- Get an anonymized version from a remote database

	```bash
	(
	 pg_dump -U dbadmin -h 1.2.3.4 -p 5433 -d remotedb |
	 pgfilter -f mypgfilter_custom_file.json |
	 psql -p 5432 -d  an_remotedb
	) 2> restore.err > restore.out
	```

- Using Docker

	```bash
	docker run --rm pgfilter:latest -v -f vagrant/test/dvdrental.default.json  vagrant/backup/dvdrental.dump > test.dump
	# or
	cat vagrant/backup/dvdrental.dump | docker run -i --rm pgfilter:latest -v -f vagrant/test/dvdrental.default.json  > test.stdin.dump
	```
## Considerations

* `pgfilter` use internal streams buffers to store partial data from the backup.
By default, there is no limit, but you can use  `--skip-overflow`
and `--buffer-length` options to set limitations to the internal buffer.
This behavior is inherent due to [split2 npm package](https://www.npmjs.com/package/split2)
which is used internally to detect lines in the stream for analysis.
These combinations of options is useful when there are tables
with bytea or really long text columns. This will speed up the process
on this scenario but also may cause data lose, **use with caution**.

* Your databases must be normalized to maintain relation between tables.

## Why

- There are several competitors (
  [PostgreSQL Anonymizer](https://postgresql-anonymizer.readthedocs.io/en/stable/),
  [pgantomizer](https://github.com/asgeirrr/pgantomizer),...etc
  ) but we have not found one that let you filter information.

- Most of them requires a direct connection to the databases which is very helpful
for remote databases but pgfilter's focus is to use the
local tooling like `pgdump` or `pg_restore` and
use Linux amazing piping features

## Development

### Vagrant Env
Check Vagrant Environment [here](./vagrant/README.md)

### Configure hooks
```sh
npx husky add .husky/commit-msg 'npx commitlint --edit $1'
```
