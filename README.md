# pgfilter

CLI to filter or transform rows during a restore process for Postgres databases. The whole process happens in one stream process and it follows these steps:

1) Parse the incoming data coming from a backup file ( or stdin).
2) Analyze line patterns. Plain text backups contains `COPY` statements with tabs(`\t`) as separator.
3) Match tables and columns name againts a configuration file(`--pgfilter-file`)
4) Apply [filtering/transformation functions](#filteringtransformation-builtin-functions).
5) Return the transformed data ( or ignore ) to the stream
## Pre-conditions

- Backups must be on plain format before processing.
### Usage

```
pgfilter [backup_file]

Options:
  -f|--pgfilter-file      Path to the filtering/transformation JSON file. Required                          <string>
  -l|--max-buffer-length  Set internal buffer size. There is no limit by default. If set, process will      [integer]
                          throw an error as soon the buffer exceed the limit. Use --skip-overflow to avoid
                          exit the whole process.
  -s|--skip-overflow      If set, the line that exceed the internal buffer will be ignored and the process  [boolean]
                          will not exit
  -d|--debug              Show debug messages in stderr                                                     [boolean]
  -V|--version            Show version number                                                               [boolean]
  -h|--help               Show help                                                                         [boolean]
```

__NOTE__ For more information about `--max-buffer-length` and `--skip-overflow` check [Considerations section](#considerations)
## pgfilter-file

A JSON file that you must define based on the tables and rows that you want to filter or transform. Keys represent table names and the subdocument represent the target columns, each column must have a [filtering/transformation function](#filteringtransformationf-builtin-functions) as value.

```json
{
	"<table_name1>" : {
		"<column_name>": "<function_name>"
	},
	"<table_name2>" : {
		"<column_name>": "<function_name>"
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

```json
// myconfig.json
{
	"public.users" : { // Table users
		"name"    : "fnam", // Apply function fnmae to column name
		"lastname": "lname", // Apply function lname to column lastname
		"addr1"   : "addr", // Apply function addr to column addr1
		"email"   : "emai" // Apply function emai to column email
	},
	"public.requests": { // Table requests
		"created": "fnow-P60D" // Apply function fnow to column created
	}
}
```

```sh
pgfilter -f myconfig.json mybackup.dump > mybackup.anon.dump
```
### Filtering/Transformation builtin functions

#### Filtering

- `fnow`: ISO8601DUR representation. Apply to timestamp columns. Columns that do not match the duration will not be ignored

For 60 days from now
```json
{
	"public.requests" : {
		"created": "fnow-P60D" // 60 days of duration on the column
	}
}
```
#### Transformation

- `find`: Firstname + Lastname
- `fnam`: Firstname
- `lnam`: Lastname
- `addr`: Address
- `phon`: Phonenumber
- `comp`: Company
- `emai`: Email
- `wsit`: Web Site
- `bday`: Birthday
- `digi`: Digits.
- `zlen`: Empty String
- `zlar`: Empty Array
- `null`: Null

__NOTE__ `digi` allow to set the number of digits. Use the format: `digi-<digits>`. So `digi-8` will generate a number with 8 digits.
## Common Usage

- Restore a backup and anonymize data

	```bash
	pgfilter -f mypgfilter_custom_file.json mybackup.dump |
	psql -p "$PGPORT" --dbname="$PGDB"
	```

- Restore backups from Storage service like S3, avoiding file downloands

	```bash
	aws s3 cp s3://mybucket/mybackup.enc - |
	openssl enc -d -aes-256-cbc -pass pass:"$MY_SECRET_PASS" | # Always encrypt your backups
	pg_restore -f - --clean --if-exists --no-publications --no-subscriptions --no-comments |
	pgfilter -f mypgfilter_custom_file.json |
	psql -p "$PGPORT" --dbname="$PGDB"
	```

## Considerations

`pgfilter` use internal streams buffers to store partial data from the backup. By default there is not limit but you can use  `--skip-overflow` and `--max-buffer-length` options to set limitations to the internal buffer. This behavior is inherent due to [split2 npm package](https://www.npmjs.com/package/split2) which is used internally to detect lines in the stream for analysis. These combination of options is useful when there are tables with bytea or really long text columns. This will speed up the process on this scenario but also may cause data lose, **use with caution**.

