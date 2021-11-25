#!/usr/bin/python3

import os

with open('../minters', mode = 'r') as fd:
    lines = fd.readlines()
    latest = sum(1 if ' ' in line else 0 for line in lines)

with os.popen('./query_count.sh', mode = 'r') as fd: count = int(fd.read().strip())
print(count, 'NFTs minted to date')

nfts = {}
for line in lines:
    if 'w' in line:
        nfts[line.strip().split()[0]] = None

data = []

for i in range(latest + 1, count + 1):
    pos = hex(i)[2:].rjust(8, '0')
    print('Fetching', pos)
    with os.popen('./query_entry.sh ' + pos, mode = 'r') as fd: spec = fd.read().strip()
    hex_address = spec[0x02:0x42]
    lon = int(spec[0x42:0x52])
    lat = int(spec[0x52:0x62])
    latlon = str(lon) + ' ' + str(lat)
    id = str(lon) + 'w' + str(lat)
    if id not in nfts:
        print('NEW MINTING: ' + id)
        with os.popen('erdpy wallet bech32 --encode ' + hex_address, mode = 'r') as fd: address = fd.read().strip()
        data.append(latlon + ' ' + address)

if latest != count:
    with open('../minters', mode = 'a') as fd:
        for x in data:
            fd.write(x + '\n')

    os.system('cp ../minters ../owners')

