#!/bin/bash

pgfilter -f vagrant/test/dvdrental.default.json vagrant/backup/dvdrental.dump > dvdrental.transformed.dump -v

original_num_lines=$(wc vagrant/backup/dvdrental.dump -l)
trans_num_lines=$(wc dvdrental.transformed.dump -l)

if [ "$original_num_lines" -ne "$trans_num_lines" ]; then
  exit 1
fi

diff vagrant/backup/dvdrental.dump dvdrental.transformed.dump 2> /dev/null

if [ $? -eq 0 ]
then
  echo "Files are identical. Something wrong happended..."
  exit 1
else
  echo "Same number of lines and file are different"
  exit 0
fi
