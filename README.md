# pgfilter

CLI to transform or filter rows during a restore process for Postgres databases. The whole process happens in one stream process and it follows these steps:

1) Parse the incoming data coming from a backup file ( or stdin)
2) Analyze line patterns
3) Match tables and columns name againts a configuration file(`--pgfilter-file`)
4) Apply [transformation/filtering functions](#Transformation/Filtering-builtin-functions).
5) Return the transformed data ( or ignore ) to the stream
## Pre-conditions

- Backups must be on plain format before processing. You need to decrypt or transform the backup file before use this tool.
### Usage

```bash
pgfilter [backup_file]

Options:
  -f|--pgfilter-file      Path to the transformation/filtering JSON file. Required                          <string>
  -l|--max-buffer-length                                                                                    [integer]
  -s|--skip-overflow                                                                                        [boolean]
  -d|--debug              Show debug messages in stderr                                                     [boolean]
  -V|--version            Show version number                                                               [boolean]
  -h|--help               Show help                                                                         [boolean]
```

## pgfilter-file

A JSON file that you must define based on the tables and rows that you want to transform or filter. Keys represent table names and the subdocument represent the target columns, each column must have a [transformation/filtering function](#Transformation/Filtering-builtin-functions) as value.

```json
{
	<table_name1> : {
		<column_name>: <func>
	},
	<table_name2> : {
		<column_name>: <func>
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
### Transformation/Filtering builtin functions

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
- `fnow`: Filter by date


__NOTE__ `digi` allow to set the number of digits. Use the format: `digi-<digits>`. So `digi-8` will generate a number with 8 digits.

#### Filtering

- `fnow`: ISO8601DUR representation. Columns does not match the duration will not be ignored

For 60 days from now
```json
{
	"public.requests" : {
		"created": "fnow-P60D" // 60 days of duration on the column
	}
}
```
## Common Usage

- Restore a backup and anonymize data

	```sh
	pgfilter -f mypgfilter_custom_file.json mybackup.dump |
	psql -p "$PGPORT" --dbname="$PGDB"
	```

- Restore backups from Storage service like S3, avoiding file downloands

	```sh
	aws s3 cp s3://mybucket/mybackup.enc - |
	openssl enc -d -aes-256-cbc -pass pass:"$MY_SECRET_PASS" | # Always encrypt your backups
	pg_restore -f - --clean --if-exists --no-publications --no-subscriptions --no-comments |
	pgfilter -f mypgfilter_custom_file.json |
	psql -p "$PGPORT" --dbname="$PGDB"
	```

## Considerations
### Bytea/Text Columns

Use `--max-buffer-length` and `--skip-overflow` to avoid hang up the parsing process on reaaly long rows with bytea or texts columns with multiple spaces and new lines characters. These columns are hard to parse because its nature and to avoid a really slow process `pgfilter` can ignore the whole line if it exceeds `--max-buffer-length` and to avoid stop the process the flag `--skip-overflow` should be enabled. Check [split2 npm package](https://www.npmjs.com/package/split2) to read more about this behavior.
