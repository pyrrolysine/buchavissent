#!/bin/bash

wait=5

check()
{
	cd sc-mint; ./list_incr.py; cd ..
	./update_owners.py
}

while true; do
	check
	sleep $wait
done


