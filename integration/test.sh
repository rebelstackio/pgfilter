#!/bin/bash

command=$(which pgfilter)

$command -vf vagrant/test/dvdrental.default.json vagrant/backup/dvdrental.dump > dvdrental.transformed.dump

original_num_lines=$(wc vagrant/backup/dvdrental.dump -l | cut -d ' ' -f 1)
trans_num_lines=$(wc dvdrental.transformed.dump -l | cut -d ' ' -f 1)
code=1

if [ "$original_num_lines" -ne "$trans_num_lines" ]; then
  echo "Different number of lines. Something wrong happended..."
  code=1
fi

if cmp -s vagrant/backup/dvdrental.dump dvdrental.transformed.dump; then
  echo "Files are identical. Something wrong happended..."
  rm dvdrental.transformed.dump
  code=1
else
  echo "Same number of lines and file are different"
  code=0
fi

rm dvdrental.transformed.dump
exit $code
