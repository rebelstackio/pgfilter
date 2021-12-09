# Filtering/Transformation builtin functions

Functions are represented as the following string:

```
<source>.<namespace>.<func_name>-<arg1>-<arg2>
```

- On some functions, arguments are required.

- sources: Function origin. Could be `pgfilter`, `faker`

- namespace: Function category

## pgfilter

### Filtering
#### pgfilter.time.fnow-<dur>

Filter timestamp columns based on a duration.

Column type: `timestamp`

Arguments:

- `dur`: ISO8601DUR representation.

Example:

For 60 days from now
```json
{
	"public.requests" : {
		"created": "pgfilter.time.fnow-P60D" // 60 days of duration on the column
	}
}
```

## faker

## Transformation

All the functions on [faker.js](https://marak.github.io/faker.js/) API are available on pgfilter.

For example:

- `faker.name.firstName`
- `faker.name.middleName`
- `faker.company.companyName`
- `faker.random.number`
- `faker.internet.password`


For more information. CHeck [faker API methods](https://marak.github.io/faker.js/#toc7__anchor)
