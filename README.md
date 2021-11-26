# pgfilter

CLI command to transform,anonymize or filter rows during a Postgres Backup Restore process, transforming stdin data comming from a aackup and pipe it to a stdout.

## Pre-conditions

- Backups must be on custom format to allow tranform them to plain text format with [pg_restore](https://www.postgresql.org/docs/14/app-pgrestore.html)

	```sh
	# Generate a dump with custom format
	pg_dump -v -i -p ${PGPORT} -U postgres  $OPTIONS -F c -O -C ${PGDATABASE}
	```

## Common Usage

- Restore a backup and anonymize on the fly

	```sh
	pg_restore -f db.backup --clean --if-exists --no-publications --no-subscriptions --no-comments |
	pgfilter -f mypgfilter_custom_file.json |
	psql -p "$PG_DEST_PORT" --dbname="$PG_DEST_DB"
	```

- Pipe it and extend the restore process reducing the steps

	```sh
	aws s3 cp s3://mybucket/mybackup.enc - |
	openssl enc -d -aes-256-cbc -pass pass:"$MY_SECRET_PASS" |
	pg_restore -f - --clean --if-exists --no-publications --no-subscriptions --no-comments |
	pgfilter -f mypgfilter_custom_file.json |
	psql -p "$PG_DEST_PORT" --dbname="$PG_DEST_DB"
	```

## Options

- `-f, --filter-file <value>`          Filter/Transformation file.

- `-x, --splitter-readhw <number>`     ReadableHighWaterMark for the Splitter Transform stream. (default to 65536~64KB)

- `-y, --splitter-writehw <number>`    WritableHighWaterMark for the Splitter Transform stream. (default to 16384~15KB)

- `-w, --transformation-readhw <number>`   ReadableHighWaterMark for the Transformation stream. (default to 65536~64KB)

- `-z, --transformation-writehw <number>`  WritableHighWaterMark for the Transformation stream. (default to 16384~15KB)

- `-l, --max-buffer-length <number>`   When the internal buffer size exceeds `--max-buffer-length`, the stream emits an error by default. You may also set `--skip-overflow` to true to suppress the error and instead skip past any lines that cause the internal buffer to exceed maxLength (default to `undefined`)

- `-s, --skip-overflow`                  Avoid stop the streaming if the buffer exceeds. Basically ignore the line with problems. (default to `false`)

- `-d, --debug`                        Display warning messages with more details on stderr. (default: false)

- `-V, --version`                      output the version number

- `-h, --help`                         display help for command

## pgfilter.default.json

TODO:
## Filtering/Transformation functions and factors

### Transformation

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

Factor allow to permutate the possible value even with the same seed. The format is `<func>-<factor>` and by default the factor is 1.

Anonymazation Example:
```json
{
	"public.customer": {
		"customername": "find-2"
	}
}
```

__NOTE__ `digi` allow to set the number of digits. Use the format: `digi-<factor>-<digits>`. So `digi-1-8` will generate a number with 8 digits.

### Filtering

- `fnow`: ISO8601DUR representation. Columns does match the duration will not be ignored

For 60 days from now
```json
{
	"public.requests" : {
		"created": "fnow-P60D" // 60 days of duration on the column
	}
}
```

## Binary/Text Data

Use `--max-buffer-length` and `--skip-overflow` to avoid hang up the parsing process on rows with bytea columns or texts columns with multiple spaces and new lines characters. These columns are hard to parse because its nature and to avoid a really slow process `pgfilter` can ignore the whole line if it exceeds `--max-buffer-length` and to avoid stop the process the flag `--skip-overflow` should be enabled. Check [split2 npm package](https://www.npmjs.com/package/split2) to read more about this behavior.

## Increase Heap size
Update the variable **MAX_MEMORY** in the file `/etc/pgfilter/.env`. By default this value is **8192(8Gb)**

```sh
export MAX_MEMORY=10240
```
