#!/bin/bash -e
set -a
LOG=/vagrant/tmp/log/boot.log
set +a

NODE_VER=${NODE_VER:-16.x}
PGVERSION=${PGVERSION:-13}
PGDATABASE=${PGDATABASE:-dvdrental}
PGPORT=${PGPORT:-5432}
PGCLUSTER=${PGCLUSTER:-main}
PGUSER=${PGUSER:-dbadmin}
PGPASSWORD=${PGPASSWORD:-devved}
DB_SAMPLE_BACKUP_URL=${DB_SAMPLE_BACKUP_URL:-https://www.postgresqltutorial.com/wp-content/uploads/2019/05/dvdrental.zip}

mkdir -p /vagrant/tmp/log

# Hosts files
HOSTS=/etc/hosts

print_db_usage() {
	echo "Your environment has been setup:"
	echo ""
	echo "  Port: $PGPORT"
	echo "  Database: $PGDATABASE"
	echo "  Username: $PGUSER"
	echo "  Password: $PGPASSWORD"
	echo ""
	echo "psql access to app database user via VM:"
	echo "  vagrant ssh"
	echo "  sudo su - postgres"
	echo "  PGUSER=$PGUSER PGPASSWORD=$PGPASSWORD psql -h localhost $PGDATABASE"
	echo ""
	echo "Env variable for application development:"
	echo "  DATABASE_URL=postgresql://$PGUSER:$PGPASSWORD@*:$PGPORT/$PGDATABASE"
	echo ""
	echo "Local command to access the database via psql:"
	echo "  PGUSER=$PGUSER PGPASSWORD=$PGPASSWORD psql -h localhost -p $PGPORT $PGDATABASE"
	echo ""
	echo "  Getting into the box (terminal):"
	echo "  vagrant ssh"
	echo "  sudo su - postgres"
	echo ""
}

export DEBIAN_FRONTEND=noninteractive

PROVISIONED_ON=/etc/vm_provision_on_timestamp

echo "install postgresql..."
PG_REPO_APT_SOURCE=/etc/apt/sources.list.d/pgdg.list
if [ ! -f "$PG_REPO_APT_SOURCE" ]; then
	echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" >"$PG_REPO_APT_SOURCE"
	wget --quiet -O - http://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc | apt-key add -
fi

apt-get update

sudo apt-get install -y "python3-pip" "postgresql-server-dev-$PGVERSION" "postgresql-contrib-$PGVERSION"

echo "configure postgresql..."

PG_CONF="/etc/postgresql/$PGVERSION/main/postgresql.conf"
PG_HBA="/etc/postgresql/$PGVERSION/main/pg_hba.conf"

cat <<EOF | su - postgres -c psql
CREATE ROLE $PGUSER WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION PASSWORD '$PGPASSWORD';
EOF

sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "$PG_CONF"

if [ ! -z "$PGPORT" ]; then
	sed -i "/port = /c\port = $PGPORT" "$PG_CONF"
fi

echo "host    all             all             all                     md5" >>"$PG_HBA"

echo "Create test database..."
cat <<EOF | su - postgres -c psql
-- Delete db first
DROP DATABASE IF EXISTS $PGDATABASE;
-- Create the database:
CREATE DATABASE $PGDATABASE WITH OWNER $PGUSER;
-- auto explain for analyse all queries and inside functions
LOAD 'auto_explain';
SET auto_explain.log_min_duration = 0;
SET auto_explain.log_analyze = true;
EOF

systemctl restart postgresql@$PGVERSION-$PGCLUSTER

echo "Load sample db..."

mkdir -p /home/vagrant/pgfilter/vagrant/log/
usermod -G postgres,vagrant postgres

su - postgres -c "psql -d $PGDATABASE -f /home/vagrant/pgfilter/vagrant/backup/dvdrental.dump > /home/vagrant/pgfilter/vagrant/log/sampledb.log 2>/home/vagrant/pgfilter/vagrant/log/sampledb.err"

echo "Install nodejs..."

apt-get -y install build-essential
curl -sL "https://deb.nodesource.com/setup_$NODE_VER" | sudo -E bash -

echo "install node version ${NODE_VER}"
sudo apt-get install -y nodejs

echo "install competitors"
sudo pip install pganonymize

# Tag the provision time:
date >"$PROVISIONED_ON"

echo "Successfully created postgres dev virtual machine with Postgres"
echo ""
print_db_usage
