[![CI](https://github.com/rebelstackio/pgfilter/actions/workflows/build.yml/badge.svg)](https://github.com/rebelstackio/pgfilter/actions/workflows/build.yml)
# pgfilter

CLI to filter or transform data during the restoration process for Postgres databases. Allowing you to generate an anonymized and filtered version of your database based on a JSON configuration file, protecting your sensitive data, and making a skinny version of your database for third-party resources involved in your development/QA process.

The whole process happens in one stream process and it follows these steps:

1) Parse the incoming data coming from a backup file ( or stdin).
2) Analyze line patterns. Plain text backups contains `COPY` statements with tabs(`\t`) as separator.
3) Match tables and columns name againts a configuration file(`--pgfilter-file`).
4) Apply the respective [filtering/transformation functions](./docs/Functions.md).
5) Return the transformed data ( or filter ) to the stream.
6) Restore the database with transformed data.

## Installation
```
npm i @rebelstack-io/pgfilter -g
```

## Pre-conditions

- Backups must be on plain format before processing.
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

__NOTE__ For more information about `--buffer-length` and `--skip-overflow` check [Considerations section](#considerations)
## pgfilter-file

A JSON file that you must define based on the tables and rows that you want to filter or transform. Keys represent table names and the subdocument represent the target columns on the table, each column must have a [filtering/transformation function](./docs/Functions.md) as value. The function determine what kind of filtering or transformation will be applied on the column.

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

To transform or anonymize the columns `name`,`lastname`,`addr1`, `email` on table `users` and filter the table `requests` to mantain only requests in the last 60 days, the pgfilter-file will be the following:

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

Go to section [Filtering/Transformation builtin functions](./docs/Functions.md) for more information.
## Common Usage

- Anonymized a backup file

	```bash
	pgfilter -f myconfig.json mybackup.dump > mybackup.transformed.dump
	```

- Create an anonymized version of your database based on a backup

	```bash
	pgfilter -f mypgfilter_custom_file.json mybackup.dump |
	psql -p "$PGPORT" --dbname="$PGDB"
	```

- Restore an anonymized version of your database dirrectly for the archive

	```bash
	aws s3 cp s3://mybucket/mybackup.enc - |
	openssl enc -d -aes-256-cbc -pass pass:"$MY_SECRET_PASS" | # Optional Decrypt backup. Always encrypt your backups
	pg_restore -f - --clean --if-exists --no-publications --no-subscriptions --no-comments |
	pgfilter -f mypgfilter_custom_file.json |
	psql -p "$PGPORT" --dbname="$PGDB"
	```
## Considerations

* `pgfilter` use internal streams buffers to store partial data from the backup. By default there is not limit but you can use  `--skip-overflow` and `--buffer-length` options to set limitations to the internal buffer. This behavior is inherent due to [split2 npm package](https://www.npmjs.com/package/split2) which is used internally to detect lines in the stream for analysis. These combination of options is useful when there are tables with bytea or really long text columns. This will speed up the process on this scenario but also may cause data lose, **use with caution**.

* Your databases must be corrected normalized to mantain relation between tables.

## Development

Check Vagrant Environment [here](./vagrant/README.md)
