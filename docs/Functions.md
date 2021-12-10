# Filtering/Transformation functions

Functions are represented as a string with the following format:

```
<source>.<namespace>.<func_name>-<arg1>-<arg2>
```

- Function can accept or require arguments.

- The `source` represent the function origin. Could be `pgfilter`, `faker`

- namespace: Function category based on the `source`

## Sources

### pgfilter

Builtin internal helpfull functions
#### pgfilter.time.fnow-\<dur>

Evaluate the column value against the `dur` argument. If column value match the duration, the row is allowed to restore. Otherwise, the whole row is ignored and won't be included in the restore.

- Column type: `timestamp`

- Arguments:

	- `dur`: ISO8601DUR representation.

- Example:

	For 60 days from now
	```json
	{
		"public.requests" : {
			"created": "pgfilter.time.fnow-P60D" // 60 days of duration on the column
		}
	}
	```
#### pgfilter.default.null

Replace the current value of the column by `null`

- Column type: `anything`

- Column must accept `null` as a valid value

- Example:

	```json
	{
		"public.requests" : {
			"payload": "pgfilter.default.null"
		}
	}
	```


#### pgfilter.default.zlen

Replace the current value of the column by an empty string

- Column type: `varchar/text`

- Column must accept empty strings as valid value

- Example:

	```json
	{
		"public.requests" : {
			"encoded_secret": "pgfilter.default.zlen"
		}
	}
	```
#### pgfilter.default.zlar

Replace the current value of the column by an empty array

- Column type: `array`

- Example:

	```json
	{
		"public.requests" : {
			"ips": "pgfilter.default.zlar"
		}
	}
	```
### faker

All the functions on [faker.js](https://marak.github.io/faker.js/) API are available.

For example:

- `faker.name.firstName`
- `faker.name.middleName`
- `faker.company.companyName`
- `faker.random.number`
- `faker.internet.password`


For more information. Check [faker API methods](https://marak.github.io/faker.js/#toc7__anchor)
