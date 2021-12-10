# Filtering/Transformation builtin functions

Functions are represented as a string with the following format:

```
<source>.<namespace>.<func_name>-<arg1>-<arg2>
```

- Function can accept or require arguments.

- The `source` represent the function origin. Could be `pgfilter`, `faker`

- namespace: Function category based on the `source`

## Sources

### pgfilter
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

- Column must accept `null` values

- Example:

	```json
	{
		"public.requests" : {
			"payload": "pgfilter.default.null"
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
