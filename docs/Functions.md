# Filtering/Transformation builtin functions

## Filtering

- `fnow`: ISO8601DUR representation. Apply to timestamp columns. Columns that do not match the duration will not be ignored

For 60 days from now
```json
{
	"public.requests" : {
		"created": "fnow-P60D" // 60 days of duration on the column
	}
}
```
## Transformation

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
