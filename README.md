# pgfilter

CLI to transform or filter rows during restore process for Postgres databases, transforming or filtering stdin data comming from a backup and pipe it to a stdout. It use a JSON configuration file that match tables and columns name and set builtin transformation/filtering functions for each column.

## Pre-conditions

- Backups must be on plain format before processing. You can use tools like pg_restore](https://www.postgresql.org/docs/14/app-pgrestore.html) to transform custom backups before apply this CLI.

## Options

- `-f, --pgfilter-file <value>`        Filter/Transformation file. **REQUIRED**

- `-x, --splitter-readhw <number>`     ReadableHighWaterMark for the Splitter Transform stream. (default to 65536~64KB)

- `-y, --splitter-writehw <number>`    WritableHighWaterMark for the Splitter Transform stream. (default to 16384~15KB)

- `-w, --transformation-readhw <number>`   ReadableHighWaterMark for the Transformation stream. (default to 65536~64KB)

- `-z, --transformation-writehw <number>`  WritableHighWaterMark for the Transformation stream. (default to 16384~15KB)

- `-l, --max-buffer-length <number>`   When the internal buffer size exceeds `--max-buffer-length`, the stream emits an error by default. You may also set `--skip-overflow` to true to suppress the error and instead skip past any lines that cause the internal buffer to exceed maxLength (default to `undefined`)

- `-s, --skip-overflow`                  Avoid stop the streaming if the buffer exceeds. Basically ignore the line with problems. (default to `false`)

- `-d, --debug`                        Display warning messages with more details on stderr. (default: false)

- `-V, --version`                      output the version number

- `-h, --help`                         display help for command

## pgfilter-file

A JSON file that you must define based on the tables and rows that you want to transform or filter. Keys represent table names and the subdocument represent the target columns, each column must have a transformation/filtering function as value.

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
cat mybackup.dump |
pgfilter -f myconfig.json > mybackup.anon.dump
```

### Filtering/Transformation builtin functions

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

- Restore a backup and anonymize some data

	```sh
	pg_restore -f db.backup --clean --if-exists --no-publications --no-subscriptions --no-comments |
	pgfilter -f mypgfilter_custom_file.json |
	psql -p "$PG_DEST_PORT" --dbname="$PG_DEST_DB"
	```

- Restore backups from Storage service like S3, avoiding more manual steps

	```sh
	aws s3 cp s3://mybucket/mybackup.enc - |
	openssl enc -d -aes-256-cbc -pass pass:"$MY_SECRET_PASS" | # Always encrypt your backups
	pg_restore -f - --clean --if-exists --no-publications --no-subscriptions --no-comments |
	pgfilter -f mypgfilter_custom_file.json |
	psql -p "$PG_DEST_PORT" --dbname="$PG_DEST_DB"
	```

## Considerations
### Binary/Text Data

Use `--max-buffer-length` and `--skip-overflow` to avoid hang up the parsing process on rows with bytea columns or texts columns with multiple spaces and new lines characters. These columns are hard to parse because its nature and to avoid a really slow process `pgfilter` can ignore the whole line if it exceeds `--max-buffer-length` and to avoid stop the process the flag `--skip-overflow` should be enabled. Check [split2 npm package](https://www.npmjs.com/package/split2) to read more about this behavior.

### Increase Heap size for Node
Update the variable **MAX_MEMORY** in the file `/etc/pgfilter/.env`. By default this value is **8192(8Gb)**

```sh
export MAX_MEMORY=10240
```
