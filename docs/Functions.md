# Filtering/Transformation functions

Functions are represented as a string with the following format:

```
<source>.<namespace>.<func_name>-<arg1>-<arg2>...
```

- Function can accept or require arguments.

- The `source` represent the function origin. Could be `pgfilter`, `faker`

- namespace: Function category based on the `source`

## Sources

- [pgfilter](#pgfilter)
- [faker](#faker)

### pgfilter

Builtin internal helpfull functions

#### default

##### `pgfilter.default.nul`

Replace the current value of the column by `NULL`( Postgres representation `\N`)

- Column type: `anything`

- Column must accept `nul` as a valid value

- Example:

	```json
	{
		"public.requests" : {
			"payload": "pgfilter.default.nul"
		}
	}
	```


##### `pgfilter.default.zlen`

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
##### `pgfilter.default.zlar`

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

#### filter
##### `pgfilter.filter.fnow-<dur>`

Evaluate the column value against the `dur` argument.
If column value match the duration, the row is allowed
to restore. Otherwise, the whole row is ignored and
won't be included in the restore.

- Column type: `timestamp`

- Arguments:

	- `dur`: [ISO8601DUR representation](https://en.wikipedia.org/wiki/ISO_8601#Durations).

- Example:

	For 60 days from now
	```javascript
	{
		"public.requests" : {
			"created": "pgfilter.filter.fnow-P60D" // 60 days of duration on the column
		}
	}
	```
### faker

All the functions on [faker.js](https://github.com/faker-js/faker) API are available.

For example:

- `faker.name.firstName`
- `faker.name.middleName`
- `faker.company.companyName`
- `faker.random.number`
- `faker.internet.password`


For more information. Check [faker API methods](https://github.com/faker-js/faker#api)
