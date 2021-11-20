#!/bin/bash

wait=5

check()
{
	./update_minters.sh
	./update_owners.py
}

while true; do
	check
	sleep $wait
done


