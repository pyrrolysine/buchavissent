#!/bin/bash

count=$(wc owners)
cd sc-mint; ./list_incr.py
newcount=$(wc owners)

if [[ $count != $newcount ]]; then
	cd ..; ./apply_ownership.py
fi

