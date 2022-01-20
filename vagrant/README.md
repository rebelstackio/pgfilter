# pgfilter Dev Env

## Getting Started

```bash
vagrant up
```

Env Details:

- Postgresql 13 cluster on port 5432
- Node 16

## Sample Database

[dvdrental.dump](./backup/dvdrental.dump) contains a backup for a demo database. You can find the sample database details [here](https://www.postgresqltutorial.com/postgresql-sample-database/). This databases is already restored and ready for use in the vagrant environment.

## Testing

On vagrant vm
```sh
sudo npm install -g
```

then

```sh
cat vagrant/backup/dvdrental.dump | pgfilter -v -f vagrant/test/dvdrental.default.json > dvdrental.trans.dump
#or
pgfilter -v -f vagrant/test/dvdrental.default.json vagrant/backup/dvdrental.dump > dvdrental.trans.dump
#or
sudo su postgres
psql -p 5432 -c "CREATE DATABASE dvdrental_tran"
cat vagrant/backup/dvdrental.dump | pgfilter -v -f vagrant/test/dvdrental.default.json | psql -p 5432 -d dvdrental_tran
```
